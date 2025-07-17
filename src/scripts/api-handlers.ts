// API Handler functions for contact form
import type { D1Database } from '@cloudflare/workers-types';
import { submitContactForm } from './contact-form';

// Define proper types for Cloudflare environment
export interface Env {
  DB: D1Database;
  TURNSTILE_SECRET_KEY: string;
  [key: string]: any;
}

export interface AstroAPIContext {
  request: Request;
  env: Env;
  clientAddress: string;
}

/**
 * Handle contact form submissions
 */
export async function handleContactSubmission({ request, env, clientAddress }: AstroAPIContext): Promise<Response> {
  try {
    const formData = await request.formData();
    
    // Add client IP to form data for Turnstile verification
    formData.append('cf-connecting-ip', clientAddress);
    
    return submitContactForm(formData, env);
  } catch (error) {
    console.error('Error in contact API handler:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'An unexpected error occurred processing your request.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
