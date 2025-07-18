/**
 * Contact form database operations
 */
import type { D1Database } from '@cloudflare/workers-types';
import type { Env } from './form-common-api-handler';

/**
 * Contact form data structure
 */
export interface ContactFormData {
  fullName: string;
  email: string;
  organization?: string;
  message: string;
}

/**
 * Save contact form data to D1 database
 */
export async function saveContactToDatabase(data: ContactFormData, env: Env): Promise<boolean> {
  try {
    if (!env.DB) {
      console.error("D1 database not available");
      return false;
    }

    // Insert the contact data into the D1 database
    await env.DB.prepare(`
      INSERT INTO form_contact (
        contact_full_name,
        contact_email,
        contact_organization,
        contact_message
      ) VALUES (?, ?, ?, ?)
    `).bind(
      data.fullName,
      data.email,
      data.organization || "",
      data.message
    ).run();

    console.log("Contact stored successfully in D1 database");
    return true;
  } catch (error) {
    console.error("Failed to store contact in D1:", error);
    return false;
  }
}

/**
 * Validate contact form data
 */
export function validateContactData(data: Partial<ContactFormData>): { valid: boolean; message?: string } {
  if (!data.fullName || data.fullName.trim() === '') {
    return { valid: false, message: "Full name is required" };
  }
  
  if (!data.email || data.email.trim() === '') {
    return { valid: false, message: "Email address is required" };
  }
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { valid: false, message: "Please enter a valid email address" };
  }
  
  if (!data.message || data.message.trim() === '') {
    return { valid: false, message: "Message is required" };
  }
  
  return { valid: true };
}
