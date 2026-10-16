import { MpesaTransaction, MpesaStkPushStatus } from '../types';

export interface DarajaConfig {
  shortcode: string; // Till Number e.g. 882910 or Paybill 400200
  passkey: string;
  consumerKey: string;
  consumerSecret: string;
  callbackUrl: string;
}

export const DEFAULT_DARAJA_CONFIG: DarajaConfig = {
  shortcode: '882910',
  passkey: 'bfb279f6929e77b420235b02130e527d92376916c02621711202a0a2f5802283',
  consumerKey: 'vO84XjK9x3A2mR5z7Y1qW0eE',
  consumerSecret: 'pL91mN2bV5cX8z1aQ3wE7rT4',
  callbackUrl: 'https://decent.co.ke/api/mpesa/callback'
};

/**
 * Validates and formats Kenyan Phone Numbers.
 * Supports formats: 0712345678, 0112345678, 254712345678, +254712345678
 */
export function validateKenyanPhone(phone: string): { valid: boolean; formatted: string; rawDisplay: string; error?: string } {
  const cleaned = phone.replace(/[^0-9]/g, '');

  let formatted254 = cleaned;

  if (cleaned.startsWith('0') && cleaned.length === 10) {
    formatted254 = '254' + cleaned.substring(1);
  } else if (cleaned.startsWith('254') && cleaned.length === 12) {
    formatted254 = cleaned;
  } else if (cleaned.length === 9 && (cleaned.startsWith('7') || cleaned.startsWith('1'))) {
    formatted254 = '254' + cleaned;
  }

  // Check valid Kenyan mobile prefixes: 2547... or 2541...
  if (/^254(7|1)\d{8}$/.test(formatted254)) {
    const rawDisplay = `0${formatted254.substring(3, 6)} ${formatted254.substring(6, 9)} ${formatted254.substring(9)}`;
    return {
      valid: true,
      formatted: formatted254,
      rawDisplay
    };
  }

  return {
    valid: false,
    formatted: phone,
    rawDisplay: phone,
    error: 'Please enter a valid Safaricom/Kenyan phone number (e.g., 0712345678 or 254712345678).'
  };
}

/**
 * Generates an authentic-looking Safaricom M-Pesa Receipt Code (e.g. QFH8921J1X)
 */
export function generateMpesaReceiptCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const nums = '0123456789';
  
  const prefix = 'Q';
  const char1 = chars.charAt(Math.floor(Math.random() * chars.length));
  const char2 = chars.charAt(Math.floor(Math.random() * chars.length));
  const digits = Math.floor(1000 + Math.random() * 9000);
  const char3 = chars.charAt(Math.floor(Math.random() * chars.length));
  const digit2 = nums.charAt(Math.floor(Math.random() * nums.length));
  const char4 = chars.charAt(Math.floor(Math.random() * chars.length));

  return `${prefix}${char1}${char2}${digits}${char3}${digit2}${char4}`;
}

/**
 * Generates unique Daraja CheckoutRequestID
 */
export function generateCheckoutRequestId(): string {
  return `ws_CO_${Date.now()}_${Math.floor(100000 + Math.random() * 900000)}`;
}

/**
 * Formats date for Daraja Timestamp format (YYYYMMDDHHmmss)
 */
export function getDarajaTimestamp(): string {
  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}
