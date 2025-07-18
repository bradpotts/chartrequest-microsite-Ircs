/**
 * Enrollment form database operations
 */
import type { D1Database } from '@cloudflare/workers-types';
import type { Env } from './form-common-api-handler';

/**
 * Enrollment form data structure
 */
export interface EnrollmentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  organization?: string;
  position?: string;
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
        enrollment_first_name,
        enrollment_last_name,
        enrollment_email,
        enrollment_phone,
        enrollment_organization,
        enrollment_position,
        enrollment_how_heard,
        enrollment_comments
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.firstName,
      data.lastName,
      data.email,
      data.phone || "",
      data.organization || "",
      data.position || "",
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
  if (!data.firstName || data.firstName.trim() === '') {
    return { valid: false, message: "First name is required" };
  }
  
  if (!data.lastName || data.lastName.trim() === '') {
    return { valid: false, message: "Last name is required" };
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
