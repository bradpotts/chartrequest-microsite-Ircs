/**
 * Enrollment form API endpoint - Simple modular approach
 */
import type { AstroAPIContext } from '../../scripts/form-common-api-handler';
import { createSuccessResponse, createErrorResponse, getClientIp } from '../../scripts/form-common-api-handler';
import { validateEnrollmentData, saveEnrollmentToDatabase } from '../../scripts/form-enroll-database';
import { validateEnrollFormTurnstile } from '../../scripts/form-enroll-turnstile';
import { submitToHubSpot } from '../../scripts/form-enroll-hubspot';

export async function POST({ request, env, clientAddress }: AstroAPIContext): Promise<Response> {
  try {
    const formData = await request.formData();
    const ip = getClientIp(request, clientAddress);
    
    console.log('=== ENROLLMENT SUBMISSION ===');
    
    // Extract enrollment data
    const enrollmentData = {
      fullName: formData.get("fullName")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      organization: formData.get("company")?.toString(),
      title: formData.get("jobTitle")?.toString(),
      phone: formData.get("phone")?.toString(),
      howHeard: formData.get("experience")?.toString() || "",
      comments: formData.get("motivation")?.toString() || ""
    };
    
    const cfTurnstileResponse = formData.get("cf-turnstile-response")?.toString() || "";
    
    // 1. Validate data
    const validationResult = validateEnrollmentData(enrollmentData);
    if (!validationResult.valid) {
      return createErrorResponse(validationResult.message || "Validation failed", 400);
    }
    
    // 2. Validate Turnstile
    const turnstileValid = await validateEnrollFormTurnstile(cfTurnstileResponse, ip, env);
    if (!turnstileValid) {
      return createErrorResponse("Security verification failed", 400);
    }
    
    // 3. Submit to HubSpot 
    try {
      const pageUri = new URL(request.url).origin;
      await submitToHubSpot(enrollmentData, env, pageUri);
    } catch (error) {
      console.error('HubSpot submission failed:', error);
    }
    
    // 4. Save to database
    const saved = await saveEnrollmentToDatabase(enrollmentData, env);
    if (!saved) {
      return createErrorResponse("Failed to save enrollment", 500);
    }
    
    return createSuccessResponse("Enrollment submitted successfully");
    
  } catch (error) {
    console.error('Enrollment error:', error);
    return createErrorResponse("Enrollment failed", 500);
  }
}
