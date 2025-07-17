// Client-side script for handling contact form submission
interface FormElements {
  form: HTMLFormElement;
  submitButton: HTMLButtonElement;
  buttonText: HTMLSpanElement;
  buttonLoading: HTMLSpanElement;
  successMessage: HTMLDivElement;
  errorContainer: HTMLDivElement;
  errorMessage: HTMLSpanElement;
}

// Load Cloudflare Turnstile script
export function loadTurnstile(): void {
  const turnstileScript = document.createElement('script');
  turnstileScript.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
  turnstileScript.async = true;
  turnstileScript.defer = true;
  document.head.appendChild(turnstileScript);
}

// Initialize contact form
export function initContactForm(): void {
  document.addEventListener('DOMContentLoaded', () => {
    const elements: FormElements = {
      form: document.getElementById('contact-form') as HTMLFormElement,
      submitButton: document.getElementById('contact-submit') as HTMLButtonElement,
      buttonText: document.getElementById('button-text') as HTMLSpanElement,
      buttonLoading: document.getElementById('button-loading') as HTMLSpanElement,
      successMessage: document.getElementById('form-success') as HTMLDivElement,
      errorContainer: document.getElementById('form-error') as HTMLDivElement,
      errorMessage: document.getElementById('error-message') as HTMLSpanElement
    };
    
    const allElementsExist = Object.values(elements).every(element => element);
    
    if (allElementsExist) {
      setupFormSubmission(elements);
    } else {
      console.error('Some contact form elements not found');
    }
  });
}

// Set up form submission handler
function setupFormSubmission(elements: FormElements): void {
  const { form, submitButton, buttonText, buttonLoading, successMessage, errorContainer, errorMessage } = elements;
  
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    // Show loading state
    submitButton.disabled = true;
    buttonText.classList.add('hidden');
    buttonLoading.classList.remove('hidden');
    successMessage.classList.add('hidden');
    errorContainer.classList.add('hidden');
    
    try {
      const formData = new FormData(form);
      
      // Get Turnstile token
      const turnstileResponse = formData.get('cf-turnstile-response');
      if (!turnstileResponse) {
        throw new Error('Please complete the security check');
      }
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json() as { success: boolean; message: string };
      
      if (response.ok && result.success) {
        // Show success message and reset form
        form.reset();
        // Reset Turnstile widget by reloading it
        resetTurnstileWidget();
        successMessage.classList.remove('hidden');
        form.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Show error message
        errorMessage.textContent = result.message || 'An error occurred. Please try again.';
        errorContainer.classList.remove('hidden');
        resetTurnstileWidget();
      }
    } catch (error) {
      console.error('Form submission error:', error);
      errorMessage.textContent = error instanceof Error ? error.message : 'An error occurred. Please try again.';
      errorContainer.classList.remove('hidden');
      resetTurnstileWidget();
    } finally {
      // Reset button state
      buttonLoading.classList.add('hidden');
      buttonText.classList.remove('hidden');
      submitButton.disabled = false;
    }
  });
}

// Reset Turnstile widget
function resetTurnstileWidget(): void {
  const turnstileContainer = document.querySelector('.cf-turnstile');
  if (turnstileContainer) {
    const widgetId = turnstileContainer.getAttribute('data-widget-id');
    if (widgetId) {
      // Clear the container
      turnstileContainer.innerHTML = '';
      // Recreate the widget
      // @ts-ignore - Turnstile is loaded from external script
      if (typeof turnstile !== 'undefined') {
        // @ts-ignore
        turnstile.render(turnstileContainer);
      }
    }
  }
}

// Initialize when the script is loaded
if (typeof window !== 'undefined') {
  window.onload = loadTurnstile;
  initContactForm();
}
