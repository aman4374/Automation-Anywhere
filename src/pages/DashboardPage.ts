import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class DashboardPage extends BasePage {
  readonly automationMenu: Locator;
  readonly createDropdown: Locator;
  readonly createTaskBotOption: Locator;
  readonly createFormOption: Locator;
  readonly aiTab: Locator;
  readonly learningInstanceMenu: Locator;
  readonly botNameInput: Locator;
  readonly createAndEditButton: Locator;

  constructor(page: Page) {
    super(page);

    // ✅ UPDATED with actual selectors
    this.automationMenu = page.locator('[name="automations"]');
    this.createDropdown = page.locator('button[name="createOptions"]').filter({ hasText: 'Create' });
    this.createTaskBotOption = page.locator('button[name="createTaskbot"]');
    this.createFormOption = page.locator('button[name="create-attended-form"]'); // Update later when you find it
    this.aiTab = page.locator('[name="ai"]'); // Update later
    this.learningInstanceMenu = page.locator("text=Learning Instance"); // Update later
    this.botNameInput = page.locator('input[name="name"]');
    this.createAndEditButton = page.locator('button[name="submit"]');
  }

  async navigateToAutomation() {
    // Wait for the automation menu to be visible
    await this.automationMenu.waitFor({ state: "visible", timeout: 10000 });

    // Click the automation menu
    await this.clickElement(this.automationMenu);

    // Wait for navigation to complete
    await this.page.waitForURL("**/bots/repository**", { timeout: 10000 });
    await this.waitForPageLoad();

    console.log("✓ Navigated to Automation section");
  }

  async clickCreateDropdown() {

    // 1. Wait for visibility
    await this.createDropdown.waitFor({ state: "visible", timeout: 10000 });

    // 3. Click
    await this.clickElement(this.createDropdown);
    
    // 4. Verification: Wait for the menu to actually appear
    await this.createTaskBotOption.waitFor({ state: "visible" });
  }

  async selectTaskBot() {
    await this.clickElement(this.createTaskBotOption);
    await this.waitForPageLoad();
  }

  async selectForm() {
    await this.clickElement(this.createFormOption);
    await this.waitForPageLoad();
  }

  async navigateToLearningInstance() {
    await this.clickElement(this.aiTab);
    await this.clickElement(this.learningInstanceMenu);
    await this.waitForPageLoad();
  }

  async validateDashboardElements() {
    await expect(this.automationMenu).toBeVisible();
  }
}
