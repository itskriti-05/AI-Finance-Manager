const { getWeeklyAnalysis } = require('../agents/analysisAgent');
const sendError = require('../utils/sendError');

const getAnalysis = async (req, res) => {
  try {
    const analysis = await getWeeklyAnalysis(req.userId);
    res.json(analysis);
  } catch (err) {
    sendError(res, 500, 'Failed to generate analysis', err);
  }
};

module.exports = { getAnalysis };