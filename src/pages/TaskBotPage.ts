// // src/pages/TaskBotPage.ts
// import { Page, Locator, expect } from "@playwright/test";
// import { BasePage } from "./BasePage";

// export class TaskBotPage extends BasePage {
//   readonly taskNameInput: Locator;
//   readonly taskDescriptionInput: Locator;
//   readonly folderSelector: Locator;
//   readonly createButton: Locator;
//   readonly actionsPanel: Locator;
//   readonly searchActionsInput: Locator;
//   readonly messageBoxAction: Locator;
//   readonly messageBoxTitleInput: Locator;
//   readonly messageBoxMessageInput: Locator;
//   readonly messageBoxTypeDropdown: Locator;
//   readonly saveButton: Locator;
//   readonly successMessage: Locator;
//   readonly runButton: Locator;

//   constructor(page: Page) {
//     super(page);

//     // ✅ UPDATED with actual selectors
//     this.taskNameInput = page.locator('input[name="name"]');
//     this.taskDescriptionInput = page.locator('textarea[name="description"]');
//     this.folderSelector = page.locator('select[name="folder"]');
//     this.createButton = page.locator('button[name="submit"]');

//     // Actions panel
//     this.actionsPanel = page.locator(".editor-palette-search");
//     this.searchActionsInput = page.locator(
//       "input.editor-palette-search__input"
//     );

//     // Message Box - using text match since name="item-button" is generic
//     this.messageBoxAction = page
//       .locator('button[name="item-button"]')
//       .filter({ hasText: "Message Box" });

//     // Message Box configuration (contenteditable div)
//     this.messageBoxTitleInput = page.locator('input[name="title"]');
//     this.messageBoxMessageInput = page.locator(
//       'div[contenteditable="true"][role="textbox"][name="content"]'
//     );
//     this.messageBoxTypeDropdown = page.locator('select[name="type"]');

//     // Save and Run buttons
//     this.saveButton = page.locator('button[name="save"]');
//     this.runButton = page.locator('button[name="run"]');
//     this.successMessage = page.locator('[class*="success"], [role="alert"]');
//   }

//   async createTaskBot(name: string, description: string) {
//     await this.fillInput(this.taskNameInput, name);
//     if (await this.taskDescriptionInput.isVisible()) {
//       await this.fillInput(this.taskDescriptionInput, description);
//     }
//     await this.clickElement(this.createButton);
//     await this.waitForPageLoad();
//   }

//   async validateTaskBotFormElements() {
//     await expect(this.taskNameInput).toBeVisible();
//     await expect(this.createButton).toBeVisible();
//   }

//   async waitForActionsPanelToLoad() {
//     const overlay = this.page.locator(".loadable__overlay");

//     if ((await overlay.count()) > 0) {
//       await overlay.first().waitFor({
//         state: "hidden",
//         timeout: 30000,
//       });
//       console.log("✓ Actions panel overlay disappeared");
//     }
//     await this.page.waitForTimeout(1000);
//   }

//   async searchAndAddMessageBox() {
//     await expect(this.actionsPanel).toBeVisible();
//     console.log("✓ Actions panel is visible");
//     await this.waitForActionsPanelToLoad();
//     await this.fillInput(this.searchActionsInput, "Message Box");
//     console.log("✓ Searched for Message Box action");
//     await this.messageBoxAction.waitFor({ state: "visible" });
//     console.log("✓ Message Box action is visible in the actions panel");
//     await this.messageBoxAction.dblclick();
//     console.log("✓ Message Box action double-clicked to add to workflow");
//     await this.page.waitForTimeout(1000);
//   }

//   async configureMessageBox(message: string) {
//     // The message input is a contenteditable div, not a regular input
//     await this.messageBoxMessageInput.waitFor({ state: "visible" });
//     await this.messageBoxMessageInput.click();

//     // Clear existing content
//     await this.page.keyboard.press("Control+A");
//     await this.page.keyboard.press("Backspace");

//     // Type the message
//     await this.messageBoxMessageInput.type(message);

//     console.log("✓ Message box configured");
//   }

//   async validateMessageBoxPanel() {
//     await expect(this.messageBoxMessageInput).toBeVisible();
//   }

//   async saveConfiguration() {
//     await this.clickElement(this.saveButton);
//     await this.page.waitForTimeout(2000);
//   }

//   async runTaskBot() {
//     await this.clickElement(this.runButton);
//     await this.page.waitForTimeout(2000);
//     console.log("✓ Task bot executed");
//   }

//   async validateSuccessMessage() {
//     await expect(this.successMessage).toBeVisible({ timeout: 10000 });
//   }
// }


// src/pages/TaskBotPage.ts
import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class TaskBotPage extends BasePage {
  readonly taskNameInput: Locator;
  readonly taskDescriptionInput: Locator;
  readonly folderSelector: Locator;
  readonly createButton: Locator;
  readonly actionsPanel: Locator;
  readonly searchActionsInput: Locator;
  readonly messageBoxAction: Locator;
  readonly messageBoxTitleInput: Locator;
  readonly messageBoxMessageInput: Locator;
  readonly messageBoxTypeDropdown: Locator;
  readonly saveButton: Locator;
  readonly successMessage: Locator;
  readonly runButton: Locator;

  constructor(page: Page) {
    super(page);

    // ✅ UPDATED with actual selectors
    this.taskNameInput = page.locator('input[name="name"]');
    this.taskDescriptionInput = page.locator('textarea[name="description"]');
    this.folderSelector = page.locator('select[name="folder"]');
    this.createButton = page.locator('button[name="submit"]');

    // Actions panel
    this.actionsPanel = page.locator(".editor-palette-search");
    this.searchActionsInput = page.locator(
      "input.editor-palette-search__input"
    );

    // Message Box - using text match since name="item-button" is generic
    this.messageBoxAction = page
      .locator('button[name="item-button"]')
      .filter({ hasText: "Message Box" });

    // Message Box configuration (contenteditable div)
    this.messageBoxTitleInput = page.locator('input[name="title"]');
    this.messageBoxMessageInput = page.locator(
      'div[contenteditable="true"][role="textbox"][name="content"]'
    );
    this.messageBoxTypeDropdown = page.locator('select[name="type"]');

    // Save and Run buttons
    this.saveButton = page.locator('button[name="save"]');
    // ✅ FIXED: Using aria-label as provided
    //this.runButton = page.locator('button[aria-label="Run"]');
    // In constructor, replace the runButton line with:
    this.runButton = page.locator('button[aria-label="Run"], button[name="run"]').first();
    this.successMessage = page.locator('[class*="success"], [role="alert"]');
  }

  async createTaskBot(name: string, description: string) {
    await this.fillInput(this.taskNameInput, name);
    if (await this.taskDescriptionInput.isVisible()) {
      await this.fillInput(this.taskDescriptionInput, description);
    }
    await this.clickElement(this.createButton);
    await this.waitForPageLoad();
  }

  async validateTaskBotFormElements() {
    await expect(this.taskNameInput).toBeVisible();
    await expect(this.createButton).toBeVisible();
  }

  async waitForActionsPanelToLoad() {
    const overlay = this.page.locator(".loadable__overlay");

    if ((await overlay.count()) > 0) {
      await overlay.first().waitFor({
        state: "hidden",
        timeout: 30000,
      });
      console.log("✓ Actions panel overlay disappeared");
    }
    await this.page.waitForTimeout(1000);
  }

  async searchAndAddMessageBox() {
    await expect(this.actionsPanel).toBeVisible();
    console.log("✓ Actions panel is visible");
    await this.waitForActionsPanelToLoad();
    await this.fillInput(this.searchActionsInput, "Message Box");
    console.log("✓ Searched for Message Box action");
    await this.messageBoxAction.waitFor({ state: "visible" });
    console.log("✓ Message Box action is visible in the actions panel");
    await this.messageBoxAction.dblclick();
    console.log("✓ Message Box action double-clicked to add to workflow");
    await this.page.waitForTimeout(1000);
  }

  async configureMessageBox(message: string) {
    // The message input is a contenteditable div, not a regular input
    await this.messageBoxMessageInput.waitFor({ state: "visible" });
    await this.messageBoxMessageInput.click();

    // Clear existing content
    await this.page.keyboard.press("Control+A");
    await this.page.keyboard.press("Backspace");

    // Type the message
    await this.messageBoxMessageInput.type(message);

    console.log("✓ Message box configured");
  }

  async validateMessageBoxPanel() {
    await expect(this.messageBoxMessageInput).toBeVisible();
  }

  async saveConfiguration() {
    await this.clickElement(this.saveButton);
    await this.page.waitForTimeout(2000);
  }

  async runTaskBot() {
    console.log("Attempting to run Task Bot...");
    
    // Wait for run button to be visible and enabled
    await this.runButton.waitFor({ state: "visible", timeout: 10000 });
    console.log("✓ Run button is visible");
    
    // Click the run button
    await this.clickElement(this.runButton);
    console.log("✓ Run button clicked");
    
    // Wait for bot execution to start
    await this.page.waitForTimeout(3000);
    console.log("✓ Task bot execution initiated");
  }

  async validateSuccessMessage() {
    await expect(this.successMessage).toBeVisible({ timeout: 10000 });
  }
}