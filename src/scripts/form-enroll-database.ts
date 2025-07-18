/**
 * Enrollment form database operations
 */
import type { D1Database } from '@cloudflare/workers-types';
import type { Env } from './form-common-api-handler';

/**
 * Enrollment form data structure
 */
export interface EnrollmentFormData {
  fullName: string;
  email: string;
  organization?: string;
  title?: string;
  phone?: string;
  howHeard?: string;
  comments?: string;
}

/**
 * Save enrollment data to D1 database
 */
export async function saveEnrollmentToDatabase(data: EnrollmentFormData, env: Env): Promise<boolean> {
  try {
    if (!env.DB) {
      console.error("D1 database not available");
      return false;
    }

    // Insert the enrollment data into the D1 database
    await env.DB.prepare(`
      INSERT INTO form_enrollment (
        enrollment_full_name,
        enrollment_email,
        enrollment_organization,
        enrollment_title,
        enrollment_phone,
        enrollment_how_heard,
        enrollment_comments
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.fullName,
      data.email,
      data.organization || "",
      data.title || "",
      data.phone || "",
      data.howHeard || "",
      data.comments || ""
    ).run();

    console.log("Enrollment stored successfully in D1 database");
    return true;
  } catch (error) {
    console.error("Failed to store enrollment in D1:", error);
    return false;
  }
}

/**
 * Validate enrollment form data
 */
export function validateEnrollmentData(
  data: Partial<EnrollmentFormData>
): { valid: boolean; message?: string } {
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
  
  return { valid: true };
}
