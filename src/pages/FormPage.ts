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
  readonly textBoxOnCanvas: Locator;
  readonly fileUploadOnCanvas: Locator;
  readonly textBoxInput: Locator;
  readonly fileUploadButton: Locator;
  readonly fileInput: Locator;
  readonly saveFormButton: Locator;
  readonly uploadSuccessIndicator: Locator;

  constructor(page: Page) {
    super(page);
    this.formNameInput = page.locator('input[name="name"], input[placeholder*="name"]');
    this.formDescriptionInput = page.locator('textarea[name="description"]');
    this.createFormButton = page.locator('button:has-text("Create")');
    this.textBoxElement = page.locator('div:has-text("Textbox"), [data-element="textbox"]').first();
    this.selectFileElement = page.locator('div:has-text("Select File"), [data-element="file"]').first();
    this.canvas = page.locator('[class*="form-canvas"], [data-testid="form-canvas"]');
    this.textBoxOnCanvas = page.locator('[class*="textbox-component"]').first();
    this.fileUploadOnCanvas = page.locator('[class*="file-component"]').first();
    this.textBoxInput = page.locator('input[type="text"]').last();
    this.fileUploadButton = page.locator('input[type="file"]');
    this.fileInput = page.locator('input[type="file"]');
    this.saveFormButton = page.locator('button:has-text("Save")');
    this.uploadSuccessIndicator = page.locator('[class*="upload-success"], text=uploaded successfully');
  }

  async createForm(name: string, description: string) {
    await this.fillInput(this.formNameInput, name);
    if (await this.formDescriptionInput.isVisible()) {
      await this.fillInput(this.formDescriptionInput, description);
    }
    await this.clickElement(this.createFormButton);
    await this.waitForPageLoad();
  }

  async validateFormCreationElements() {
    await expect(this.formNameInput).toBeVisible();
    await expect(this.createFormButton).toBeVisible();
  }

  async dragAndDropTextBox() {
    await expect(this.textBoxElement).toBeVisible();
    await expect(this.canvas).toBeVisible();
    
    // Drag and drop textbox to canvas
    await this.textBoxElement.dragTo(this.canvas);
    await this.page.waitForTimeout(1000);
  }

  async dragAndDropFileUpload() {
    await expect(this.selectFileElement).toBeVisible();
    
    // Drag and drop file upload to canvas
    await this.selectFileElement.dragTo(this.canvas);
    await this.page.waitForTimeout(1000);
  }

  async validateTextBoxOnCanvas() {
    await this.clickElement(this.textBoxOnCanvas);
    await this.page.waitForTimeout(500);
    // Validate properties panel appears
    await expect(this.page.locator('[class*="properties-panel"]')).toBeVisible();
  }

  async validateFileUploadOnCanvas() {
    await this.clickElement(this.fileUploadOnCanvas);
    await this.page.waitForTimeout(500);
    // Validate properties panel appears
    await expect(this.page.locator('[class*="properties-panel"]')).toBeVisible();
  }

  async enterTextInTextBox(text: string) {
    await this.fillInput(this.textBoxInput, text);
  }

  async uploadFile(filePath: string) {
    await this.fileInput.setInputFiles(filePath);
    await this.page.waitForTimeout(2000);
  }

  async saveForm() {
    await this.clickElement(this.saveFormButton);
    await this.page.waitForTimeout(2000);
  }

  async validateFileUploadSuccess() {
    await expect(this.uploadSuccessIndicator).toBeVisible({ timeout: 10000 });
  }
}
