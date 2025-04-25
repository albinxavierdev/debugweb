// Initialize the application
console.log("CCBP Clone App initialized");

// Import configuration
import config from './scripts/config';

// Enquiry Form Submission to n8n Webhook
document.addEventListener("DOMContentLoaded", () => {
  const enquiryForm = document.querySelector('#enquiryForm') as HTMLFormElement;
  
  if (enquiryForm) {
    const statusElement = document.getElementById('submission-status') as HTMLDivElement;
    
    enquiryForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      // Show debug info in development mode
      if (config.isDevelopment) {
        console.log('Form submission in development mode');
      }
      
      const nameInput = document.getElementById('name') as HTMLInputElement;
      const phoneInput = document.getElementById('phone') as HTMLInputElement;
      const emailInput = document.getElementById('email') as HTMLInputElement;
      const courseInput = document.getElementById('course') as HTMLSelectElement;
      
      // Log form values for debugging
      console.log('Form values:', {
        name: nameInput.value,
        phone: phoneInput.value,
        email: emailInput.value,
        course: courseInput.value,
        courseText: courseInput.options[courseInput.selectedIndex].text
      });
      
      const submitButton = enquiryForm.querySelector('.form-submit-btn') as HTMLButtonElement;
      const originalButtonText = submitButton.innerHTML;
      
      // Update UI to show loading state
      submitButton.innerHTML = 'Submitting...';
      submitButton.disabled = true;
      statusElement.className = 'submission-status loading';
      statusElement.textContent = 'Submitting your enquiry...';
      
      try {
        // Use the webhook URL from config with GET parameters
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.apiTimeoutMs);
        
        // Build query parameters for GET request
        const params = new URLSearchParams();
        params.append('name', nameInput.value);
        params.append('phone', phoneInput.value);
        params.append('email', emailInput.value);
        params.append('course', courseInput.value);
        params.append('courseText', courseInput.options[courseInput.selectedIndex].text);
        params.append('timestamp', new Date().toISOString());
        params.append('source', 'website_hero_form');
        
        // Construct the full URL with query parameters
        const webhookUrl = `${config.n8nWebhookUrl}?${params.toString()}`;
        console.log('Submitting to webhook URL:', webhookUrl);
        
        const response = await fetch(webhookUrl, {
          method: 'GET',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          // Handle successful submission
          statusElement.className = 'submission-status success';
          statusElement.textContent = 'Thank you! Your enquiry has been submitted successfully.';
          enquiryForm.reset();
        } else {
          // Handle server errors
          statusElement.className = 'submission-status error';
          statusElement.textContent = 'Something went wrong. Please try again later.';
        }
      } catch (error) {
        // Handle network errors
        console.error('Error submitting form:', error);
        let errorMessage = 'Network error. Please check your connection and try again.';
        
        if (error instanceof DOMException && error.name === 'AbortError') {
          errorMessage = 'Request timed out. Please try again later.';
        }
        
        statusElement.className = 'submission-status error';
        statusElement.textContent = errorMessage;
      } finally {
        // Restore button state
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
        
        // Hide status message after 5 seconds on success
        if (statusElement.classList.contains('success')) {
          setTimeout(() => {
            statusElement.style.display = 'none';
          }, 5000);
        }
      }
    });
  }
});

// Tabs functionality
document.addEventListener("DOMContentLoaded", () => {
  // Tab switching
  const tabs = document.querySelectorAll(".tab");
  const tabContents = document.querySelectorAll(".team-content");

  for (const tab of tabs) {
    tab.addEventListener("click", () => {
      // Remove active class from all tabs
      for (const t of tabs) {
        t.classList.remove("active");
      }

      // Add active class to clicked tab
      tab.classList.add("active");

      // Show the corresponding content
      const tabId = tab.getAttribute("data-tab");
      const contentToShow = document.querySelector(`#${tabId}-content`);

      if (contentToShow) {
        // Hide all contents
        for (const content of tabContents) {
          content.classList.remove("active");
        }

        // Show the target content
        contentToShow.classList.add("active");
      }
    });
  }

  // Testimonial carousel
  const dots = document.querySelectorAll(".nav-dots .dot");
  const testimonials = document.querySelectorAll(".testimonial-card");
  const prevBtn = document.querySelector(".nav-btn.prev") as HTMLButtonElement;
  const nextBtn = document.querySelector(".nav-btn.next") as HTMLButtonElement;

  let currentIndex = 0;

  // Function to show testimonial by index
  const showTestimonial = (index: number) => {
    // Hide all testimonials
    for (const testimonial of testimonials) {
      testimonial.classList.remove("active");
    }

    // Remove active class from all dots
    for (const dot of dots) {
      dot.classList.remove("active");
    }

    // Show the target testimonial
    testimonials[index].classList.add("active");

    // Add active class to the corresponding dot
    dots[index].classList.add("active");

    // Update current index
    currentIndex = index;
  };

  // Event listeners for dots
  for (let i = 0; i < dots.length; i++) {
    const dot = dots[i];
    dot.addEventListener("click", () => {
      showTestimonial(i);
    });
  }

  // Event listeners for navigation buttons
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      let newIndex = currentIndex - 1;
      if (newIndex < 0) {
        newIndex = testimonials.length - 1;
      }
      showTestimonial(newIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      let newIndex = currentIndex + 1;
      if (newIndex >= testimonials.length) {
        newIndex = 0;
      }
      showTestimonial(newIndex);
    });
  }

  // Auto rotate testimonials
  setInterval(() => {
    if (nextBtn) {
      nextBtn.click();
    }
  }, 8000);
});

// Placement Slider Functionality
const placementSlider = document.querySelector('.placement-cards');
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');
const dots = document.querySelectorAll('.slider-dots .dot');
const cards = document.querySelectorAll('.placement-card');

let currentIndex = 0;
const cardWidth = 304; // card width + gap

function updateSlider() {
  if (placementSlider) {
    placementSlider.scrollLeft = currentIndex * cardWidth;
    updateDots();
  }
}

function updateDots() {
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentIndex);
  });
}

prevBtn?.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    updateSlider();
  }
});

nextBtn?.addEventListener('click', () => {
  if (currentIndex < cards.length - 1) {
    currentIndex++;
    updateSlider();
  }
});

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    currentIndex = index;
    updateSlider();
  });
});

// Auto slide every 5 seconds
setInterval(() => {
  if (currentIndex < cards.length - 1) {
    currentIndex++;
  } else {
    currentIndex = 0;
  }
  updateSlider();
}, 2000);

// Workshop Slider
const workshopSlider = document.querySelector('.workshop-cards') as HTMLElement;
const workshopPrevBtn = document.querySelector('.workshop-slider .prev') as HTMLButtonElement;
const workshopNextBtn = document.querySelector('.workshop-slider .next') as HTMLButtonElement;
const workshopDots = document.querySelectorAll('.workshop-slider .dot') as NodeListOf<HTMLElement>;

let workshopCurrentIndex = 0;
const workshopCardWidth = 344; // 320px card width + 24px gap

function updateWorkshopSlider(index: number) {
  workshopSlider.style.transform = `translateX(-${index * workshopCardWidth}px)`;
  workshopDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

workshopPrevBtn.addEventListener('click', () => {
  workshopCurrentIndex = Math.max(workshopCurrentIndex - 1, 0);
  updateWorkshopSlider(workshopCurrentIndex);
});

workshopNextBtn.addEventListener('click', () => {
  workshopCurrentIndex = Math.min(workshopCurrentIndex + 1, workshopDots.length - 1);
  updateWorkshopSlider(workshopCurrentIndex);
});

workshopDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    workshopCurrentIndex = index;
    updateWorkshopSlider(workshopCurrentIndex);
  });
});

// Auto-slide for workshop slider
setInterval(() => {
  workshopCurrentIndex = (workshopCurrentIndex + 1) % workshopDots.length;
  updateWorkshopSlider(workshopCurrentIndex);
}, 2000);

// Hackathon Slider
const hackathonSlider = document.querySelector('.hackathon-cards') as HTMLElement;
const hackathonPrevBtn = document.querySelector('.hackathon-slider .prev') as HTMLButtonElement;
const hackathonNextBtn = document.querySelector('.hackathon-slider .next') as HTMLButtonElement;
const hackathonDots = document.querySelectorAll('.hackathon-slider .dot') as NodeListOf<HTMLElement>;

let hackathonCurrentIndex = 0;
const hackathonCardWidth = 504; // 480px card width + 24px gap

function updateHackathonSlider(index: number) {
  hackathonSlider.style.transform = `translateX(-${index * hackathonCardWidth}px)`;
  hackathonDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

hackathonPrevBtn.addEventListener('click', () => {
  hackathonCurrentIndex = Math.max(hackathonCurrentIndex - 1, 0);
  updateHackathonSlider(hackathonCurrentIndex);
});

hackathonNextBtn.addEventListener('click', () => {
  hackathonCurrentIndex = Math.min(hackathonCurrentIndex + 1, hackathonDots.length - 1);
  updateHackathonSlider(hackathonCurrentIndex);
});

hackathonDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    hackathonCurrentIndex = index;
    updateHackathonSlider(hackathonCurrentIndex);
  });
});

// Auto-slide for hackathon slider
setInterval(() => {
  hackathonCurrentIndex = (hackathonCurrentIndex + 1) % hackathonDots.length;
  updateHackathonSlider(hackathonCurrentIndex);
}, 2000);

// FAQ Functionality
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  item.addEventListener('click', () => {
    const isActive = item.classList.contains('active');
    
    // Close all other FAQs
    faqItems.forEach(otherItem => {
      if (otherItem !== item) {
        otherItem.classList.remove('active');
      }
    });
    
    // Toggle current FAQ
    item.classList.toggle('active');
    
    // If opening this FAQ, scroll it into view
    if (!isActive) {
      const yOffset = -100; // Offset from the top of the viewport
      const y = item.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  });
});
