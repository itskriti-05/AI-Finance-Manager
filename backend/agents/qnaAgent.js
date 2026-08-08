const { toolDeclarations, toolFunctions } = require('../utils/qnaTools');

const MODEL = 'gemini-3.5-flash-lite';

function describeToolResult(toolName, data) {
  if (data.transactionCount === 0) {
    const subject = data.category || data.payee || 'that';
    return `I didn't find any transactions matching "${subject}" in the last ${data.days} days.`;
  }
  if (toolName === 'getTopCategories') {
    const list = (data.topCategories || []).map(c => `${c.category}: ₹${c.total}`).join(', ');
    return `Your top spending categories over the last ${data.days} days were: ${list}.`;
  }
  const subject = data.category || data.payee || 'total';
  return `You spent ₹${data.totalSpent} on ${subject} over the last ${data.days} days, across ${data.transactionCount} transaction(s).`;
}

async function callGemini(contents, tools) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${process.env.LLM_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        tools: tools ? [{ functionDeclarations: tools }] : undefined
      })
    }
  );
  return response.json();
}

async function answerQuestion(userId, question) {
  try {
    const augmentedQuestion = `${question}\n\n(Answer in Indian Rupees using the ₹ symbol, not $ or USD.)`;

    const firstResponse = await callGemini(
      [{ role: 'user', parts: [{ text: augmentedQuestion }] }],
      toolDeclarations
    );

    if (firstResponse.error) {
      console.error('Gemini API error:', JSON.stringify(firstResponse.error));
      return {
        answer: "I'm not able to answer that right now - please try again in a moment.",
        toolUsed: null
      };
    }

    const modelTurn = firstResponse?.candidates?.[0]?.content;
    const parts = modelTurn?.parts || [];
    const functionCallPart = parts.find(p => p.functionCall);
    const textPart = parts.find(p => p.text);

    if (!functionCallPart) {
      return {
        answer: textPart?.text || "I couldn't find a way to answer that from your transaction data yet - try asking about a specific category, merchant, or your overall spending.",
        toolUsed: null
      };
    }

    const functionCall = functionCallPart.functionCall;
    const { name, args, id } = functionCall;
    const toolFn = toolFunctions[name];

    if (!toolFn) {
      return {
        answer: "I'm not able to look that up yet - try asking about a specific category, merchant, or your overall spending.",
        toolUsed: name
      };
    }

    const argOrder = {
      getSpendByCategory: (a) => [a.category, a.days],
      getSpendByPayee: (a) => [a.payee, a.days],
      getTopCategories: (a) => [a.days, a.limit],
      getTotalSpend: (a) => [a.days]
    };
    const orderedArgs = argOrder[name] ? argOrder[name](args || {}) : [];

    const toolResult = await toolFn(userId, ...orderedArgs);

    const secondResponse = await callGemini([
      { role: 'user', parts: [{ text: augmentedQuestion }] },
      modelTurn,
      {
        role: 'user',
        parts: [{
          functionResponse: { id, name, response: toolResult }
        }]
      }
    ]);

    if (secondResponse.error) {
      console.error('Gemini API error (second call):', JSON.stringify(secondResponse.error));
      return {
       answer: describeToolResult(name, toolResult),
        toolUsed: name,
        rawData: toolResult
      };
    }

    const finalParts = secondResponse?.candidates?.[0]?.content?.parts || [];
    const finalText = finalParts.find(p => p.text)?.text;

    return {
      answer: finalText || describeToolResult(name, toolResult),
      toolUsed: name,
      rawData: toolResult
    };
  } catch (err) {
    console.error('Q&A agent unexpected error:', err.message);
    return {
      answer: "I couldn't process that question right now - please try again in a moment.",
      toolUsed: null
    };
  }
}

module.exports = { answerQuestion };