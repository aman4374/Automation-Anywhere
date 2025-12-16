// src/pages/LearningInstancePage.ts
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LearningInstancePage extends BasePage {
  readonly createInstanceButton: Locator;
  readonly instanceNameInput: Locator;
  readonly instanceDescriptionInput: Locator;
  readonly instanceTypeDropdown: Locator;
  readonly submitButton: Locator;
  readonly instanceList: Locator;

  constructor(page: Page) {
    super(page);
    this.createInstanceButton = page.locator('button:has-text("Create"), button:has-text("New")');
    this.instanceNameInput = page.locator('input[name="name"], input[placeholder*="name"]');
    this.instanceDescriptionInput = page.locator('textarea[name="description"]');
    this.instanceTypeDropdown = page.locator('select[name="type"], div[role="combobox"]');
    this.submitButton = page.locator('button:has-text("Submit"), button:has-text("Create")');
    this.instanceList = page.locator('[class*="instance-list"], table');
  }

  async createLearningInstance(name: string, description: string) {
    await this.clickElement(this.createInstanceButton);
    await this.fillInput(this.instanceNameInput, name);
    if (await this.instanceDescriptionInput.isVisible()) {
      await this.fillInput(this.instanceDescriptionInput, description);
    }
    await this.clickElement(this.submitButton);
    await this.waitForPageLoad();
  }

  async validateInstanceCreated(instanceName: string) {
    await expect(this.instanceList.locator(`text=${instanceName}`)).toBeVisible({ timeout: 10000 });
  }
}