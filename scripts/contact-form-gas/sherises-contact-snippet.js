/**
 * SheRises Contact Form - Frontend Integration Snippet
 *
 * Drop-in JavaScript to wire up contact forms to Google Apps Script backend.
 * Works with any existing HTML form that has the class "sherises-contact".
 *
 * NO FRAMEWORK DEPENDENCIES - Plain vanilla JavaScript
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

// Replace this URL with your deployed Google Apps Script Web App URL
const SHERISES_CONTACT_ENDPOINT = "PASTE_APPS_SCRIPT_WEB_APP_URL_HERE";

// ============================================================================
// FORM HANDLER
// ============================================================================

// Wait for DOM to be fully loaded before attaching event listeners
document.addEventListener('DOMContentLoaded', function() {

  // Find all forms with the class "sherises-contact"
  const contactForms = document.querySelectorAll('.sherises-contact');

  // If no matching forms exist, gracefully exit
  if (contactForms.length === 0) {
    return;
  }

  // Attach submit handler to each contact form
  contactForms.forEach(function(form) {
    form.addEventListener('submit', handleFormSubmit);
  });

});

/**
 * Handles form submission by sending data to Google Apps Script endpoint.
 *
 * @param {Event} event - Form submit event
 */
function handleFormSubmit(event) {
  // Prevent default form submission behavior
  event.preventDefault();

  const form = event.target;

  // Find or create status message element
  let statusEl = document.getElementById('form-status');
  if (!statusEl) {
    // Create status element if it doesn't exist
    statusEl = document.createElement('div');
    statusEl.id = 'form-status';
    statusEl.style.marginTop = '1rem';
    statusEl.style.padding = '0.75rem';
    statusEl.style.borderRadius = '0.375rem';
    statusEl.style.fontSize = '0.875rem';
    form.appendChild(statusEl);
  }

  // Show loading state
  statusEl.textContent = 'Sending your message...';
  statusEl.style.backgroundColor = '#E3F2FD';
  statusEl.style.color = '#1565C0';
  statusEl.style.border = '1px solid #90CAF9';
  statusEl.style.display = 'block';

  // Disable submit button to prevent double submissions
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton ? submitButton.textContent : '';
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
  }

  // Collect form data
  const formData = new FormData(form);

  // Send POST request to Google Apps Script endpoint
  fetch(SHERISES_CONTACT_ENDPOINT, {
    method: 'POST',
    body: formData
  })
  .then(function(response) {
    // Parse JSON response
    return response.json();
  })
  .then(function(data) {
    // Check if submission was successful
    if (data.ok) {
      // Show success message
      statusEl.textContent = 'Thank you! Your message has been sent successfully. We\'ll be in touch soon.';
      statusEl.style.backgroundColor = '#E8F5E9';
      statusEl.style.color = '#2E7D32';
      statusEl.style.border = '1px solid #81C784';

      // Reset the form
      form.reset();

      // Re-enable submit button
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }

      // Auto-hide success message after 5 seconds
      setTimeout(function() {
        statusEl.style.display = 'none';
      }, 5000);

    } else {
      // Show error message from server
      const errorMsg = data.error || 'An error occurred. Please try again.';
      showError(statusEl, submitButton, originalButtonText, errorMsg);
    }
  })
  .catch(function(error) {
    // Show network/connection error
    console.error('Form submission error:', error);
    showError(
      statusEl,
      submitButton,
      originalButtonText,
      'Unable to send message. Please check your internet connection and try again.'
    );
  });
}

/**
 * Displays an error message and re-enables the submit button.
 *
 * @param {HTMLElement} statusEl - Status message element
 * @param {HTMLElement} submitButton - Form submit button
 * @param {string} originalButtonText - Original button text to restore
 * @param {string} errorMessage - Error message to display
 */
function showError(statusEl, submitButton, originalButtonText, errorMessage) {
  statusEl.textContent = errorMessage;
  statusEl.style.backgroundColor = '#FFEBEE';
  statusEl.style.color = '#C62828';
  statusEl.style.border = '1px solid #EF9A9A';
  statusEl.style.display = 'block';

  // Re-enable submit button
  if (submitButton) {
    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;
  }
}
