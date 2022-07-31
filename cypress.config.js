require('dotenv').config();
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  chromeWebSecurity: false,
  env: {
    notion_key: process.env.NOTION_KEY,
    database_key: process.env.NOTION_DATABASE_KEY,
    test_url: process.env.TEST_URL,
  },
  e2e: {
    setupNodeEvents(on, config) {
      config.env = process.env
      return config;
    },
  },
});
