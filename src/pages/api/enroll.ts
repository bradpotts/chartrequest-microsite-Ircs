/**
 * Enrollment API endpoint - Step 1: Add form data parsing
 */

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
    
    return new Response(JSON.stringify({
      success: true,
      message: "All form data extraction works",
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
