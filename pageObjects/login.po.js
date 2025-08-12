const { expect } = require("@playwright/test");

exports.LoginPage = class LoginPage {
  constructor(page) {
    this.page = page;
    // Form input fields
    this.email = '#id_login';
    this.password = '#id_password';
    
    // Initial login button on homepage
    this.dashboardLoginButton = '#navbarSupportedContent > ul.navbar-nav.ml-auto.dropdown.d-none.d-md-flex > li:nth-child(1) > a';
    
    // Submit button on login form
    this.loginButton = '#jsLogin';
    
    // Error messages
    this.invalidCredentialsError = "xpath=/html/body/div[3]/div[1]/div/div[2]/form/div[1]";
    this.emailRequiredError = "#error_1_id_login > strong";
    this.passwordRequiredError = "#error_1_id_password > strong";
  }

  login = async (email, password) => {
    console.log('Starting login process...');
    console.log(`Email: ${email}, Password length: ${password ? password.length : 0}`);
    
    try {
      // Navigate to the homepage with less strict conditions
      console.log('Navigating to homepage...');
      await this.page.goto("/", {
        waitUntil: "domcontentloaded",
        timeout: 30000
      });

      // Wait for the page to be interactive
      await this.page.waitForLoadState('domcontentloaded');
      
      // Wait specifically for the login button to be visible
      console.log('Waiting for login button...');
      const loginButton = await this.page.waitForSelector(this.dashboardLoginButton, {
        state: 'visible',
        timeout: 10000
      });
      
      // Click the initial login button
      console.log('Clicking initial login button...');
      await loginButton.click();
      
      // Wait for the login form to be visible
      console.log('Waiting for login form...');
      await this.page.waitForSelector(this.email, {
        state: 'visible',
        timeout: 10000
      });
      
      // Fill in credentials
      console.log('Filling credentials...');
      if (email !== undefined) {
        await this.page.locator(this.email).fill(email);
      }
      if (password !== undefined) {
        await this.page.locator(this.password).fill(password);
      }
      
      // Wait for and click the submit button
      console.log('Clicking submit button...');
      await this.page.waitForSelector(this.loginButton, {
        state: 'visible',
        timeout: 10000
      });
      await this.page.click(this.loginButton);
      
      // Wait a moment for error messages
      await this.page.waitForTimeout(2000);
      
    } catch (error) {
      console.error('Error during login process:', error);
      await this.page.screenshot({ path: 'error-state.png', fullPage: true });
      throw error;
    }
  };
  
  async verifyValidLogin() {
    await expect(this.page).toHaveURL("https://merojob.com/jobseeker/overview/");
  }

  async invalidLogin() {
    try {
      // Take a screenshot of the error state
      await this.page.screenshot({ path: 'error-validation.png', fullPage: true });
      
      // Check for required field errors first
      const emailError = await this.page.locator(this.emailRequiredError);
      const passwordError = await this.page.locator(this.passwordRequiredError);
      
      // Get the count of each error type
      const emailErrorCount = await emailError.count();
      const passwordErrorCount = await passwordError.count();
      
      console.log(`Found ${emailErrorCount} email errors and ${passwordErrorCount} password errors`);
      
      // If both fields are empty
      if (emailErrorCount > 0 && passwordErrorCount > 0) {
        console.log('Both fields are empty');
        await expect(emailError).toHaveText("This field is required.");
        await expect(passwordError).toHaveText("This field is required.");
        return;
      }
      
      // If only email is empty
      if (emailErrorCount > 0) {
        console.log('Email field is empty');
        await expect(emailError).toHaveText("This field is required.");
        return;
      }
      
      // If only password is empty
      if (passwordErrorCount > 0) {
        console.log('Password field is empty');
        await expect(passwordError).toHaveText("This field is required.");
        return;
      }
      
      // If no field errors, check for invalid credentials error
      console.log('Checking for invalid credentials error');
      await expect(this.page.locator(this.invalidCredentialsError)).toHaveText(
        "The e-mail address and/or password you specified are not correct."
      );
    } catch (error) {
      console.error('Error checking login validation:', error);
      await this.page.screenshot({ path: 'validation-error.png', fullPage: true });
      throw error;
    }
  }
};
