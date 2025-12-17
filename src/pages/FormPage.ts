// src/pages/FormPage.ts
import { Page, Locator, Frame, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class FormPage extends BasePage {
  readonly formNameInput: Locator;
  readonly formDescriptionInput: Locator;
  readonly createFormButton: Locator;
  readonly saveFormButton: Locator;

  constructor(page: Page) {
    super(page);
    this.formNameInput = page.locator('input[name="name"]');
    this.formDescriptionInput = page.locator('textarea[name="description"]');
    this.createFormButton = page.locator('button[name="submit"]');
    this.saveFormButton = page.locator('button[name="save"]');
  }

  /**
   * 🔍 ROBUST FRAME HUNTER
   * Retries scanning all frames for 20 seconds until the "Text Area" button appears.
   */
  async findEditorFrame(): Promise<Frame | Page> {
    console.log("🔍 Hunting for Form Editor Frame...");
    
    // Try for up to 20 seconds (10 attempts x 2000ms)
    for (let attempt = 1; attempt <= 10; attempt++) {
        const frames = this.page.frames();
        
        // Log what we see on this attempt
        if (attempt === 1) {
            console.log(`   Attempt ${attempt}: Found ${frames.length} frames.`);
            frames.forEach(f => console.log(`   - Frame: ${f.name()} | URL: ${f.url().substring(0, 50)}...`));
        }

        for (const frame of frames) {
            try {
                // Check for the specific button that ONLY exists in the editor
                const btnCount = await frame.locator('button:has([data-text="Text Area"])').count();
                
                if (btnCount > 0) {
                    console.log(`✅ MATCH! Found Form Builder in frame: "${frame.url()}"`);
                    return frame;
                }
            } catch (e) {
                // Ignore cross-origin errors
            }
        }

        // Wait 2 seconds before retrying
        console.log(`   ...Frame content not ready yet. Retrying (${attempt}/10)...`);
        await this.page.waitForTimeout(2000);
    }

    throw new Error("❌ CRITICAL: Could not find Form Editor iframe after 20 seconds. Please check if the UI has changed.");
  }

  async createForm(name: string, description: string) {
    await this.fillInput(this.formNameInput, name);
    if (await this.formDescriptionInput.isVisible()) {
      await this.fillInput(this.formDescriptionInput, description);
    }
    await this.clickElement(this.createFormButton);
    // Remove the explicit wait here, let the findEditorFrame handle the waiting
    console.log('✓ Form created, initializing frame hunter...');
  }

  async validateFormCreationElements() {
    await expect(this.formNameInput).toBeVisible();
    await expect(this.createFormButton).toBeVisible();
  }

  async dragAndDropTextBox() {
    console.log('=== Starting Text Area Drag and Drop ===');

    // 1. Get the Frame (We know this works now)
    const context = await this.findEditorFrame();

    // 2. Define Locators
    const paletteItem = context.locator('button:has([data-text="Text Area"])').first();
    const canvas = context.locator('.formcanvas-col-container, [data-role="dropzone"]').first();

    // 3. Ensure Elements are Ready
    // We skip strict visibility checks and just wait for attachment
    await paletteItem.waitFor({ state: 'attached', timeout: 10000 });
    await canvas.waitFor({ state: 'attached', timeout: 10000 });

    console.log('...Elements found, attempting Drag...');

    // 4. PERFORM DRAG USING HOVER (The Fix)
    // hover() automatically calculates the correct X/Y, even inside iframes
    await paletteItem.hover({ force: true }); 
    await this.page.mouse.down();
    
    // Wait for the "drag start" to register
    await this.page.waitForTimeout(1000); 

    // Move to canvas
    // We hover over the canvas to bring the mouse to its center
    await canvas.hover({ force: true });
    
    // Optional: Move slightly down to ensure we don't drop on the very edge
    // We can do a small relative move after hovering
    await this.page.mouse.move(0, 100); // This might fail if relative is not supported, so sticking to hover is safer.
    // actually, let's just wait a bit over the canvas
    await this.page.waitForTimeout(1000);
    
    // Release
    await this.page.mouse.up();
    console.log('✓ Dropped "Text Area" on canvas');
    
    await this.page.waitForTimeout(3000);
  }

  async dragAndDropFileUpload() {
    console.log('=== Starting Select File Drag and Drop ===');
    const context = await this.findEditorFrame(); // Reuse the finder

    const paletteItem = context.locator('button:has([data-text="Select File"])').first();
    const canvas = context.locator('.formcanvas-col-container, [data-role="dropzone"]').first();

    await paletteItem.waitFor({ state: 'visible', timeout: 10000 });
    
    const sourceBox = await paletteItem.boundingBox();
    const targetBox = await canvas.boundingBox();

    if (!sourceBox || !targetBox) throw new Error("Coordinates missing");

    await this.page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
    await this.page.mouse.down();
    await this.page.waitForTimeout(500);

    await this.page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + 200, { steps: 20 });
    await this.page.waitForTimeout(500);
    
    await this.page.mouse.up();
    console.log('✓ Dropped "Select File" on canvas');
    await this.page.waitForTimeout(2000);
  }

  async validateTextBoxOnCanvas() {
    const context = await this.findEditorFrame();
    const textArea = context.locator('.textinput-cell-input-control').first();
    await expect(textArea).toBeVisible();
    await textArea.click();
    console.log('✓ Validated Text Box');
  }

  async validateFileUploadOnCanvas() {
    const context = await this.findEditorFrame();
    const fileUpload = context.locator('.preview-fileupload').first();
    await expect(fileUpload).toBeVisible();
    await fileUpload.click();
    console.log('✓ Validated File Upload');
  }

  async enterTextInTextBox(text: string) {
    const context = await this.findEditorFrame();
    const input = context.locator('textarea.textinput-cell-input-control');
    await input.fill(text);
  }

  async uploadFile(filePath: string) {
      const context = await this.findEditorFrame();
      const browseLink = context.locator('a.preview-label__browseText');
      
      const fileChooserPromise = this.page.waitForEvent('filechooser');
      await browseLink.click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(filePath);
  }

  async saveForm() {
      await this.saveFormButton.click();
      await this.page.waitForTimeout(2000);
  }

  async validateFileUploadSuccess() {
      const context = await this.findEditorFrame();
      await expect(context.locator('.preview-fileupload').first()).toBeVisible();
  }
}