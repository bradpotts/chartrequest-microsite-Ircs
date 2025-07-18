/**
 * Common API handler functionality for form processing
 */

// Local D1Database interface (simplified)
interface D1Database {
  prepare(sql: string): any;
  exec(sql: string): any;
  batch(statements: any[]): any;
}

/**
 * Environment interface for Cloudflare Workers
 */
export interface Env {
  // D1 database binding
  // DB name: microsite-ircs
  // DB ID: af58f146-ee84-4c00-8fa5-ddf7f8d88ec0
  DB: D1Database;
  
  // API keys and secrets
  // Contact Form: turnstile_name: microsite-ircs-form-contact, turnstile_id: 0x4AAAAAABlkmjZZRT8r9BHM
  // Enrollment Form: turnstile_name: microsite-ircs-form-enrollment, turnstile_id: 0x4AAAAAABldTXFZ4U3vfXPt
  ENROLLMENT_TURNSTILE_SITE_KEY: string;
  ENROLLMENT_TURNSTILE_SECRET_KEY: string;
  ENROLLMENT_HUBSPOT_PORTAL_ID: string;
  ENROLLMENT_HUBSPOT_FORM_ID: string;
  
  // Allow for additional environment variables
  [key: string]: any;
}

/**
 * Context object provided by Astro API routes
 */
export interface AstroAPIContext {
  request: Request;
  env: Env;
  clientAddress: string;
}

/**
 * Standard API response format
 */
export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * Create a success response
 */
export function createSuccessResponse(message: string, data?: any): Response {
  return new Response(
    JSON.stringify({
      success: true,
      message,
      ...(data ? { data } : {})
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

/**
 * Create an error response
 */
export function createErrorResponse(
  message: string, 
  status: number = 400, 
  data?: any
): Response {
  return new Response(
    JSON.stringify({
      success: false,
      message,
      ...(data ? { data } : {})
    }),
    {
      status,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

/**
 * Extract client IP address from headers or context
 */
export function getClientIp(request: Request, clientAddress?: string): string {
  return (
    request.headers.get('cf-connecting-ip') || 
    request.headers.get('x-forwarded-for') || 
    clientAddress || 
    '127.0.0.1'
  );
}
