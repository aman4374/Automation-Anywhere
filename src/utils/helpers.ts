// src/utils/helpers.ts
import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  username: process.env.AA_USERNAME || '',
  password: process.env.AA_PASSWORD || '',
  baseUrl: process.env.BASE_URL || 'https://community.cloud.automationanywhere.digital',
};

export function generateTestId(): string {
  return `test_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

export function getTestFilePath(): string {
  return './src/test-data/sample-upload.txt';
}