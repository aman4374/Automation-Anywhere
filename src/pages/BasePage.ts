// src/pages/BasePage.ts
import { Page, Locator } from "@playwright/test";

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(url: string) {
    await this.page.goto(url);
  }

  async waitForPageLoad() {
    // Option 1 (Safe): Wait for the DOM to be ready
    await this.page.waitForLoadState("domcontentloaded");

    // Option 2 (Safer): Wait for the visual "Load" event
    // await this.page.waitForLoadState("load");
  }

  async clickElement(locator: Locator) {
    await locator.waitFor({ state: "visible", timeout: 10000 });
    await locator.scrollIntoViewIfNeeded();
    await locator.click({ force: false });
    await this.page.waitForTimeout(1000); // Give time for any animations
  }

  async fillInput(locator: Locator, text: string) {
    await locator.waitFor({ state: "visible" });
    await locator.click({ force: true });
    await this.page.keyboard.press("Control+A");
    await this.page.keyboard.press("Backspace");
    await this.page.keyboard.type(text, { delay: 20 });
  }

  async isElementVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }
}
