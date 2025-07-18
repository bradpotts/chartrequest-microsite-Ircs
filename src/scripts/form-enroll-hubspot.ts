/**
 * HubSpot integration for enrollment form
 */
import type { Env } from './form-common-api-handler';
import type { EnrollmentFormData } from './form-enroll-database';

/**
 * HubSpot field structure
 */
export interface HubSpotField {
  name: string;
  value: string | null | undefined;
}

/**
 * HubSpot form submission payload
 */
export interface HubSpotPayload {
  submittedAt: number;
  fields: HubSpotField[];
  context: {
    pageUri: string;
    pageName: string;
    ipAddress?: string;
  };
  legalConsentOptions?: {
    consent: {
      consentToProcess: boolean;
      text: string;
    };
  };
}

/**
 * Map enrollment form data to HubSpot fields
 */
function mapEnrollmentToHubSpot(data: EnrollmentFormData, pageUri: string): HubSpotPayload {
  // Split fullName into first and last name for HubSpot
  const nameParts = data.fullName ? data.fullName.split(' ') : ['', ''];
  const firstName = nameParts[0] || '';
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
  
  return {
    submittedAt: Date.now(),
    fields: [
      { name: "firstname", value: firstName },
      { name: "lastname", value: lastName },
      { name: "email", value: data.email },
      { name: "phone", value: data.phone },
      { name: "company", value: data.organization },
      { name: "jobtitle", value: data.title },
      { name: "how_did_you_hear_about_us", value: data.howHeard },
      { name: "message", value: data.comments }
    ].filter(field => field.value !== null && field.value !== undefined),
    context: {
      pageUri,
      pageName: "IRCS Certification Enrollment",
      ipAddress: ""
    },
    legalConsentOptions: {
      consent: {
        consentToProcess: true,
        text: "I agree to allow ChartRequest to store and process my personal data."
      }
    }
  };
}

/**
 * Submit enrollment data to HubSpot
 */
export async function submitToHubSpot(
  data: EnrollmentFormData, 
  env: Env, 
  pageUri: string
): Promise<{ success: boolean; message: string }> {
  try {
    const portalId = env.HUBSPOT_PORTAL_ID;
    const formId = env.HUBSPOT_FORM_ID;
    
    if (!portalId || !formId) {
      throw new Error('HubSpot configuration missing');
    }
    
    const payload = mapEnrollmentToHubSpot(data, pageUri);
    
    // Submit to HubSpot
    const response = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('HubSpot API error:', errorText);
      return {
        success: false,
        message: 'Failed to submit the form to our system.'
      };
    }
    
    const result = await response.json();
    console.log('HubSpot submission successful:', result);
    
    return {
      success: true,
      message: 'Enrollment submitted successfully!'
    };
  } catch (error) {
    console.error('HubSpot submission error:', error);
    return {
      success: false,
      message: 'An error occurred while submitting your enrollment.'
    };
  }
}
