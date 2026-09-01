export interface TestUser {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  role: 'MEMBER' | 'STAFF' | 'ADMIN';
}

export const SEEDED_ADMIN: TestUser = {
  name: 'Admin User',
  email: 'admin@example.com',
  phone: '+15550000000',
  address: '100 Admin HQ',
  password: 'adminpass123',
  role: 'ADMIN'
};

export const DEFAULT_MEMBER: TestUser = {
  name: 'John Doe',
  email: 'john.member@example.com',
  phone: '+15551234567',
  address: '123 Main Street',
  password: 'password123',
  role: 'MEMBER'
};

export const DEFAULT_STAFF: TestUser = {
  name: 'Sarah Staff',
  email: 'sarah.staff@example.com',
  phone: '+15559876543',
  address: '456 Library Way',
  password: 'staffpassword123',
  role: 'STAFF'
};

export const API_BASE_URL = process.env['API_BASE_URL'] || 'http://localhost:8080/api';
export const FRONTEND_URL = process.env['FRONTEND_URL'] || 'http://localhost:4200';

export function generateRandomEmail(prefix: string = 'user'): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `${prefix}_${timestamp}_${random}@testlibrary.org`;
}

export function generateRandomAssetTag(prefix: string = 'TAG'): string {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${random}`;
}
