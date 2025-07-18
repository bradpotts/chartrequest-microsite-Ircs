/**
 * Client-side functionality for Enrollment form
 */

export function setupEnrollFormSubmission(): void {
  if (typeof document === 'undefined') return;
  
  // Get form elements
  const form = document.getElementById('hubspot-direct-form') as HTMLFormElement;
  const submitButton = document.getElementById('submit-button') as HTMLButtonElement;
  const buttonText = document.getElementById('button-text') as HTMLSpanElement;
  const buttonLoading = document.getElementById('button-loading') as HTMLSpanElement;
  const successMessage = document.getElementById('enrollment-success') as HTMLDivElement;
  const errorContainer = document.getElementById('form-error') as HTMLDivElement;
  const errorMessage = document.getElementById('error-message') as HTMLSpanElement;
  
  if (!form || !submitButton || !buttonText || !buttonLoading || !successMessage || !errorContainer || !errorMessage) {
    console.error('Unable to find all required form elements for enrollment form');
    return;
  }
  
  // Set up form submission handler
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
      
      // Send form data to enrollment API endpoint
      const response = await fetch('/api/enroll', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json() as { success: boolean; message: string };
      
      if (response.ok && result.success) {
        // Show success message and reset form
        form.reset();
        form.classList.add('hidden');
        successMessage.classList.remove('hidden');
        successMessage.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Show error message
        errorMessage.textContent = result.message || 'An error occurred. Please try again.';
        errorContainer.classList.remove('hidden');
        errorContainer.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Form submission error:', error);
      errorMessage.textContent = error instanceof Error ? error.message : 'An error occurred. Please try again.';
      errorContainer.classList.remove('hidden');
      errorContainer.scrollIntoView({ behavior: 'smooth' });
    } finally {
      // Reset button state
      buttonLoading.classList.add('hidden');
      buttonText.classList.remove('hidden');
      submitButton.disabled = false;
    }
  });
}
