// src/tests/usecase1-messagebox.spec.ts
import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { DashboardPage } from "../pages/DashboardPage";
import { TaskBotPage } from "../pages/TaskBotPage";
import { testCredentials, testData } from "../test-data/credentials";

test.describe("Use Case 1: Message Box Task - UI Automation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Should successfully create a Task Bot with Message Box action", async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const taskBotPage = new TaskBotPage(page);

    // Step 1: Validate Login Page Elements
    await test.step("Validate login page elements", async () => {
      await loginPage.validateLoginPageElements();
      console.log("✓ Login page elements are visible");
    });

    // Step 2: Login to the application
    // Step 2: Login to the application
    await test.step("Login to application", async () => {
      await loginPage.login(
        testCredentials.validUser.username,
        testCredentials.validUser.password
      );
      await page.waitForURL(/.*home/, { timeout: 30000 });

      console.log("✓ Successfully logged in");
    });

    // Step 3: Validate Dashboard Elements
    await test.step("Validate dashboard elements", async () => {
      await dashboardPage.validateDashboardElements();
      console.log("✓ Dashboard loaded successfully");
    });

    // Step 4: Navigate to Automation
    await test.step("Navigate to Automation from left menu", async () => {
      await dashboardPage.navigateToAutomation();
      await expect(page).toHaveURL(/.*automation.*/);
      console.log("✓ Navigated to Automation section");
    });

    // Step 5: Click Create Dropdown
    await test.step("Click Create dropdown", async () => {
      await dashboardPage.clickCreateDropdown();
      await expect(dashboardPage.createTaskBotOption).toBeVisible();
      console.log("✓ Create dropdown opened");
    });

    // Step 6: Select Task Bot
    await test.step("Select Task Bot option", async () => {
      await dashboardPage.selectTaskBot();
      console.log("✓ Task Bot creation page opened");
    });

    // Step 7: Validate Task Bot Form Elements
    await test.step("Validate Task Bot form elements", async () => {
      await taskBotPage.validateTaskBotFormElements();
      console.log("✓ Task Bot form elements validated");
    });

    // Step 8: Fill Task Bot Details and Create
    await test.step("Fill mandatory details and create Task Bot", async () => {
      await taskBotPage.createTaskBot(
        testData.taskBot.name,
        testData.taskBot.description
      );
      console.log("✓ Task Bot created successfully");
    });

    // Step 9: Search for Message Box in Actions Panel
    await test.step("Search and add Message Box action", async () => {
      await taskBotPage.searchAndAddMessageBox();
      console.log("✓ Message Box action added");
    });

    // Step 10: Verify Message Box UI Elements
    await test.step("Verify all Message Box UI elements", async () => {
      await taskBotPage.validateMessageBoxPanel();
      console.log("✓ All Message Box UI elements are visible and interactive");
    });

    // Step 11: Configure Message Box
    await test.step("Configure Message Box with test data", async () => {
      await taskBotPage.configureMessageBox(
        testData.taskBot.messageBox.message
      );
      console.log("✓ Message Box configured");
    });

    // Step 12: Save Configuration
    await test.step("Save the configuration", async () => {
      await taskBotPage.saveConfiguration();
      console.log("✓ Configuration saved");
    });

    // Step 13: Validate Success Message
    await test.step("Validate success confirmation", async () => {
      await taskBotPage.validateSuccessMessage();
      console.log("✓ Task Bot created and saved successfully");
    });

    // Final Assertion: Verify complete flow
    await test.step("Final validation - Complete flow executed", async () => {
      expect(await page.title()).toBeTruthy();
      console.log(
        "✅ Use Case 1: Complete - Message Box Task created successfully"
      );
    });
  });

  test("Should validate proper data entry in Message Box", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const taskBotPage = new TaskBotPage(page);

    await loginPage.login(
      testCredentials.validUser.username,
      testCredentials.validUser.password
    );
    await dashboardPage.navigateToAutomation();
    await dashboardPage.clickCreateDropdown();
    await dashboardPage.selectTaskBot();

    await taskBotPage.createTaskBot(
      `DataValidation_${Date.now()}`,
      "Testing data entry validation"
    );

    await taskBotPage.searchAndAddMessageBox();

    // Test empty data validation
    await test.step("Validate empty field behavior", async () => {
      const titleValue = await taskBotPage.messageBoxTitleInput.inputValue();
      expect(titleValue).toBe("");
      console.log("✓ Empty field validation passed");
    });

    // Test data entry
    await taskBotPage.configureMessageBox( "Test Message");

    // Validate entered data
    await test.step("Validate entered data persists", async () => {
      const titleValue = await taskBotPage.messageBoxTitleInput.inputValue();
      const messageValue =
        await taskBotPage.messageBoxMessageInput.inputValue();

      expect(titleValue).toBe("Test Title");
      expect(messageValue).toBe("Test Message");
      console.log("✓ Data entry validation passed");
    });
  });
});
