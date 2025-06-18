// Simple intersection observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

emailjs.init('GHpRbBRo8wP4jaVgL');

// Observe all elements with animate-on-scroll class
document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('partnershipForm');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const formMessage = document.getElementById('formMessage');

    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
        
        // Scroll message into view
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function setSubmitButton(loading = false) {
        if (loading) {
            submitBtn.disabled = true;
            submitText.innerHTML = '<div class="loading-spinner"></div>Sending...';
        } else {
            submitBtn.disabled = false;
            submitText.textContent = 'Send Partnership Inquiry';
        }
    }

    function validateForm(formData) {
        const email = formData.get('email');
        const phone = formData.get('phone');
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address.';
        }
        
        // Basic phone validation (allows various formats)
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,15}$/;
        if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
            return 'Please enter a valid phone number.';
        }
        
        return null;
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        
        // Validate form
        const validationError = validateForm(formData);
        if (validationError) {
            showMessage(validationError, 'error');
            return;
        }
        
        // Set loading state
        setSubmitButton(true);
        formMessage.style.display = 'none';
        
        try {
            // Prepare email parameters
            const emailParams = {
                to_email: 'accugenediagnostics@gmail.com',
                from_name: formData.get('name'),
                from_email: formData.get('email'),
                organization: formData.get('organization'),
                phone: formData.get('phone'),
                partnership_type: formData.get('partnership_type'),
                message: formData.get('message'),
                subject: `Partnership Inquiry from ${formData.get('name')} - ${formData.get('organization')}`
            };
            
            // Send email using EmailJS
            const response = await emailjs.send(
                'service_az1pi5a',    // Replace with your EmailJS service ID
                'template_4pgq7ut',   // Replace with your EmailJS template ID
                emailParams
            );
            
            console.log('Email sent successfully:', response);
            showMessage(
                'Thank you! Your partnership inquiry has been submitted successfully. We\'ll get back to you within 24 hours.',
                'success'
            );
            form.reset(); // Clear the form
            
        } catch (error) {
            console.error('Email sending error:', error);
            showMessage(
                'There was an error submitting your form. Please try again or contact us directly at accugenediagnostics@gmail.coms',
                'error'
            );
        } finally {
            setSubmitButton(false);
        }
    });
    
    // Add input validation on blur
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = '#ef4444';
            } else {
                this.style.borderColor = '#d1d5db';
            }
        });
        
        input.addEventListener('input', function() {
            if (this.style.borderColor === 'rgb(239, 68, 68)') {
                this.style.borderColor = '#d1d5db';
            }
        });
    });
});