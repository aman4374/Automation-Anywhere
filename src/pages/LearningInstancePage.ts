// src/pages/LearningInstancePage.ts
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LearningInstancePage extends BasePage {
  readonly createInstanceButton: Locator;
  readonly instanceNameInput: Locator;
  readonly nextButton: Locator;
  readonly finalCreateButton: Locator;
  readonly validationElement: Locator;

  // Keeping these as optional/placeholders in case they appear between steps
  readonly instanceDescriptionInput: Locator;
  readonly instanceTypeDropdown: Locator;

  constructor(page: Page) {
    super(page);

    // 1. Create Learning Instance Button
    // HTML: name="create-button"
    this.createInstanceButton = page.locator('button[name="create-button"]');

    // 2. Name Input
    // HTML: name="name" (inside nested divs)
    this.instanceNameInput = page.locator('input[name="name"]');

    // 3. Next Button
    // HTML: name="submit" with text "Next"
    this.nextButton = page.locator('button[name="submit"]');

    // 4. Create Button (Final submit)
    // HTML: aria-label="Create" with text "Create"
    // Using aria-label is safer here as it doesn't have a unique name attribute in your snippet
    this.finalCreateButton = page.locator('button[aria-label="Create"]');

    // 5. Validation Element
    // HTML: <span class="rio-link__label">Validate documents (0)</span>
    this.validationElement = page.locator('.rio-link__label').filter({ hasText: 'Validate documents' });

    // Optional fields (retained generic selectors just in case)
    this.instanceDescriptionInput = page.locator('textarea[name="description"]');
    this.instanceTypeDropdown = page.locator('select[name="type"]');
  }

  /**
   * Flows through the creation wizard:
   * 1. Click "Create Learning Instance"
   * 2. Fill Name
   * 3. Click "Next"
   * 4. Click "Create"
   */
  async createLearningInstance(name: string, description: string) {
    // Step 1: Click initial create button
    await this.createInstanceButton.waitFor({ state: "visible" });
    await this.clickElement(this.createInstanceButton);
    console.log("✓ Clicked 'Create Learning Instance'");

    // Step 2: Fill Name
    await this.instanceNameInput.waitFor({ state: "visible" });
    await this.fillInput(this.instanceNameInput, name);
    console.log(`✓ Entered name: ${name}`);

    // (Optional) Fill Description if visible
    if (await this.instanceDescriptionInput.isVisible()) {
      await this.fillInput(this.instanceDescriptionInput, description);
    }

    // Step 3: Click Next
    // The "Next" button usually appears after filling details
    await this.nextButton.waitFor({ state: "visible" });
    await this.clickElement(this.nextButton);
    console.log("✓ Clicked 'Next'");

    // Step 4: Click Final Create
    await this.finalCreateButton.waitFor({ state: "visible" });
    await this.clickElement(this.finalCreateButton);
    console.log("✓ Clicked 'Create'");
    
    // Wait for the modal to close / page to load
    await this.page.waitForTimeout(2000); 
  }

  async validateInstanceCreated(instanceName: string) {
    // We check if the "Validate documents" link appears, which confirms the instance exists
    // You can also refine this to look for the specific row containing 'instanceName' if needed
    await expect(this.validationElement.first()).toBeVisible({ timeout: 15000 });
    console.log("✓ Validated instance creation (Found 'Validate documents' link)");
  }
}