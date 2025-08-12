const { expect } = require("@playwright/test");

exports.BlogPage = class BlogPage {
    constructor(page) {
        this.page = page;

        // Navigation selectors
        this.blogNavLink = '#navbarSupportedContent > ul > li:nth-child(2) > a';

        // Search elements
        this.searchInput = '#blogNavigation > form > div > input';
        this.searchButton = '#search_icon';

        // Search results selectors
        this.searchResultsText = 'body > div.container.my-3 > div > div.col-md-9 > div:nth-child(1) > div > strong';
        this.searchResultArticle = 'body > div.container.my-3 > div > div.col-md-9 > div.card.mt-3 > div.card-body > div > div.col-md-7 > h2 > a';
    }

    async navigateToBlog() {
        console.log('Navigating to blog page...');

        await this.page.waitForSelector(this.blogNavLink, { state: 'visible', timeout: 10000 });
        await this.page.click(this.blogNavLink);

        await this.page.waitForLoadState('domcontentloaded');

        const currentUrl = this.page.url();
        console.log('Current URL:', currentUrl);
        expect(currentUrl).toContain('/blog/');
    }

    async searchBlog(searchTerm) {
        console.log(`Searching for: ${searchTerm}`);

        try {
            await this.page.waitForLoadState('domcontentloaded');
            await this.page.waitForTimeout(1000);

            console.log('Looking for search input...');
            const searchInput = await this.page.waitForSelector(this.searchInput, {
                state: 'visible',
                timeout: 10000
            });

            console.log('Entering search term...');
            await searchInput.click();
            await searchInput.fill(searchTerm);

            await this.page.screenshot({ path: 'after-typing.png' });

            console.log('Submitting search...');
            await this.page.keyboard.press('Enter');

            // Wait for URL to update and navigation to complete
            await this.page.waitForURL('**/blog/search/**');
            await this.page.waitForLoadState('networkidle');

        } catch (error) {
            console.error('Error during search:', error);
            await this.page.screenshot({ path: 'search-error.png', fullPage: true });
            throw error;
        }
    }

    async verifySearchResults(expectedSearchTerm = 'Manager') {
        try {
            // Wait for a moment to ensure the page has loaded
            await this.page.waitForLoadState('networkidle');

            // Verify URL
            const currentUrl = this.page.url();
            console.log('Search results URL:', currentUrl);
            expect(currentUrl).toBe(`https://merojob.com/blog/search/?q=${expectedSearchTerm}`);

            // Wait for and verify "Search Results" text
            console.log('Verifying search results header...');
            const searchResultsElement = await this.page.waitForSelector(this.searchResultsText, {
                state: 'visible',
                timeout: 10000
            });
            const searchResultsText = await searchResultsElement.textContent();
            expect(searchResultsText).toContain('Search Results');

            // Wait for and verify specific article
            console.log('Verifying specific article presence...');
            const articleElement = await this.page.waitForSelector(this.searchResultArticle, {
                state: 'visible',
                timeout: 10000
            });
            const articleTitle = await articleElement.textContent();
            expect(articleTitle).toBe('Things Hiring Managers Expect During a Job Interview');

            // Take screenshot of results
            await this.page.screenshot({ path: 'search-results.png', fullPage: true });

            console.log('Search verification completed successfully');

        } catch (error) {
            console.error('Error verifying results:', error);
            await this.page.screenshot({ path: 'verification-error.png', fullPage: true });
            throw error;
        }
    }
}; 