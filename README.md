# Automation Anywhere - Test Automation Project

Complete UI and API test automation for Automation Anywhere Community Edition using Playwright with TypeScript.

## 📋 Project Overview

This project automates three use cases:
1. **Message Box Task** - UI automation for creating a Task Bot with Message Box action
2. **Form with Upload Flow** - UI automation for form creation with file upload
3. **Learning Instance API** - API automation with comprehensive validations

## 🛠️ Tech Stack

- **Framework**: Playwright v1.40+
- **Language**: TypeScript
- **Design Pattern**: Page Object Model (POM)
- **Test Runner**: Playwright Test
- **Node Version**: 18.x or higher

## 📁 Project Structure

```
automation-anywhere-tests/
├── src/
│   ├── pages/                          # Page Object Models
│   │   ├── BasePage.ts                 # Base page with common methods
│   │   ├── LoginPage.ts                # Login page objects
│   │   ├── DashboardPage.ts            # Dashboard navigation
│   │   ├── TaskBotPage.ts              # Task Bot creation page
│   │   ├── FormPage.ts                 # Form builder page
│   │   └── LearningInstancePage.ts     # Learning instance page
│   ├── tests/                          # Test specifications
│   │   ├── usecase1-messagebox.spec.ts
│   │   ├── usecase2-form-upload.spec.ts
│   │   └── usecase3-learning-api.spec.ts
│   ├── utils/                          # Utility functions
│   │   ├── helpers.ts                  # Common helper functions
│   │   └── api-helper.ts               # API testing utilities
│   └── test-data/                      # Test data files
│       ├── credentials.ts              # Test credentials
│       └── sample-upload.txt           # Sample file for upload
├── playwright.config.ts                # Playwright configuration
├── package.json                        # Dependencies
├── tsconfig.json                       # TypeScript config
├── .env                                # Environment variables
└── README.md                           # This file
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Automation Anywhere Community Edition account

### Step 1: Clone/Download Project

```bash
# If you have the project files
cd automation-anywhere-tests

# Or create from scratch
mkdir automation-anywhere-tests
cd automation-anywhere-tests
```

### Step 2: Install Dependencies

```bash
# Initialize project
npm init -y

# Install Playwright and TypeScript
npm install -D @playwright/test @types/node typescript

# Install dotenv for environment variables
npm install dotenv

# Install Playwright browsers
npx playwright install

# Initialize TypeScript
npx tsc --init
```

### Step 3: Create Folder Structure

```bash
mkdir -p src/{pages,tests,utils,test-data}
```

### Step 4: Configure Environment Variables

Create a `.env` file in the root directory:

```env
AA_USERNAME=your-email@example.com
AA_PASSWORD=your-password
BASE_URL=https://community.cloud.automationanywhere.digital
```

**Important**: Add `.env` to `.gitignore` to protect credentials:

```bash
echo ".env" >> .gitignore
```

### Step 5: Create Test Data File

```bash
echo "This is a test document for file upload automation" > src/test-data/sample-upload.txt
```

### Step 6: Copy All Source Files

Copy all the provided code files to their respective directories:
- Page Object Models → `src/pages/`
- Test specifications → `src/tests/`
- Utilities → `src/utils/`
- Configuration files → Root directory

## ⚙️ Configuration

### playwright.config.ts

Key configurations:
- Base URL: Automation Anywhere Community Edition
- Browser: Chromium (default)
- Headless: false (to see test execution)
- Screenshots: On failure only
- Video: Retained on failure
- Test timeout: 60 seconds


## 🧪 Running Tests

### Run Specific Use Case

```bash
# Use Case 1: Message Box
npm run test:usecase1

# Use Case 2: Form Upload
npm run test:usecase2

# Use Case 3: Learning Instance API
npm run test:usecase3
```


## 📊 View Test Reports

```bash
# Open HTML report
npm run report

# Or directly
npx playwright show-report
```

## 🔍 Test Execution Flow

### Use Case 1: Message Box Task

1. Validate login page elements
2. Login to application
3. Navigate to Automation menu
4. Click Create dropdown
5. Select Task Bot
6. Fill mandatory details
7. Search for Message Box in Actions
8. Add Message Box via double-click
9. Verify all UI elements in right panel
10. Configure Message Box
11. Save configuration
12. Validate success message

### Use Case 2: Form with Upload

1. Login to application
2. Navigate to Automation menu
3. Click Create dropdown
4. Select Form
5. Fill mandatory details
6. Drag and drop Textbox to canvas
7. Validate Textbox UI interactions
8. Drag and drop Select File to canvas
9. Validate File Upload UI interactions
10. Enter text in textbox
11. Upload document
12. Save form
13. Verify upload success

### Use Case 3: Learning Instance API

1. Perform API login
2. Navigate to Learning Instance (identify endpoints)
3. Create instance via API
4. Validate HTTP status code (200/201)
5. Validate response time
6. Validate response body schema
7. Validate field-level data
8. Verify functional accuracy
9. Verify instance in UI
10. Cleanup test data

## 🎯 Assertions Covered

### UI Assertions
- ✅ Element visibility
- ✅ Element interactability
- ✅ Data entry validation
- ✅ Form submission behavior
- ✅ Success/error messages
- ✅ File upload status
- ✅ Complete functional flow

### API Assertions
- ✅ HTTP status codes (200, 201, 400, 422)
- ✅ Response time validation
- ✅ Response body schema validation
- ✅ Field-level data accuracy
- ✅ Functional correctness
- ✅ Error handling


## 📝 Important Notes

### Before First Run

1. **Update Credentials**: Add your actual Automation Anywhere credentials to `.env`
2. **Test File Path**: Ensure `sample-upload.txt` exists in `src/test-data/`
3. **API Endpoints**: Use browser DevTools Network tab to identify actual API endpoints

### Finding API Endpoints (Use Case 3)

1. Open Automation Anywhere in browser
2. Open DevTools (F12) → Network tab
3. Navigate to AI → Learning Instance
4. Observe XHR/Fetch requests
5. Note down:
   - Login endpoint
   - Create Learning Instance endpoint
   - Get Learning Instance endpoint
6. Update endpoints in `api-helper.ts`

### Common Issues

**Issue**: Tests fail with "Element not found"
- **Solution**: Update CSS selectors in Page Objects

**Issue**: Login fails
- **Solution**: Verify credentials in `.env` file

**Issue**: File upload fails
- **Solution**: Check file path in `helpers.ts`

**Issue**: API tests fail
- **Solution**: Verify API endpoints using Network tab


## 📦 Dependencies

```json
{
  "devDependencies": {
    "@playwright/test": "^1.40.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0"
  },
  "dependencies": {
    "dotenv": "^16.0.0"
  }
}
```

## 🎓 Best Practices Implemented

✅ Page Object Model (POM) design pattern
✅ Separation of concerns (Pages, Tests, Utils)
✅ Reusable helper functions
✅ Environment-based configuration
✅ Comprehensive assertions
✅ Error handling
✅ Test data management
✅ Clear test steps with logging
✅ HTML and JSON reporting

## 📧 Support

For issues or questions:
1. Check browser console for errors
2. Review Playwright documentation
3. Inspect application elements
4. Verify API endpoints


**Happy Testing! 🚀**