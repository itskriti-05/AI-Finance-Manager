const pdfParse = require('pdf-parse');
const { detectSpecialTransaction } = require('./specialTransactionDetector');

const DATE_LINE_REGEX = /(\d{2}-\d{2}-\d{4})\n/g;
const AMOUNT_REGEX = /[\d,]+\.\d{2}/g;
const PAYEE_CHARS = 'A-Z0-9.@_-';

async function parsePdfBuffer(buffer) {
  const data = await pdfParse(buffer);
  const text = data.text;

  const results = [];
  const errors = [];

  const dateMatches = [];
  let m;
  while ((m = DATE_LINE_REGEX.exec(text)) !== null) {
    dateMatches.push({ dateStr: m[1], index: m.index });
  }

  for (let i = 0; i < dateMatches.length; i++) {
    const { dateStr, index } = dateMatches[i];
    const blockEnd = i + 1 < dateMatches.length ? dateMatches[i + 1].index : text.length;
    const rawBlock = text.slice(index, blockEnd);

    const chqMatch = rawBlock.match(/Chq:\s*\d+/);
    const particularsPart = chqMatch ? rawBlock.slice(0, chqMatch.index) : rawBlock;
    const afterChqPart = chqMatch ? rawBlock.slice(chqMatch.index + chqMatch[0].length) : '';

    const flatParticulars = particularsPart.replace(/\s+/g, '');

    const typeMatch = flatParticulars.match(/UPI\/(DR|CR)\//);
    const payeeRegex = new RegExp(`UPI\\/(?:DR|CR)\\/\\d+\\/([${PAYEE_CHARS}]+)\\/`);
    const payeeMatch = flatParticulars.match(payeeRegex);

   if (!typeMatch || !payeeMatch) {
      const special = detectSpecialTransaction(rawBlock);

      if (special) {
        const normalizedAfter = rawBlock.replace(/\s+/g, ' ').trim();
        const amounts = normalizedAfter.match(AMOUNT_REGEX);

        if (amounts && amounts.length > 0) {
          const [day, month, year] = dateStr.split('-').map(Number);
          const date = new Date(year, month - 1, day);

          results.push({
            date,
            type: 'DR',
            payee: special.payee,
            amount: parseFloat(amounts[0].replace(/,/g, '')),
            balance: amounts.length > 1 ? parseFloat(amounts[1].replace(/,/g, '')) : null,
            category: special.category,
            confidence: 'high',
            rawParticulars: rawBlock.replace(/\s+/g, ' ').trim().slice(0, 200)
          });
          continue;
        }
      }

      errors.push({
        dateStr,
        reason: 'Not a recognizable UPI transaction (non-UPI transactions are not yet supported)',
        preview: rawBlock.replace(/\s+/g, ' ').trim().slice(0, 80)
      });
      continue;
    }

    const normalizedAfter = afterChqPart.replace(/\s+/g, ' ').trim();
    const amounts = normalizedAfter.match(AMOUNT_REGEX);

    if (!amounts || amounts.length === 0) {
      errors.push({ dateStr, reason: 'Could not find an amount in this row', preview: rawBlock.slice(0, 80) });
      continue;
    }

    const amount = parseFloat(amounts[0].replace(/,/g, ''));
    const balance = amounts.length > 1 ? parseFloat(amounts[1].replace(/,/g, '')) : null;

    const [day, month, year] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    results.push({
      date,
      type: typeMatch[1],
      payee: payeeMatch[1].trim(),
      amount,
      balance,
      rawParticulars: rawBlock.replace(/\s+/g, ' ').trim().slice(0, 200)
    });
  }

  return { results, errors };
}

module.exports = { parsePdfBuffer };