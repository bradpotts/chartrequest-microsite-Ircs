/**
 * Common Turnstile functionality shared between forms
 */

// Define Turnstile types
export interface TurnstileOptions {
  sitekey: string;
  callback?: (token: string) => void;
  'expired-callback'?: () => void;
  'error-callback'?: (error: any) => void;
  theme?: 'light' | 'dark' | 'auto';
  tabindex?: number;
  'response-field'?: boolean;
  'response-field-name'?: string;
  size?: 'normal' | 'compact';
  appearance?: 'always' | 'interaction-only' | 'execute';
  action?: string; // Action name for analytics
}

export interface TurnstileVerifyResponse {
  success: boolean;
  error?: string[];
  challenge_ts?: string;
  hostname?: string;
}

// Add Turnstile to global Window interface
declare global {
  interface Window {
    turnstile: {
      render: (container: string | HTMLElement, options: TurnstileOptions) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

// Constants
const TURNSTILE_SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js";
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Load the Turnstile script if not already loaded
 */
export function loadTurnstileScript(): void {
  if (typeof document === 'undefined') return;
  
  // If script already exists, don't add it again
  if (document.querySelector(`script[src="${TURNSTILE_SCRIPT_URL}"]`)) {
    return;
  }
  
  // Create and append script
  const turnstileScript = document.createElement('script');
  turnstileScript.src = TURNSTILE_SCRIPT_URL;
  turnstileScript.async = true;
  turnstileScript.defer = true;
  document.head.appendChild(turnstileScript);
}

/**
 * Server-side verification of Turnstile token
 */
export async function verifyTurnstileToken(
  token: string, 
  ip: string, 
  secret: string
): Promise<boolean> {
  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
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
