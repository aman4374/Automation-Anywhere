// src/tests/usecase3-learning-api.spec.ts
import { test, expect, request } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { LearningInstancePage } from '../pages/LearningInstancePage';
import { testCredentials, testData } from '../test-data/credentials';
import { APIHelper } from '../utils/api-helper';

test.describe('Use Case 3: Learning Instance API Flow - API Automation', () => {
  let apiHelper: APIHelper;

  test.beforeAll(async ({ playwright }) => {
    const requestContext = await playwright.request.newContext({
      baseURL: process.env.BASE_URL || 'https://community.cloud.automationanywhere.digital',
    });
    apiHelper = new APIHelper(requestContext);
  });

  test('Should create Learning Instance via API with full validation', async ({ page }) => {
    // Step 1: Login via API and get token
    let authToken: string;
    await test.step('Perform API login', async () => {
      authToken = await apiHelper.login(
        testCredentials.validUser.username,
        testCredentials.validUser.password
      );
      expect(authToken).toBeTruthy();
      console.log('✓ API login successful');
    });

    // Step 2: Navigate to Learning Instance (to identify API endpoints)
    await test.step('Navigate to Learning Instance in UI', async () => {
      const loginPage = new LoginPage(page);
      const dashboardPage = new DashboardPage(page);
      
      await page.goto('/');
      await loginPage.login(testCredentials.validUser.username, testCredentials.validUser.password);
      
      // Start monitoring network requests
      page.on('request', request => {
        if (request.url().includes('learning-instance') || request.url().includes('ai')) {
          console.log(`📡 Request: ${request.method()} ${request.url()}`);
        }
      });
      
      page.on('response', response => {
        if (response.url().includes('learning-instance') || response.url().includes('ai')) {
          console.log(`📥 Response: ${response.status()} ${response.url()}`);
        }
      });
      
      await dashboardPage.navigateToLearningInstance();
      console.log('✓ Navigated to Learning Instance - Check console for API endpoints');
    });

    // Step 3: Create Learning Instance via API
    let createdInstanceId: string;
    let createResponse: any;
    
    await test.step('Create Learning Instance via API', async () => {
      const instanceData = {
        name: testData.learningInstance.name,
        description: testData.learningInstance.description,
        type: testData.learningInstance.type,
      };

      createResponse = await apiHelper.createLearningInstance(instanceData);
      
      // Validation 1: HTTP Status Code
      expect(createResponse.ok()).toBeTruthy();
      expect(createResponse.status()).toBe(201); // or 200 depending on API
      console.log(`✓ Status Code: ${createResponse.status()}`);
    });

    // Step 4: Validate Response Time (Optional but preferred)
    await test.step('Validate response time', async () => {
      // Note: Playwright doesn't provide direct timing, but we can measure
      const startTime = Date.now();
      await apiHelper.createLearningInstance({
        name: `TimeTest_${Date.now()}`,
        description: 'Response time test',
        type: 'classification',
      });
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      
      expect(responseTime).toBeLessThan(5000); // Should respond within 5 seconds
      console.log(`✓ Response Time: ${responseTime}ms`);
    });

    // Step 5: Validate Response Body Schema
    await test.step('Validate response body schema and fields', async () => {
      const responseBody = await createResponse.json();
      
      // Field-level checks
      expect(responseBody).toHaveProperty('id');
      expect(responseBody).toHaveProperty('name');
      expect(responseBody).toHaveProperty('status');
      
      expect(responseBody.name).toBe(testData.learningInstance.name);
      expect(responseBody.status).toBeTruthy();
      
      createdInstanceId = responseBody.id;
      console.log('✓ Response body schema validated');
      console.log(`✓ Created Instance ID: ${createdInstanceId}`);
    });

    // Step 6: Validate Functional Accuracy
    await test.step('Validate instance created with correct data', async () => {
      const getResponse = await apiHelper.getLearningInstance(createdInstanceId);
      
      expect(getResponse.ok()).toBeTruthy();
      const instance = await getResponse.json();
      
      expect(instance.id).toBe(createdInstanceId);
      expect(instance.name).toBe(testData.learningInstance.name);
      expect(instance.description).toBe(testData.learningInstance.description);
      
      console.log('✓ Functional accuracy validated');
      console.log('✓ Instance data matches creation request');
    });

    // Step 7: Verify in UI
    await test.step('Verify created instance appears in UI', async () => {
      const learningInstancePage = new LearningInstancePage(page);
      await page.reload();
      await learningInstancePage.validateInstanceCreated(testData.learningInstance.name);
      console.log('✓ Instance visible in UI');
    });

    // Cleanup
    await test.step('Cleanup - Delete test instance', async () => {
      const deleteResponse = await apiHelper.deleteLearningInstance(createdInstanceId);
      expect(deleteResponse.ok()).toBeTruthy();
      console.log('✓ Test instance deleted');
    });

    // Final Summary
    await test.step('Final validation summary', async () => {
      console.log('✅ Use Case 3: Complete - Learning Instance API validation successful');
      console.log('   ✓ HTTP Status Code: Validated');
      console.log('   ✓ Response Time: Validated');
      console.log('   ✓ Response Body Schema: Validated');
      console.log('   ✓ Functional Accuracy: Validated');
    });
  });

  test('Should validate error handling for invalid API requests', async () => {
    // Test invalid data
    await test.step('Test API with invalid data', async () => {
      const invalidData = {
        name: '', // Empty name should fail
        description: 'Invalid test',
      };

      const response = await apiHelper.createLearningInstance(invalidData);
      expect(response.ok()).toBeFalsy();
      expect([400, 422]).toContain(response.status());
      console.log('✓ Invalid request properly rejected');
    });
  });
});