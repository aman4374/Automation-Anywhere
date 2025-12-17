import { APIRequestContext, expect } from '@playwright/test';

export class APIHelper {
  private request: APIRequestContext;
  private authToken: string = '';

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async login(username: string, password: string): Promise<string> {
    // ✅ FIX: Screenshot shows 'v2/authentication', not 'v1'
    const endpoint = '/v2/authentication';
    
    console.log(`🔹 Attempting API Login to endpoint: ${endpoint}`);

    const response = await this.request.post(endpoint, {
      data: {
        username,
        password,
        loginType: 'BASIC' // Standard for this auth type
      },
    });

    if (!response.ok()) {
        console.error(`❌ API Login Failed! Status: ${response.status()}`);
        console.error(`❌ Response: ${await response.text()}`);
    }

    expect(response.ok()).toBeTruthy();
    
    const responseBody = await response.json();
    this.authToken = responseBody.token;
    
    console.log('✓ API Token received successfully');
    return this.authToken;
  }

  getAuthHeaders() {
    // ✅ FIX 3: Correct Header for Automation Anywhere
    // They use 'X-Authorization', NOT 'Authorization: Bearer'
    return {
      'X-Authorization': this.authToken,
      'Content-Type': 'application/json',
    };
  }

  async createLearningInstance(instanceData: any) {
    // ✅ FIX 4: Updated Endpoint for Learning Instances
    // Note: Learning Instances are often under the 'iqbot' namespace in v2
    const response = await this.request.post('/v2/iqbot/learning-instances', {
      headers: this.getAuthHeaders(),
      data: instanceData,
    });
    
    // Debug logging for creation failures
    if (!response.ok()) {
         console.log(`⚠️ Create Instance Failed: ${response.status()} - ${await response.text()}`);
    }

    return response;
  }

  async getLearningInstance(instanceId: string) {
    const response = await this.request.get(`/v2/iqbot/learning-instances/${instanceId}`, {
      headers: this.getAuthHeaders(),
    });

    return response;
  }

  async deleteLearningInstance(instanceId: string) {
    const response = await this.request.delete(`/v2/iqbot/learning-instances/${instanceId}`, {
      headers: this.getAuthHeaders(),
    });

    return response;
  }
}