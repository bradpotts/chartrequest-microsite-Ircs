/**
 * Enrollment form API endpoint
 */
import type { AstroAPIContext } from '../../scripts/form-common-api-handler';
import { createSuccessResponse, createErrorResponse, getClientIp } from '../../scripts/form-common-api-handler';
import { validateEnrollmentData, saveEnrollmentToDatabase } from '../../scripts/form-enroll-database';
import { validateEnrollFormTurnstile } from '../../scripts/form-enroll-turnstile';
import { submitToHubSpot } from '../../scripts/form-enroll-hubspot';

export async function POST({ request, env, clientAddress }: AstroAPIContext): Promise<Response> {
  try {
    // Extract form data
    const formData = await request.formData();
    
    // Get client IP for Turnstile verification
    const ip = getClientIp(request, clientAddress);
    
    // Extract form fields
    const enrollmentData = {
      firstName: formData.get("firstName")?.toString() || "",
      lastName: formData.get("lastName")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      phone: formData.get("phone")?.toString(),
      organization: formData.get("organization")?.toString(),
      position: formData.get("position")?.toString(),
      howHeard: formData.get("howHeard")?.toString(),
      comments: formData.get("comments")?.toString()
    };
    
    // Validate form data
    const validation = validateEnrollmentData(enrollmentData);
    if (!validation.valid) {
      return createErrorResponse(validation.message || "Invalid form data", 400);
    }
    
    // Validate Turnstile token
    const turnstileToken = formData.get("cf-turnstile-response")?.toString();
    const isTokenValid = await validateEnrollFormTurnstile(turnstileToken, ip, env);
    
    if (!isTokenValid) {
      return createErrorResponse("Security check failed. Please try again.", 400);
    }
    
    // Get page URI for HubSpot tracking
    const pageUri = request.headers.get('Referer') || 'https://informationreleasecertification.com/';
    
    // Submit to HubSpot
    const hubspotResult = await submitToHubSpot(enrollmentData, env, pageUri);
    
    if (!hubspotResult.success) {
      return createErrorResponse(hubspotResult.message, 500);
    }
    
    // Save to database
    const savedToDb = await saveEnrollmentToDatabase(enrollmentData, env);
    if (!savedToDb) {
      console.warn("Enrollment saved to HubSpot but failed to save to database");
      // Continue anyway since HubSpot submission was successful
    }
    
    // Return success
    return createSuccessResponse(
      "Thank you for enrolling in the IRCS certification program. We'll be in touch soon!"
    );
  } catch (error) {
    console.error("Enrollment form API error:", error);
    return createErrorResponse(
      "An unexpected error occurred. Please try again later.", 
      500
    );
  }
}
