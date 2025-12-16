// src/utils/api-helper.ts
import { APIRequestContext, expect } from '@playwright/test';

export class APIHelper {
  private request: APIRequestContext;
  private authToken: string = '';

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async login(username: string, password: string): Promise<string> {
    const response = await this.request.post('/api/v1/authentication', {
      data: {
        username,
        password,
      },
    });

    expect(response.ok()).toBeTruthy();
    const responseBody = await response.json();
    this.authToken = responseBody.token;
    return this.authToken;
  }

  getAuthHeaders() {
    return {
      'Authorization': `Bearer ${this.authToken}`,
      'Content-Type': 'application/json',
    };
  }

  async createLearningInstance(instanceData: any) {
    const response = await this.request.post('/api/v1/learning-instances', {
      headers: this.getAuthHeaders(),
      data: instanceData,
    });

    return response;
  }

  async getLearningInstance(instanceId: string) {
    const response = await this.request.get(`/api/v1/learning-instances/${instanceId}`, {
      headers: this.getAuthHeaders(),
    });

    return response;
  }

  async deleteLearningInstance(instanceId: string) {
    const response = await this.request.delete(`/api/v1/learning-instances/${instanceId}`, {
      headers: this.getAuthHeaders(),
    });

    return response;
  }
}