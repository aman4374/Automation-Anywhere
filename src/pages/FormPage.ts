// // src/pages/FormPage.ts
// import { Page, Locator, expect } from '@playwright/test';
// import { BasePage } from './BasePage';

// export class FormPage extends BasePage {
//   readonly formNameInput: Locator;
//   readonly formDescriptionInput: Locator;
//   readonly createFormButton: Locator;
//   readonly textBoxElement: Locator;
//   readonly selectFileElement: Locator;
//   readonly canvas: Locator;
//   readonly textBoxOnCanvas: Locator;
//   readonly fileUploadOnCanvas: Locator;
//   readonly textBoxInput: Locator;
//   readonly fileUploadButton: Locator;
//   readonly fileInput: Locator;
//   readonly saveFormButton: Locator;
//   readonly uploadSuccessIndicator: Locator;

//   constructor(page: Page) {
//   super(page);
  
//   // ✅ FIX: Use the same selector as TaskBotPage (they share the same form)
//   this.formNameInput = page.locator('input[name="name"]');
//   this.formDescriptionInput = page.locator('textarea[name="description"]');
//   this.createFormButton = page.locator('button[name="submit"]'); // ← CHANGED from button:has-text("Create")
  
//   // Rest stays the same
//   this.textBoxElement = page.locator('div:has-text("Textbox"), [data-element="textbox"]').first();
//   this.selectFileElement = page.locator('div:has-text("Select File"), [data-element="file"]').first();
//   this.canvas = page.locator('[class*="form-canvas"], [data-testid="form-canvas"]');
//   this.textBoxOnCanvas = page.locator('[class*="textbox-component"]').first();
//   this.fileUploadOnCanvas = page.locator('[class*="file-component"]').first();
//   this.textBoxInput = page.locator('input[type="text"]').last();
//   this.fileUploadButton = page.locator('input[type="file"]');
//   this.fileInput = page.locator('input[type="file"]');
//   this.saveFormButton = page.locator('button:has-text("Save")');
//   this.uploadSuccessIndicator = page.locator('[class*="upload-success"], text=uploaded successfully');
// }

//   async createForm(name: string, description: string) {
//   await this.fillInput(this.formNameInput, name);
//   if (await this.formDescriptionInput.isVisible()) {
//     await this.fillInput(this.formDescriptionInput, description);
//   }
//   await this.clickElement(this.createFormButton);
  
//   // Wait for the form builder to load
//   await this.page.waitForLoadState('networkidle');
//   await this.page.waitForTimeout(2000);
//   console.log('✓ Form created, waiting for form builder to load');
// }

//   async validateFormCreationElements() {
//     await expect(this.formNameInput).toBeVisible();
//     await expect(this.createFormButton).toBeVisible();
//   }

//   async dragAndDropTextBox() {
//     await expect(this.textBoxElement).toBeVisible();
//     await expect(this.canvas).toBeVisible();
    
//     // Drag and drop textbox to canvas
//     await this.textBoxElement.dragTo(this.canvas);
//     await this.page.waitForTimeout(1000);
//   }

//   async dragAndDropFileUpload() {
//     await expect(this.selectFileElement).toBeVisible();
    
//     // Drag and drop file upload to canvas
//     await this.selectFileElement.dragTo(this.canvas);
//     await this.page.waitForTimeout(1000);
//   }

//   async validateTextBoxOnCanvas() {
//     await this.clickElement(this.textBoxOnCanvas);
//     await this.page.waitForTimeout(500);
//     // Validate properties panel appears
//     await expect(this.page.locator('[class*="properties-panel"]')).toBeVisible();
//   }

//   async validateFileUploadOnCanvas() {
//     await this.clickElement(this.fileUploadOnCanvas);
//     await this.page.waitForTimeout(500);
//     // Validate properties panel appears
//     await expect(this.page.locator('[class*="properties-panel"]')).toBeVisible();
//   }

//   async enterTextInTextBox(text: string) {
//     await this.fillInput(this.textBoxInput, text);
//   }

//   async uploadFile(filePath: string) {
//     await this.fileInput.setInputFiles(filePath);
//     await this.page.waitForTimeout(2000);
//   }

//   async saveForm() {
//     await this.clickElement(this.saveFormButton);
//     await this.page.waitForTimeout(2000);
//   }

//   async validateFileUploadSuccess() {
//     await expect(this.uploadSuccessIndicator).toBeVisible({ timeout: 10000 });
//   }
// }


// src/pages/FormPage.ts
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class FormPage extends BasePage {
  readonly formNameInput: Locator;
  readonly formDescriptionInput: Locator;
  readonly createFormButton: Locator;
  readonly textBoxElement: Locator;
  readonly selectFileElement: Locator;
  readonly canvas: Locator;
  readonly textAreaOnCanvas: Locator;
  readonly fileUploadOnCanvas: Locator;
  readonly textAreaInput: Locator;
  readonly fileUploadBrowseLink: Locator;
  readonly saveFormButton: Locator;
  readonly uploadSuccessIndicator: Locator;

  constructor(page: Page) {
    super(page);
    
    // Form creation fields
    this.formNameInput = page.locator('input[name="name"]');
    this.formDescriptionInput = page.locator('textarea[name="description"]');
    this.createFormButton = page.locator('button[name="submit"]');
    
    // ✅ FIXED: Elements in left panel (they are text links, not buttons!)
    this.textBoxElement = page.locator('button[name="item-button"]:has-text("Text Area")').first();
    this.selectFileElement = page.locator('text=Select File').first();
    
    // ✅ Canvas area (the white/blue drop zone in center)
    this.canvas = page.locator('.formcanvas-col-container, [class*="formcanvas"]').first();
    
    // ✅ Elements after dropped on canvas
    this.textAreaOnCanvas = page.locator('textarea.textinput-cell-input-control').first();
    this.fileUploadOnCanvas = page.locator('.preview-fileupload').first();
    
    // ✅ Input fields on canvas
    this.textAreaInput = page.locator('textarea.textinput-cell-input-control[aria-label*="Text"]');
    this.fileUploadBrowseLink = page.locator('a.preview-label__browseText');
    
    // Save button
    this.saveFormButton = page.locator('button[name="save"]');
    this.uploadSuccessIndicator = page.locator('[class*="success"], text=uploaded successfully');
  }

  async createForm(name: string, description: string) {
    await this.fillInput(this.formNameInput, name);
    if (await this.formDescriptionInput.isVisible()) {
      await this.fillInput(this.formDescriptionInput, description);
    }
    await this.clickElement(this.createFormButton);
    
    // Wait for the form builder to load
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(3000);
    console.log('✓ Form created, form builder loaded');
  }

  async validateFormCreationElements() {
    await expect(this.formNameInput).toBeVisible();
    await expect(this.createFormButton).toBeVisible();
  }

  async dragAndDropTextBox() {
    console.log('=== Starting Text Box Drag and Drop ===');
    
    // Wait for form builder to load
    await this.page.waitForTimeout(3000);
    console.log('✓ Form builder loaded');
    
    // Wait for the Elements panel to be visible
    await this.page.waitForSelector('text=Elements', { timeout: 10000 });
    console.log('✓ Elements panel found');
    
    // Take debug screenshot
    await this.page.screenshot({ path: 'debug-before-textbox.png', fullPage: true });
    
    // Find Text Box element
    const textBoxExists = await this.textBoxElement.count();
    console.log(`Text Box elements found: ${textBoxExists}`);
    
    if (textBoxExists === 0) {
      throw new Error('Text Box element not found in left panel');
    }
    
    // Scroll Text Box into view if needed
    await this.textBoxElement.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    console.log('✓ Text Box element visible');
    
    // Wait for canvas
    await this.canvas.waitFor({ state: 'visible', timeout: 10000 });
    console.log('✓ Canvas visible');
    
    // Get positions
    const textBoxBox = await this.textBoxElement.boundingBox();
    const canvasBox = await this.canvas.boundingBox();
    
    if (!textBoxBox || !canvasBox) {
      throw new Error('Could not get element positions');
    }
    
    console.log('Text Box position:', textBoxBox);
    console.log('Canvas position:', canvasBox);
    
    // Perform drag and drop
    await this.page.mouse.move(
      textBoxBox.x + textBoxBox.width / 2,
      textBoxBox.y + textBoxBox.height / 2
    );
    await this.page.waitForTimeout(300);
    
    await this.page.mouse.down();
    await this.page.waitForTimeout(500);
    console.log('✓ Mouse down on Text Box');
    
    await this.page.mouse.move(
      canvasBox.x + canvasBox.width / 2,
      canvasBox.y + 100, // Drop near top of canvas
      { steps: 10 }
    );
    await this.page.waitForTimeout(500);
    
    await this.page.mouse.up();
    await this.page.waitForTimeout(2000);
    console.log('✓ Dropped Text Box on canvas');
    
    // Verify
    await this.page.screenshot({ path: 'debug-after-textbox.png', fullPage: true });
    const textAreaCount = await this.textAreaOnCanvas.count();
    console.log(`Text areas on canvas: ${textAreaCount}`);
    
    console.log('✅ Text Box drag and drop completed\n');
  }

  async dragAndDropFileUpload() {
    console.log('=== Starting Select File Drag and Drop ===');
    
    await this.page.waitForTimeout(2000);
    
    // Take debug screenshot
    await this.page.screenshot({ path: 'debug-before-selectfile.png', fullPage: true });
    
    // Find Select File element
    const selectFileExists = await this.selectFileElement.count();
    console.log(`Select File elements found: ${selectFileExists}`);
    
    if (selectFileExists === 0) {
      throw new Error('Select File element not found in left panel');
    }
    
    // Scroll Select File into view if needed
    await this.selectFileElement.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    console.log('✓ Select File element visible');
    
    // Wait for canvas
    await this.canvas.waitFor({ state: 'visible', timeout: 10000 });
    
    // Get positions
    const fileBox = await this.selectFileElement.boundingBox();
    const canvasBox = await this.canvas.boundingBox();
    
    if (!fileBox || !canvasBox) {
      throw new Error('Could not get element positions');
    }
    
    console.log('Select File position:', fileBox);
    console.log('Canvas position:', canvasBox);
    
    // Perform drag and drop
    await this.page.mouse.move(
      fileBox.x + fileBox.width / 2,
      fileBox.y + fileBox.height / 2
    );
    await this.page.waitForTimeout(300);
    
    await this.page.mouse.down();
    await this.page.waitForTimeout(500);
    console.log('✓ Mouse down on Select File');
    
    await this.page.mouse.move(
      canvasBox.x + canvasBox.width / 2,
      canvasBox.y + 200, // Drop below text box
      { steps: 10 }
    );
    await this.page.waitForTimeout(500);
    
    await this.page.mouse.up();
    await this.page.waitForTimeout(2000);
    console.log('✓ Dropped Select File on canvas');
    
    // Verify
    await this.page.screenshot({ path: 'debug-after-selectfile.png', fullPage: true });
    const fileUploadCount = await this.fileUploadOnCanvas.count();
    console.log(`File upload elements on canvas: ${fileUploadCount}`);
    
    console.log('✅ Select File drag and drop completed\n');
  }

  async validateTextBoxOnCanvas() {
    await this.page.waitForTimeout(1000);
    await expect(this.textAreaOnCanvas).toBeVisible();
    console.log('✓ Text Box visible on canvas');
    
    // Click to select and show properties
    await this.textAreaOnCanvas.click();
    await this.page.waitForTimeout(500);
    console.log('✓ Text Box properties displayed');
  }

  async validateFileUploadOnCanvas() {
    await this.page.waitForTimeout(1000);
    await expect(this.fileUploadOnCanvas).toBeVisible();
    console.log('✓ File Upload visible on canvas');
    
    // Click to select and show properties
    await this.fileUploadOnCanvas.click();
    await this.page.waitForTimeout(500);
    console.log('✓ File Upload properties displayed');
  }

  async enterTextInTextBox(text: string) {
    await this.textAreaInput.waitFor({ state: 'visible', timeout: 5000 });
    await this.textAreaInput.click();
    await this.textAreaInput.fill(text);
    console.log(`✓ Entered text: "${text}"`);
  }

  async uploadFile(filePath: string) {
    // Click the browse link to trigger file input
    await this.fileUploadBrowseLink.waitFor({ state: 'visible', timeout: 5000 });
    
    // Find the hidden file input and upload
    const fileInput = this.page.locator('input[type="file"]');
    await fileInput.setInputFiles(filePath);
    
    await this.page.waitForTimeout(2000);
    console.log('✓ File selected for upload');
  }

  async saveForm() {
    await this.saveFormButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.clickElement(this.saveFormButton);
    await this.page.waitForTimeout(3000);
    console.log('✓ Form saved');
  }

  async validateFileUploadSuccess() {
    // Check if file name appears in the upload area
    const fileNameLocator = this.page.locator('.preview-fileupload').first();
    await expect(fileNameLocator).toBeVisible({ timeout: 10000 });
    console.log('✓ File upload validated');
  }
}

