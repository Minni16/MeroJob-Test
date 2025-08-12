const { expect } = require("@playwright/test");

exports.LogoutPage = class LogoutPage {
    constructor(page) {
        this.page = page;

        // Selectors
        this.userProfileIcon = '#navbarSupportedContent > div > div > ul > li > a > img';
        this.userDropdownContainer = '#navbarSupportedContent > div > div > ul > li';
        this.logoutButton = '#navbarSupportedContent > div > div > ul > li > div > div.pb-2 > a:nth-child(5)';
        this.loginButton = '#navbarSupportedContent > ul > li:nth-child(5) > a'; // To verify logout
    }

    async logout() {
        try {
            console.log('Starting logout process...');

            // Wait for and click user profile icon (lady icon)
            console.log('Clicking user profile icon...');
            await this.page.waitForSelector(this.userProfileIcon, { state: 'visible', timeout: 10000 });
            await this.page.click(this.userProfileIcon);

            // Wait for dropdown to be visible
            console.log('Waiting for dropdown menu...');
            await this.page.waitForSelector(this.userDropdownContainer + ' div', { state: 'visible', timeout: 5000 });

            // Take screenshot of dropdown for verification
            await this.page.screenshot({ path: 'dropdown-menu.png' });

            // Wait for and click logout button
            console.log('Clicking logout button...');
            await this.page.waitForSelector(this.logoutButton, { state: 'visible', timeout: 5000 });
            await this.page.click(this.logoutButton);

            // Wait for navigation and verify we're logged out
            await this.page.waitForLoadState('networkidle');

            // Verify URL after logout
            console.log('Verifying logout URL...');
            const currentUrl = this.page.url();
            expect(currentUrl).toBe('https://merojob.com/');

            // Verify login button is visible (indicating we're logged out)
            console.log('Verifying logout successful...');
            await this.page.waitForSelector(this.loginButton, { state: 'visible', timeout: 10000 });

            console.log('Logout successful');

        } catch (error) {
            console.error('Error during logout:', error);
            await this.page.screenshot({ path: 'logout-error.png', fullPage: true });
            throw error;
        }
    }
}; 