const { answerQuestion } = require('../agents/qnaAgent');

const askQuestion = async (req, res) => {
  const { question } = req.body;

  if (!question || typeof question !== 'string') {
    return res.status(400).json({ error: 'question is required' });
  }

  try {
    const result = await answerQuestion(req.userId, question);
    res.json(result);
  } catch (err) {
    console.error('Unexpected error in askQuestion:', err.message);
    res.json({
      answer: "I couldn't process that question right now - please try again in a moment.",
      toolUsed: null
    });
  }
};

module.exports = { askQuestion };