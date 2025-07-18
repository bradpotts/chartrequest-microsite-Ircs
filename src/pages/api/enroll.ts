/**
 * Enrollment API endpoint - Step 1: Add form data parsing
 */

export async function POST({ request }: { request: Request }): Promise<Response> {
  try {
    console.log('=== API ENDPOINT CALLED ===');
    
    // Test form data parsing
    const formData = await request.formData();
    console.log('Form data parsed successfully');
    
    // Extract basic fields
    const fullName = formData.get("fullName")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    
    console.log('Full Name:', fullName);
    console.log('Email:', email);
    
    return new Response(JSON.stringify({
      success: true,
      message: "Form data parsing works",
      data: { fullName, email }
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
