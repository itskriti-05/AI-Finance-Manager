const THEME_KEY = "finwise_theme";

export const themeStorage = {
  get() {
    return localStorage.getItem(THEME_KEY);
  },

  set(theme) {
    localStorage.setItem(THEME_KEY, theme);
  },

  remove() {
    localStorage.removeItem(THEME_KEY);
  },
};