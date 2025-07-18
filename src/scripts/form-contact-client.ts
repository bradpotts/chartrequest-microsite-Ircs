/**
 * Client-side script for handling the contact form UI
 */

export interface ContactFormElements {
  form: HTMLFormElement;
  submitButton: HTMLButtonElement;
  buttonText: HTMLSpanElement;
  buttonLoading: HTMLSpanElement;
  successMessage: HTMLDivElement;
  errorContainer: HTMLDivElement;
  errorMessage: HTMLSpanElement;
}

/**
 * Get contact form UI elements
 */
export function getContactFormElements(): ContactFormElements | null {
  const elements = {
    form: document.getElementById('contact-form') as HTMLFormElement,
    submitButton: document.getElementById('contact-submit') as HTMLButtonElement,
    buttonText: document.getElementById('button-text') as HTMLSpanElement,
    buttonLoading: document.getElementById('button-loading') as HTMLSpanElement,
    successMessage: document.getElementById('form-success') as HTMLDivElement,
    errorContainer: document.getElementById('form-error') as HTMLDivElement,
    errorMessage: document.getElementById('error-message') as HTMLSpanElement
  };
  
  // Make sure all elements exist
  const allExist = Object.values(elements).every(el => el !== null);
  if (!allExist) {
    console.error('Some contact form elements are missing');
    return null;
  }
  
  return elements;
}

/**
 * Set up contact form submission handler
 */
export function setupContactFormSubmission(): void {
  const elements = getContactFormElements();
  if (!elements) return;
  
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
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json() as { success: boolean; message: string };
      
      if (response.ok && result.success) {
        // Show success message and reset form
        form.reset();
        successMessage.classList.remove('hidden');
        form.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Show error message
        errorMessage.textContent = result.message || 'An error occurred. Please try again.';
        errorContainer.classList.remove('hidden');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      errorMessage.textContent = error instanceof Error ? error.message : 'An error occurred. Please try again.';
      errorContainer.classList.remove('hidden');
    } finally {
      // Reset button state
      buttonLoading.classList.add('hidden');
      buttonText.classList.remove('hidden');
      submitButton.disabled = false;
    }
  });
}

// Initialize when in browser context
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    setupContactFormSubmission();
  });
}
