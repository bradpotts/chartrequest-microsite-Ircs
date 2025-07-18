export async function POST({ request }: { request: Request }): Promise<Response> {
  try {
    console.log('=== MINIMAL API ENDPOINT CALLED ===');
    
    return new Response(JSON.stringify({
      success: true,
      message: "Minimal endpoint working"
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Minimal API error:', error);
    
    return new Response(JSON.stringify({
      success: false,
      message: "Minimal endpoint failed",
      error: String(error)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
