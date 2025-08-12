const { test, expect } = require("@playwright/test");
const { BlogPage } = require("../../pageObjects/blog.po");
const { LoginPage } = require("../../pageObjects/login.po");
const testData = require("../../Fixtures/Login.fixtures.json");

test.describe("Blog functionality", () => {
    test.beforeEach(async ({ page }) => {
        // Login before testing blog functionality
        const login = new LoginPage(page);
        await login.login(testData.validUser.email, testData.validUser.password);
    });

    test("search blog posts", async ({ page }) => {
        const blog = new BlogPage(page);

        // Navigate to blog page
        await blog.navigateToBlog();

        // Search for "manager" in blogs
        await blog.searchBlog("Manager");

        // Verify search results
        await blog.verifySearchResults();
    });
}); 