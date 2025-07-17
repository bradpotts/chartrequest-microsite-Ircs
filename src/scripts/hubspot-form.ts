// TypeScript interfaces for HubSpot
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
  };
}

export interface HubSpotErrorResponse {
  status: string;
  message: string;
  correlationId: string;
  errors: Array<{message: string}>;
}

// Payment processor interfaces
export interface PaymentRequest {
  cardNumber: string;
  expiration: string;
  cvv: string;
  amount: number;
  currency: string;
  description: string;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  error?: string;
}

// HubSpot configuration
const HUBSPOT_PORTAL_ID = "YOUR_PORTAL_ID";
const HUBSPOT_FORM_ID = "YOUR_FORM_ID";
const HUBSPOT_API_URL = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_ID}`;

// Mock payment processor function
// Replace with actual payment processor integration in production
export async function processPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
  // This is just a mock implementation
  // In production, you would integrate with a real payment processor like Stripe, PayPal, etc.
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate successful payment
      // In production, this would be the result from your payment processor
      resolve({
        success: true,
        transactionId: `MOCK-${Date.now()}`
      });
    }, 1500);
  });
}

// Submit form data to HubSpot
export async function submitToHubSpot(formData: FormData): Promise<Response> {
  // Get form values with type checking
  const fullName = formData.get("fullName")?.toString() || "";
  const email = formData.get("email")?.toString() || "";
  const phone = formData.get("phone")?.toString() || "";
  const company = formData.get("company")?.toString() || "";
  const jobTitle = formData.get("jobTitle")?.toString() || "";
  
  // Process payment data
  const cardNumber = formData.get("cardNumber")?.toString() || "";
  const expiration = formData.get("expiration")?.toString() || "";
  const cvv = formData.get("cvv")?.toString() || "";
  
  // Process payment
  const paymentResult = await processPayment({
    cardNumber,
    expiration,
    cvv,
    amount: 495, // $495 for the IRCS Certification
    currency: "USD",
    description: "IRCS Certification Enrollment"
  });
  
  if (!paymentResult.success) {
    throw new Error(paymentResult.error || "Payment processing failed");
  }
  
  // Split name into first and last
  const nameParts = fullName.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
  
  // Prepare data for HubSpot
  const fields: HubSpotField[] = [
    { name: "firstname", value: firstName },
    { name: "lastname", value: lastName },
    { name: "email", value: email },
    { name: "phone", value: phone },
    { name: "company", value: company },
    { name: "jobtitle", value: jobTitle },
    { name: "transaction_id", value: paymentResult.transactionId },
    { name: "purchase_amount", value: "495" }
  ].filter(field => !!field.value);
  
  const payload: HubSpotPayload = {
    submittedAt: Date.now(),
    fields: fields,
    context: {
      pageUri: window.location.href,
      pageName: document.title
    }
  };
  
  // Submit to HubSpot
  return fetch(HUBSPOT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
}

// Initialize form submission
export function initializeHubSpotForm(): void {
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById("hubspot-direct-form") as HTMLFormElement;
    const successMessage = document.getElementById("enrollment-success") as HTMLDivElement;
    const errorContainer = document.getElementById("form-error") as HTMLDivElement;
    const errorMessage = document.getElementById("error-message") as HTMLParagraphElement;
    const submitButton = document.getElementById("submit-button") as HTMLButtonElement;
    const buttonText = document.getElementById("button-text") as HTMLSpanElement;
    const buttonLoading = document.getElementById("button-loading") as HTMLSpanElement;

    // Make sure all elements exist
    if (form && successMessage && errorContainer && errorMessage && submitButton && buttonText && buttonLoading) {
      // Handle form submission
      form.addEventListener("submit", async (event: Event) => {
        event.preventDefault();
        
        // Show loading state
        submitButton.disabled = true;
        buttonText.classList.add("hidden");
        buttonLoading.classList.remove("hidden");
        errorContainer.classList.add("hidden");
        
        try {
          // Get form data and submit to HubSpot
          const formData = new FormData(form);
          const response = await submitToHubSpot(formData);
          
          if (response.ok) {
            // Show success message
            form.classList.add("hidden");
            successMessage.classList.remove("hidden");
          } else {
            // Parse error response
            const errorData = await response.json() as HubSpotErrorResponse;
            throw new Error(errorData.message || "Form submission failed");
          }
        } catch (error) {
          // Show error message
          errorContainer.classList.remove("hidden");
          errorMessage.textContent = error instanceof Error ? error.message : "An error occurred. Please try again.";
          
          // Reset button
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
