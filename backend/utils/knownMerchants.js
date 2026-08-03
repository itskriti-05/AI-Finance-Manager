// Known merchants that can be categorized instantly, without any AI call.
// Add to this list as you notice more recurring brands in your statements.
const knownMerchants = {
  SWIGGY: 'Food',
  ZOMATO: 'Food',
  DOMINOS: 'Food',
  MEESHO: 'Shopping',
  MYNTRA: 'Shopping',
  MYNTRADE: 'Shopping', // seen in sample data - Myntra's payment gateway name
  AMAZON: 'Shopping',
  FLIPKART: 'Shopping',
  BOAT: 'Electronics',
  UBER: 'Travel',
  OLA: 'Travel',
  IRCTC: 'Travel',
  NETFLIX: 'Entertainment',
  SPOTIFY: 'Entertainment',
  JIO: 'Bills',
  AIRTEL: 'Bills'
};

module.exports = knownMerchants;