const ESSENTIAL_CATEGORIES = ['Rent', 'Groceries', 'Bills', 'Travel'];
const DISCRETIONARY_CATEGORIES = ['Food', 'Shopping', 'Entertainment', 'Electronics', 'Personal Transfer', 'Other'];

function isEssential(category) {
  return ESSENTIAL_CATEGORIES.includes(category);
}

function isDiscretionary(category) {
  return DISCRETIONARY_CATEGORIES.includes(category);
}

module.exports = { isEssential, isDiscretionary, ESSENTIAL_CATEGORIES, DISCRETIONARY_CATEGORIES };