/**
 * Enrollment form Turnstile integration
 */
import { verifyTurnstileToken } from './form-common-turnstile';
import type { Env } from './form-common-api-handler';

/**
 * Initialize Turnstile on the enrollment form
 */
export function initEnrollFormTurnstile(): void {
  if (typeof document === 'undefined') return;
  
  // Function to initialize the widget
  const initWidget = () => {
    const turnstileContainer = document.querySelector('#enroll-turnstile') as HTMLElement;
    if (turnstileContainer && window.turnstile) {
      // Site key from environment or fallback - using the correct site key
      const siteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAABldTXFZ4U3vfXPt';
      
      console.log('Initializing Turnstile for enrollment form with site key:', siteKey);
      
      try {
        const widgetId = window.turnstile.render(turnstileContainer, {
          sitekey: siteKey,
          theme: 'light',
          size: 'normal',
          action: 'microsite-ircs-form-enrollment',
          callback: (token: string) => {
            console.log('Turnstile token received:', token.substring(0, 20) + '...');
            
            // Store token in hidden field
            let tokenField = document.getElementById('cf-turnstile-response-enroll') as HTMLInputElement;
            
            if (!tokenField) {
              // Create hidden field if it doesn't exist
              tokenField = document.createElement('input');
              tokenField.type = 'hidden';
              tokenField.id = 'cf-turnstile-response-enroll';
              tokenField.name = 'cf-turnstile-response';
              document.getElementById('hubspot-direct-form')?.appendChild(tokenField);
              console.log('Created hidden Turnstile token field');
            }
            
            tokenField.value = token;
            console.log('Set Turnstile token in hidden field');
          },
          'error-callback': (error: any) => {
            console.error('Turnstile error:', error);
          }
        });
        
        console.log('Turnstile widget initialized with ID:', widgetId);
        turnstileContainer.setAttribute('data-widget-id', widgetId);
      } catch (error) {
        console.error('Error initializing Turnstile for enrollment form:', error);
      }
    } else {
      console.log('Turnstile container or script not ready, retrying...');
      // Retry after a short delay
      setTimeout(initWidget, 100);
    }
  };
  
  // Start initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
}

/**
 * Reset the Turnstile widget on the enrollment form
 */
export function resetEnrollFormTurnstile(): void {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  
  const turnstileContainer = document.querySelector('#enroll-turnstile') as HTMLElement;
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
 * Validate Turnstile token from enrollment form
 */
export async function validateEnrollFormTurnstile(
  token: string | null | undefined,
  ip: string,
  env: Env
): Promise<boolean> {
  console.log('Validating Turnstile token for enrollment form...');
  console.log('Token present:', !!token);
  console.log('Token length:', token?.length || 0);
  console.log('IP:', ip);
  
  if (!token) {
    console.error('No Turnstile token provided');
    return false;
  }
  
  const secretKey = env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    console.error('No Turnstile secret key configured');
    return false;
  }
  
  console.log('Using secret key:', secretKey.substring(0, 10) + '...');
  
  const result = await verifyTurnstileToken(token, ip, secretKey);
  console.log('Turnstile validation result:', result);
  
  return result;
}
