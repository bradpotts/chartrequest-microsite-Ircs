// Contact form submission handler that uses D1 database
import type { D1Database } from '@cloudflare/workers-types';

// Interface for Turnstile verification response
interface TurnstileVerifyResponse {
  success: boolean;
  error?: string[];
  challenge_ts?: string;
  hostname?: string;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  organization?: string;
  message: string;
}

// Function to save contact form data to D1 database
export async function saveContactToD1(data: ContactFormData, env: any): Promise<boolean> {
  try {
    if (!env.DB) {
      console.error("D1 database not available");
      return false;
    }

    // Insert the contact data into the D1 database
    await env.DB.prepare(`
      INSERT INTO form_contact (
        contact_full_name,
        contact_email,
        contact_organization,
        contact_message
      ) VALUES (?, ?, ?, ?)
    `).bind(
      data.fullName,
      data.email,
      data.organization || "",
      data.message
    ).run();

    console.log("Contact stored successfully in D1 database");
    return true;
  } catch (error) {
    console.error("Failed to store contact in D1:", error);
    return false;
  }
}

// Function to verify Turnstile token
async function verifyTurnstileToken(token: string, ip: string, secret: string): Promise<boolean> {
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret,
        response: token,
        remoteip: ip
      }),
    });

    const data = await response.json() as TurnstileVerifyResponse;
    
    if (!data.success) {
      console.error('Turnstile verification failed:', data.error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error verifying Turnstile token:', error);
    return false;
  }
}

// Function to submit contact form
export async function submitContactForm(formData: FormData, env: any): Promise<Response> {
  try {
    const fullName = formData.get("contactName")?.toString() || "";
    const email = formData.get("contactEmail")?.toString() || "";
    const organization = formData.get("contactOrg")?.toString() || "";
    const message = formData.get("contactMsg")?.toString() || "";
    const token = formData.get("cf-turnstile-response")?.toString();
    const ip = formData.get("cf-connecting-ip")?.toString() || "";
    
    // Validate form data
    if (!fullName || !email || !message) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: "Please fill out all required fields" 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Validate Turnstile token
    if (!token) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: "Please complete the security check" 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Verify the Turnstile token
    const turnstileSecret = env.TURNSTILE_SECRET_KEY;
    if (!turnstileSecret) {
      console.error("Turnstile secret key not configured");
      return new Response(JSON.stringify({ 
        success: false, 
        message: "Security configuration error. Please contact support." 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const isTokenValid = await verifyTurnstileToken(token, ip, turnstileSecret);
    if (!isTokenValid) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: "Security check failed. Please try again." 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const contactData: ContactFormData = {
      fullName,
      email,
      organization,
      message
    };
    
    // Save to D1 database
    const savedToD1 = await saveContactToD1(contactData, env);
    
    if (savedToD1) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Thank you for your message. We'll get back to you soon!"
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      throw new Error("Failed to save contact");
    }
  } catch (error) {
    console.error("Contact form submission error:", error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: "An error occurred while submitting your message. Please try again."
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
