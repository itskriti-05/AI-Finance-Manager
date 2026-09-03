const ALLOWED_CATEGORIES = [
  "Food",
  "Shopping",
  "Travel",
  "Bills",
  "Entertainment",
  "Electronics",
  "Personal Transfer",
  "Rent",
  "Groceries",
  "Other",
];

async function categorizeWithLLM(payee) {
  const prompt = `You are categorizing a bank transaction payee name for a personal finance app.
Payee: "${payee}"
Pick exactly ONE category from this list: ${ALLOWED_CATEGORIES.join(", ")}.
Reply with ONLY the category name, nothing else. If you are not sure, reply "Other".`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${process.env.LLM_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      },
    );

    const data = await response.json();
    const rawReply = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (rawReply && ALLOWED_CATEGORIES.includes(rawReply)) {
      return rawReply;
    }
    return "Other";
  } catch (err) {
    console.error("LLM categorization failed:", err.message);
    return "Other";
  }
}

module.exports = { categorizeWithLLM, ALLOWED_CATEGORIES };
