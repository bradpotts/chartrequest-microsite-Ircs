declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

export interface HubSpotField {
  name: string;
  value: string | null | undefined;
}

export interface HubSpotPayload {
  submittedAt: number;
  fields: HubSpotField[];
  context: {
    pageUri: string;
    pageName: string;
    hutk?: string;
  };
  skipValidation?: boolean;
  legalConsentOptions?: {
    consent: {
      consentToProcess: boolean;
      text: string;
      communications: {
        value: boolean;
        subscriptionTypeId: number;
        text: string;
      }[];
    };
  };
  recaptchaToken?: string;
}

export interface HubSpotErrorResponse {
  status: string;
  message: string;
  correlationId: string;
  errors: Array<{message: string}>;
}

const HUBSPOT_PORTAL_ID = import.meta.env.HOTSPOT_PORTAL_ID;
const HUBSPOT_FORM_ID = import.meta.env.HOTSPOT_FORM_ID;
const HUBSPOT_API_URL = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_ID}`;
const RECAPTCHA_SITE_KEY = import.meta.env.GOOGLE_RECAPTCHA_SITE_KEY;

async function getRecaptchaToken(): Promise<string> {
  if (!window.grecaptcha || !window.grecaptcha.execute) {
    throw new Error("reCAPTCHA not loaded");
  }
  
  try {
    return await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'submit_form' });
  } catch (error) {
    console.error("reCAPTCHA error:", error);
    throw new Error("Failed to verify reCAPTCHA");
  }
}

function getHubSpotCookie(): string | undefined {
  const cookies = document.cookie.split('; ');
  const hubspotCookie = cookies.find(cookie => cookie.startsWith('hubspotutk='));
  return hubspotCookie ? hubspotCookie.split('=')[1] : undefined;
}

export async function submitToHubSpot(formData: FormData): Promise<Response> {
  const fullName = formData.get("fullName")?.toString() || "";
  const email = formData.get("email")?.toString() || "";
  const phone = formData.get("phone")?.toString() || "";
  const company = formData.get("company")?.toString() || "";
  const jobTitle = formData.get("jobTitle")?.toString() || "";
  
  const recaptchaToken = await getRecaptchaToken();
  
  const nameParts = fullName.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
  
  const fields: HubSpotField[] = [
    { name: "firstname", value: firstName },
    { name: "lastname", value: lastName },
    { name: "email", value: email },
    { name: "phone", value: phone },
    { name: "company", value: company },
    { name: "jobtitle", value: jobTitle }
  ].filter(field => !!field.value);
  
  const hutk = getHubSpotCookie();
  
  const payload: HubSpotPayload = {
    submittedAt: Date.now(),
    fields: fields,
    context: {
      pageUri: window.location.href,
      pageName: document.title,
      hutk: hutk
    },
    recaptchaToken: recaptchaToken,
    legalConsentOptions: {
      consent: {
        consentToProcess: true,
        text: "I agree to allow [company name] to store and process my personal data.",
        communications: [
          {
            value: true,
            subscriptionTypeId: 999,
            text: "I agree to receive marketing communications from [company name]."
          }
        ]
      }
    }
  };
  
  return fetch(HUBSPOT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
}

function loadRecaptcha(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.grecaptcha) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      window.grecaptcha.ready(() => {
        resolve();
      });
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load reCAPTCHA'));
    };
    
    document.head.appendChild(script);
  });
}

export function initializeHubSpotForm(): void {
  document.addEventListener('DOMContentLoaded', async () => {
    try {
      await loadRecaptcha();
    } catch (error) {
      console.error('Failed to load reCAPTCHA:', error);
    }
    
    const form = document.getElementById("hubspot-direct-form") as HTMLFormElement;
    const successMessage = document.getElementById("enrollment-success") as HTMLDivElement;
    const errorContainer = document.getElementById("form-error") as HTMLDivElement;
    const errorMessage = document.getElementById("error-message") as HTMLParagraphElement;
    const submitButton = document.getElementById("submit-button") as HTMLButtonElement;
    const buttonText = document.getElementById("button-text") as HTMLSpanElement;
    const buttonLoading = document.getElementById("button-loading") as HTMLSpanElement;

    if (form && successMessage && errorContainer && errorMessage && submitButton && buttonText && buttonLoading) {
      form.addEventListener("submit", async (event: Event) => {
        event.preventDefault();
        
        submitButton.disabled = true;
        buttonText.classList.add("hidden");
        buttonLoading.classList.remove("hidden");
        errorContainer.classList.add("hidden");
        
        try {
          const formData = new FormData(form);
          const response = await submitToHubSpot(formData);
          
          if (response.ok) {
            form.classList.add("hidden");
            successMessage.classList.remove("hidden");
          } else {
            const errorData = await response.json() as HubSpotErrorResponse;
            throw new Error(errorData.message || "Form submission failed");
          }
        } catch (error) {
          errorContainer.classList.remove("hidden");
          errorMessage.textContent = error instanceof Error ? error.message : "An error occurred. Please try again.";
          
          buttonLoading.classList.add("hidden");
          buttonText.classList.remove("hidden");
          submitButton.disabled = false;
        }
      });
    } else {
      console.error("Required form elements not found");
    }
  });
}
