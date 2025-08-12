const { test, expect } = require("@playwright/test");
const { LoginPage } = require("../../pageObjects/login.po");
const { LogoutPage } = require("../../pageObjects/logout.po");
const testData = require("../../Fixtures/Login.fixtures.json");

test.describe("Logout functionality", () => {
    test.beforeEach(async ({ page }) => {
        // Login before testing logout
        const login = new LoginPage(page);
        await login.login(testData.validUser.email, testData.validUser.password);
    });

    test("successful logout", async ({ page }) => {
        const logout = new LogoutPage(page);

        // Perform logout
        await logout.logout();

        // Additional verification that we're on the homepage and logged out
        const loginButton = await page.waitForSelector('#navbarSupportedContent > ul > li:nth-child(5) > a');
        const buttonText = await loginButton.textContent();
        expect(buttonText).toContain('Employer Zone');
    });
}); 