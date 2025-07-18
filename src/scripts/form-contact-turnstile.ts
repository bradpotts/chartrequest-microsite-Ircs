/**
 * Contact form Turnstile integration
 */
import { verifyTurnstileToken } from './form-common-turnstile';
import type { Env } from './form-common-api-handler';

/**
 * Initialize Turnstile on the contact form
 */
export function initContactFormTurnstile(): void {
  if (typeof document === 'undefined') return;
  
  // Add the Turnstile widget to the form
  document.addEventListener('DOMContentLoaded', () => {
    const turnstileContainer = document.getElementById('contact-turnstile') as HTMLElement;
    if (turnstileContainer && window.turnstile) {
      // Site key from environment or use the correct site key
      const siteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAABlkmjZZRT8r9BHM';
      
      try {
        const widgetId = window.turnstile.render(turnstileContainer, {
          sitekey: siteKey,
          theme: 'light',
          size: 'normal',
          action: 'microsite-ircs-form-contact',
          callback: (token: string) => {
            // Store token in hidden field
            let tokenField = document.getElementById('cf-turnstile-response-contact') as HTMLInputElement;
            
            if (!tokenField) {
              // Create hidden field if it doesn't exist
              tokenField = document.createElement('input');
              tokenField.type = 'hidden';
              tokenField.id = 'cf-turnstile-response-contact';
              tokenField.name = 'cf-turnstile-response';
              document.getElementById('contact-form')?.appendChild(tokenField);
            }
            
            tokenField.value = token;
          }
        });
      } catch (error) {
        console.error('Error initializing Turnstile for contact form:', error);
      }
    }
  });
}

/**
 * Reset the Turnstile widget on the contact form
 */
export function resetContactFormTurnstile(): void {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  
  const turnstileContainer = document.querySelector('.cf-turnstile') as HTMLElement;
  if (!turnstileContainer) return;
  
  // Get widget ID if available
  const widgetId = turnstileContainer.getAttribute('data-widget-id');
  
  // Reset existing widget if possible
  if (widgetId && window.turnstile) {
    try {
      window.turnstile.reset(widgetId);
    } catch (error) {
      console.error('Error resetting Turnstile widget:', error);
      
      // If reset fails, try to recreate the widget
      try {
        // Clear the container
        turnstileContainer.innerHTML = '';
        
        // Re-render the widget
        const siteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAABldTXFZ4U3vfXPt';
        window.turnstile.render(turnstileContainer, {
          sitekey: siteKey,
          theme: 'light',
          size: 'normal'
        });
      } catch (recreateError) {
        console.error('Error recreating Turnstile widget:', recreateError);
      }
    }
  }
}

/**
 * Validate Turnstile token from contact form
 */
export async function validateContactFormTurnstile(
  token: string | null | undefined,
  ip: string,
  env: Env
): Promise<boolean> {
  if (!token) {
    console.error('No Turnstile token provided');
    return false;
  }
  
  const secretKey = env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    console.error('No Turnstile secret key configured');
    return false;
  }
  
  return verifyTurnstileToken(token, ip, secretKey);
}
