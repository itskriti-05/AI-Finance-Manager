const ESSENTIAL_CATEGORIES = ['Rent', 'Groceries', 'Bills', 'Travel'];
const DISCRETIONARY_CATEGORIES = ['Food', 'Shopping', 'Entertainment', 'Electronics', 'Personal Transfer', 'Other'];
const SAVINGS_CATEGORIES = ['Savings'];

function isEssential(category) {
  return ESSENTIAL_CATEGORIES.includes(category);
}
function isDiscretionary(category) {
  return DISCRETIONARY_CATEGORIES.includes(category);
}
function isSavings(category) {
  return SAVINGS_CATEGORIES.includes(category);
}

module.exports = {
  isEssential, isDiscretionary, isSavings,
  ESSENTIAL_CATEGORIES, DISCRETIONARY_CATEGORIES, SAVINGS_CATEGORIES
};