# Gab Social Testing Suite

This project is an end-to-end testing suite built with **Playwright**, designed to comprehensively test the **Login** and **Dashboard** functionalities of **Gab Social**.

## 🔍 Overview

The test suite covers a wide range of user interaction scenarios, including:

- Validation of login functionality with various edge cases.
- Dashboard operations including CRUD actions on posts.
- Profile editing and logout flow.

---

## ✅ Login Page Tests

This section focuses on verifying all possible login edge cases and validation scenarios.

**Scenarios tested:**

- Login with invalid credentials
- Login with empty fields
- Login with empty email
- Login with empty password
- Login with leading space in email
- Login with leading space in password

---

## 🖥️ Dashboard Page Tests

Tests to ensure the core dashboard functionality works correctly.

**Scenarios tested:**

- Create a new post
- Edit an existing post
- Delete a post
- Edit user profile (update bio)
- Logout

---

## 🚀 Getting Started

### 1. Install Dependencies

Before running tests, make sure to install all required dependencies:

```bash
npm install
```

### 2. Install Playwright Browsers

Install the necessary browsers for Playwright:

```bash
npx playwright install
```

### 3. Run the Tests

To run all tests:

```bash
npx playwright test
```

To run tests in headed mode (visible browser):
```bash
npx playwright test --headed
```

To run all tests with a single Chromium browser instance (Recommended):
```bash
npx playwright test --headed --project=chromium --workers=1
```