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
    
    console.log('=== ENROLLMENT FORM SUBMISSION DEBUG ===');
    console.log('Request URL:', request.url);
    console.log('Client IP:', ip);
    console.log('Form data keys:', Array.from(formData.keys()));
    
    // Extract form fields
    const enrollmentData = {
      fullName: formData.get("fullName")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      organization: formData.get("company")?.toString(), // Form uses 'company' instead of 'organization'
      title: formData.get("jobTitle")?.toString(), // Form uses 'jobTitle' instead of 'title'
      phone: formData.get("phone")?.toString(),
      howHeard: formData.get("howHeard")?.toString() || "",
      comments: formData.get("comments")?.toString() || ""
    };
    
    console.log('Enrollment data:', enrollmentData);
    
    // Validate form data
    const validation = validateEnrollmentData(enrollmentData);
    if (!validation.valid) {
      console.log('Form validation failed:', validation.message);
      return createErrorResponse(validation.message || "Invalid form data", 400);
    }
    
    console.log('Form validation passed');
    
    // Validate Turnstile token
    const turnstileToken = formData.get("cf-turnstile-response")?.toString();
    console.log('Turnstile token received:', turnstileToken ? 'YES' : 'NO');
    console.log('Turnstile token length:', turnstileToken?.length || 0);
    
    const isTokenValid = await validateEnrollFormTurnstile(turnstileToken, ip, env);
    
    if (!isTokenValid) {
      console.log('Turnstile validation failed');
      return createErrorResponse("Security check failed. Please try again.", 400);
    }
    
    console.log('Turnstile validation passed');
    
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
