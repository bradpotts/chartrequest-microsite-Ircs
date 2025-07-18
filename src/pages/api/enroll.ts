/**
 * Enrollment API endpoint - Step 2: Add validation and proper interfaces
 */
import type { EnrollmentFormData } from '../../scripts/form-enroll-database';

export async function POST({ request }: { request: Request }): Promise<Response> {
  try {
    console.log('=== API ENDPOINT CALLED ===');
    
    // Test form data parsing
    const formData = await request.formData();
    console.log('Form data parsed successfully');
    
    // Extract all form fields
    const fullName = formData.get("fullName")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const phone = formData.get("phone")?.toString() || "";
    const company = formData.get("company")?.toString() || "";
    const jobTitle = formData.get("jobTitle")?.toString() || "";
    const experience = formData.get("experience")?.toString() || "";
    const motivation = formData.get("motivation")?.toString() || "";
    const cfTurnstileResponse = formData.get("cf-turnstile-response")?.toString() || "";
    
    console.log('Full Name:', fullName);
    console.log('Email:', email);
    console.log('Phone:', phone);
    console.log('Company:', company);
    console.log('Job Title:', jobTitle);
    console.log('Experience:', experience);
    console.log('Motivation:', motivation);
    console.log('Turnstile Token Present:', cfTurnstileResponse ? 'Yes' : 'No');
    
    // Basic validation
    const errors: string[] = [];
    if (!fullName.trim()) errors.push('Full name is required');
    if (!email.trim()) errors.push('Email is required');
    if (!email.includes('@')) errors.push('Valid email is required');
    if (!cfTurnstileResponse) errors.push('Security verification is required');
    
    if (errors.length > 0) {
      console.log('Validation errors:', errors);
      return new Response(JSON.stringify({
        success: false,
        message: "Validation failed",
        errors: errors
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log('Validation passed');
    
    return new Response(JSON.stringify({
      success: true,
      message: "All form data extraction and validation works",
      data: { 
        fullName, 
        email, 
        phone, 
        company, 
        jobTitle, 
        experience, 
        motivation,
        hasTurnstileToken: !!cfTurnstileResponse
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('API error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: "API failed",
      error: String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
