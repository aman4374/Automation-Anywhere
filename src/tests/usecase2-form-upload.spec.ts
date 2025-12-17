// src/tests/usecase2-form-upload.spec.ts

import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { FormPage } from '../pages/FormPage';
import { testCredentials, testData } from '../test-data/credentials';
import { getTestFilePath } from '../utils/helpers';
import path from 'path';

test.describe('Use Case 2: Form with Upload Flow - UI Automation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Should successfully create a form with textbox and file upload', async ({
    page
  }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const formPage = new FormPage(page);

    await test.step('Login', async () => {
      await loginPage.login(
        testCredentials.validUser.username,
        testCredentials.validUser.password
      );
      await page.waitForURL(/home/, { timeout: 30000 });
      console.log('✓ Successfully logged in');
    });

    await test.step('Navigate to Automation', async () => {
      await dashboardPage.navigateToAutomation();
      console.log('✓ Navigated to Automation');
    });

    await test.step('Create Form', async () => {
      await dashboardPage.clickCreateDropdown();
      await dashboardPage.selectForm();
      await formPage.validateFormCreationElements();
      await formPage.createForm(
        testData.form.name,
        testData.form.description
      );
    });

    await test.step('Add Text Area', async () => {
      await formPage.dragAndDropTextBox();
      await formPage.validateTextBoxOnCanvas();
    });

    await test.step('Add File Upload', async () => {
      await formPage.dragAndDropFileUpload();
      await formPage.validateFileUploadOnCanvas();
    });

    await test.step('Enter Text', async () => {
      await formPage.enterTextInTextBox(
        testData.form.textBoxValue
      );
    });

    await test.step('Upload File', async () => {
      const filePath = path.resolve(getTestFilePath());
      await formPage.uploadFile(filePath);
    });

    await test.step('Save Form', async () => {
      await formPage.saveForm();
      await formPage.validateFileUploadSuccess();
    });

    await test.step('Final Validation', async () => {
      expect(await page.title()).toBeTruthy();
      console.log(
        '✅ Use Case 2 completed successfully'
      );
    });
  });
});
