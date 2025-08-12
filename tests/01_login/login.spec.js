const { test, expect } = require("@playwright/test");
const testData = require("../../Fixtures/Login.fixtures.json");
const { LoginPage } = require("../../pageObjects/login.po");

test.describe.configure({ mode: 'serial' });

test.describe("Login test", () => {
  test.setTimeout(120000);

  test.beforeEach(async ({ page }) => {
    console.log('Starting new test...');
  });

  test.afterEach(async ({ page }) => {
    console.log('Test completed');
  });

  test.describe("invalid login tests", () => {
    test("login invalid", async ({ page }) => {
      console.log('Running invalid login test...');
      const login = new LoginPage(page);
      await login.login(
        testData.invalidUser.invalidCredentials.email,
        testData.invalidUser.invalidCredentials.password
      );
      await login.invalidLogin();
    });

    test("empty field", async ({ page }) => {
      const login = new LoginPage(page);
      await login.login(
        testData.invalidUser.emptyField.email,
        testData.invalidUser.emptyField.password
      );
      await login.invalidLogin();
    });

    test("email empty", async ({ page }) => {
      const login = new LoginPage(page);
      await login.login(
        testData.invalidUser.emptyEmail.email,
        testData.invalidUser.emptyEmail.password
      );
      await login.invalidLogin();
    });

    test("Password empty", async ({ page }) => {
      const login = new LoginPage(page);
      await login.login(
        testData.invalidUser.emptyPassword.email,
        testData.invalidUser.emptyPassword.password
      );
      await login.invalidLogin();
    });
  });

  test.describe("valid login test", () => {
    test("valid login", async ({ page }) => {
      const login = new LoginPage(page);
      await login.login(testData.validUser.email, testData.validUser.password);
      await login.verifyValidLogin();
    });
  });
});