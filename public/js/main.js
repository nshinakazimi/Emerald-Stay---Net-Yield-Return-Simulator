// Form validation
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('simulatorForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            if (!form.checkValidity()) {
                e.preventDefault();
                e.stopPropagation();
                form.classList.add('was-validated');
                return; // Don't add loading state if form is invalid
            }
            
            form.classList.add('was-validated');
            
            // Add loading state only if form is valid
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Calculating...';
            }
        });

        // Real-time validation feedback
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (input.checkValidity()) {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');
                } else {
                    input.classList.remove('is-valid');
                    input.classList.add('is-invalid');
                }
            });

            input.addEventListener('input', function() {
                if (input.classList.contains('is-invalid') && input.checkValidity()) {
                    input.classList.remove('is-invalid');
                    input.classList.add('is-valid');
                }
            });
        });
    }
});

