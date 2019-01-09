module.exports = {
  "root": true,
  "extends": ["eslint:recommended", "plugin:vue/essential"],
  "env": {
    "browser": true,
    "node": true
  },
  "plugins": [
    "vue"
  ],
  "parserOptions": {
    "parser": "babel-eslint",
    "sourceType": "module"
  },
  "rules": {
    "comma-dangle": ["error", "never"], // 句末逗号
    "semi": ["error", "always"], // 句末分号
    "no-console": 1
  }
};
