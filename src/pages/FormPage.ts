// // src/pages/FormPage.ts
import { Page, Locator, Frame, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class FormPage extends BasePage {
  readonly formNameInput: Locator;
  readonly formDescriptionInput: Locator;
  readonly createFormButton: Locator;
  readonly saveFormButton: Locator;

  private editorFrame?: Frame;

  constructor(page: Page) {
    super(page);
    this.formNameInput = page.locator('input[name="name"]');
    this.formDescriptionInput = page.locator('textarea[name="description"]');
    this.createFormButton = page.locator('button[name="submit"]');
    this.saveFormButton = page.locator('button[name="save"]');
  }

  /**
   * 🔍 Robust iframe finder (cached)
   */
  async getEditorFrame(): Promise<Frame> {
    if (this.editorFrame) return this.editorFrame;

    console.log('🔍 Hunting for Form Editor Frame...');

    for (let attempt = 1; attempt <= 10; attempt++) {
      const frames = this.page.frames();

      for (const frame of frames) {
        try {
          const count = await frame
            .locator('button:has([data-text="Text Area"])')
            .count();

          if (count > 0) {
            console.log(`✅ MATCH! Found Form Builder iframe`);
            this.editorFrame = frame;
            return frame;
          }
        } catch {
          // ignore cross-origin frames
        }
      }

      console.log(`...Frame not ready yet (${attempt}/10)`);
      await this.page.waitForTimeout(2000);
    }

    throw new Error(
      '❌ Could not locate Form Builder iframe. UI may have changed.'
    );
  }

  async createForm(name: string, description: string) {
    await this.formNameInput.fill(name);

    if (await this.formDescriptionInput.isVisible()) {
      await this.formDescriptionInput.fill(description);
    }

    await this.createFormButton.click();
    console.log('✓ Form created, waiting for editor...');
  }

  async validateFormCreationElements() {
    await expect(this.formNameInput).toBeVisible();
    await expect(this.createFormButton).toBeVisible();
  }

  async dragAndDropTextBox() {
  console.log('=== Drag & Drop: Text Area ===');

  const frame = await this.getEditorFrame();

  const paletteItem = frame.locator(
    'button:has([data-text="Text Area"])'
  ).first();

  const canvas = frame.locator('[data-role="dropzone"]').first();

  // ✅ Wait for toolbox
  await paletteItem.waitFor({ state: 'visible', timeout: 20000 });

  // ✅ CRITICAL: wait until canvas is truly ready
  await frame.waitForSelector(
    '[data-role="dropzone"] >> div',
    { timeout: 20000 }
  );

  console.log('...Canvas ready, performing drag');

  // ✅ Use bounding box based drag (more reliable here)
  const sourceBox = await paletteItem.boundingBox();
  const targetBox = await canvas.boundingBox();

  if (!sourceBox || !targetBox) {
    throw new Error('❌ Drag coordinates not available');
  }

  await this.page.mouse.move(
    sourceBox.x + sourceBox.width / 2,
    sourceBox.y + sourceBox.height / 2
  );
  await this.page.mouse.down();

  await this.page.mouse.move(
    targetBox.x + targetBox.width / 2,
    targetBox.y + targetBox.height / 2 + 50,
    { steps: 15 }
  );

  await this.page.mouse.up();

  console.log('✓ Text Area dropped on canvas');
}

 async dragAndDropFileUpload() {
  console.log('=== Drag & Drop: Select File ===');

  const frame = await this.getEditorFrame();

  const paletteItem = frame.locator(
    'button:has([data-text="Select File"])'
  ).first();

  const canvas = frame.locator('[data-role="dropzone"]').first();

  await paletteItem.waitFor({ state: 'visible', timeout: 20000 });
  await frame.waitForSelector('[data-role="dropzone"] >> div', {
    timeout: 20000
  });

  const sourceBox = await paletteItem.boundingBox();
  const targetBox = await canvas.boundingBox();

  if (!sourceBox || !targetBox) {
    throw new Error('❌ Drag coordinates not available');
  }

  await this.page.mouse.move(
    sourceBox.x + sourceBox.width / 2,
    sourceBox.y + sourceBox.height / 2
  );
  await this.page.mouse.down();

  await this.page.mouse.move(
    targetBox.x + targetBox.width / 2,
    targetBox.y + targetBox.height / 2 + 80,
    { steps: 15 }
  );

  await this.page.mouse.up();

  console.log('✓ Select File dropped on canvas');
}


  async validateTextBoxOnCanvas() {
    const frame = await this.getEditorFrame();
    const textArea = frame
      .locator('.textinput-cell-input-control')
      .first();

    await expect(textArea).toBeVisible();
    await textArea.click();
    console.log('✓ Text Area validated');
  }

  async validateFileUploadOnCanvas() {
    const frame = await this.getEditorFrame();
    const fileUpload = frame
      .locator('.preview-fileupload')
      .first();

    await expect(fileUpload).toBeVisible();
    await fileUpload.click();
    console.log('✓ File Upload validated');
  }

  async enterTextInTextBox(text: string) {
    const frame = await this.getEditorFrame();
    const input = frame.locator(
      'textarea.textinput-cell-input-control'
    );
    await input.fill(text);
  }

  async uploadFile(filePath: string) {
    const frame = await this.getEditorFrame();
    const browse = frame.locator('a.preview-label__browseText');

    const chooserPromise = this.page.waitForEvent('filechooser');
    await browse.click();
    const chooser = await chooserPromise;
    await chooser.setFiles(filePath);
  }

  async saveForm() {
    await this.saveFormButton.click();
    console.log('✓ Form saved');
  }

  async validateFileUploadSuccess() {
    const frame = await this.getEditorFrame();
    await expect(
      frame.locator('.preview-fileupload').first()
    ).toBeVisible();
  }
}
