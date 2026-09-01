import { APIRequestContext } from '@playwright/test';
import { API_BASE_URL, SEEDED_ADMIN } from './test-data.js';

export interface LoginResponse {
  token: string;
  role: string;
  userId: string;
  name: string;
}

export class ApiSeeder {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.request.post(`${API_BASE_URL}/auth/login`, {
      data: { email, password }
    });
    if (!response.ok()) {
      throw new Error(`Login failed for ${email}: ${response.status()} ${await response.text()}`);
    }
    return response.json();
  }

  async loginAsAdmin(): Promise<LoginResponse> {
    return this.login(SEEDED_ADMIN.email, SEEDED_ADMIN.password);
  }

  async registerMember(memberData: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
    password: string;
  }) {
    const response = await this.request.post(`${API_BASE_URL}/members`, {
      data: {
        name: memberData.name,
        email: memberData.email,
        phone: memberData.phone || '+15550001111',
        address: memberData.address || 'Default Address',
        password: memberData.password
      }
    });
    return { status: response.status(), body: await response.json().catch(() => null) };
  }

  async createStaff(adminToken: string, staffData: {
    name: string;
    email: string;
    role: 'STAFF' | 'ADMIN';
    password: string;
  }) {
    const response = await this.request.post(`${API_BASE_URL}/staff`, {
      headers: { Authorization: `Bearer ${adminToken}` },
      data: staffData
    });
    return { status: response.status(), body: await response.json().catch(() => null) };
  }

  async createCategory(adminToken: string, category: {
    name: string;
    maxLoanDurationDays: number;
    depositRequired: boolean;
  }) {
    const response = await this.request.post(`${API_BASE_URL}/categories`, {
      headers: { Authorization: `Bearer ${adminToken}` },
      data: category
    });
    return response.json();
  }

  async createItem(adminToken: string, item: {
    name: string;
    description: string;
    categoryId: string;
    assetTag: string;
  }) {
    const response = await this.request.post(`${API_BASE_URL}/items`, {
      headers: { Authorization: `Bearer ${adminToken}` },
      data: item
    });
    return response.json();
  }
}
