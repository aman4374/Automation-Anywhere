// src/tests/usecase2-form-upload.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { FormPage } from '../pages/FormPage';
import { testCredentials, testData } from '../test-data/credentials';
import { getTestFilePath } from '../utils/helpers';
import * as path from 'path';

test.describe('Use Case 2: Form with Upload Flow - UI Automation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Should successfully create a form with textbox and file upload', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const formPage = new FormPage(page);

    // Step 1: Login
    await test.step('Login to application', async () => {
      await loginPage.login(testCredentials.validUser.username, testCredentials.validUser.password);
      await page.waitForURL(/.*home/, { timeout: 30000 });
      console.log('✓ Successfully logged in');
    });

    // Step 2: Navigate to Automation
    await test.step('Navigate to Automation', async () => {
      await dashboardPage.navigateToAutomation();
      console.log('✓ Navigated to Automation section');
    });

    // Step 3: Click Create Dropdown
    await test.step('Click Create dropdown', async () => {
      await dashboardPage.clickCreateDropdown();
      await expect(dashboardPage.createFormOption).toBeVisible();
      console.log('✓ Create dropdown opened');
    });

    // Step 4: Select Form
    await test.step('Select Form option', async () => {
      await dashboardPage.selectForm();
      console.log('✓ Form creation page opened');
    });

    // Step 5: Validate Form Creation Elements
    await test.step('Validate form creation elements', async () => {
      await formPage.validateFormCreationElements();
      console.log('✓ Form creation elements validated');
    });

    // Step 6: Create Form
    await test.step('Fill form details and create', async () => {
      await formPage.createForm(testData.form.name, testData.form.description);
      console.log('✓ Form created successfully');
    });

    // Step 7: Drag and Drop Textbox
    await test.step('Drag and drop Textbox element to canvas', async () => {
      await formPage.dragAndDropTextBox();
      console.log('✓ Textbox added to canvas');
    });

    // Step 8: Validate Textbox on Canvas
    await test.step('Click on textbox and verify UI interactions', async () => {
      await formPage.validateTextBoxOnCanvas();
      console.log('✓ Textbox UI interactions verified');
    });

    // Step 9: Drag and Drop File Upload
    await test.step('Drag and drop Select File element to canvas', async () => {
      await formPage.dragAndDropFileUpload();
      console.log('✓ File upload element added to canvas');
    });

    // Step 10: Validate File Upload on Canvas
    await test.step('Click on file upload and verify UI interactions', async () => {
      await formPage.validateFileUploadOnCanvas();
      console.log('✓ File upload UI interactions verified');
    });

    // Step 11: Enter Text in Textbox
    await test.step('Enter text in the textbox', async () => {
      await formPage.enterTextInTextBox(testData.form.textBoxValue);
      console.log('✓ Text entered in textbox');
    });

    // Step 12: Upload Document
    await test.step('Upload document from shared folder', async () => {
      const filePath = path.resolve(getTestFilePath());
      await formPage.uploadFile(filePath);
      console.log('✓ Document uploaded');
    });

    // Step 13: Save Form
    await test.step('Save the form', async () => {
      await formPage.saveForm();
      console.log('✓ Form saved');
    });

    // Step 14: Validate File Upload Success
    await test.step('Verify document uploaded successfully', async () => {
      await formPage.validateFileUploadSuccess();
      console.log('✓ Document upload confirmed');
    });

    // Final Assertion
    await test.step('Final validation - Complete flow executed', async () => {
      expect(await page.title()).toBeTruthy();
      console.log('✅ Use Case 2: Complete - Form with file upload created successfully');
    });
  });
});