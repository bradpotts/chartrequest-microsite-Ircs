/**
 * Contact form API endpoint
 */
import type { AstroAPIContext } from '../../scripts/form-common-api-handler';
import { createSuccessResponse, createErrorResponse, getClientIp } from '../../scripts/form-common-api-handler';
import { validateContactData, saveContactToDatabase } from '../../scripts/form-contact-database';
import { validateContactFormTurnstile } from '../../scripts/form-contact-turnstile';

export async function POST({ request, env, clientAddress }: AstroAPIContext): Promise<Response> {
  try {
    // Extract form data
    const formData = await request.formData();
    
    // Get client IP for Turnstile verification
    const ip = getClientIp(request, clientAddress);
    
    // Extract form fields
    const contactData = {
      fullName: formData.get("contactName")?.toString() || "",
      email: formData.get("contactEmail")?.toString() || "",
      organization: formData.get("contactOrg")?.toString(),
      message: formData.get("contactMsg")?.toString() || ""
    };
    
    // Validate form data
    const validation = validateContactData(contactData);
    if (!validation.valid) {
      return createErrorResponse(validation.message || "Invalid form data", 400);
    }
    
    // Validate Turnstile token
    const turnstileToken = formData.get("cf-turnstile-response")?.toString();
    const isTokenValid = await validateContactFormTurnstile(turnstileToken, ip, env);
    
    if (!isTokenValid) {
      return createErrorResponse("Security check failed. Please try again.", 400);
    }
    
    // Save to database
    const savedToDb = await saveContactToDatabase(contactData, env);
    if (!savedToDb) {
      return createErrorResponse("Failed to save your message. Please try again later.", 500);
    }
    
    // Return success
    return createSuccessResponse("Thank you for your message. We'll get back to you soon!");
  } catch (error) {
    console.error("Contact form API error:", error);
    return createErrorResponse(
      "An unexpected error occurred. Please try again later.", 
      500
    );
  }
}
