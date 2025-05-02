document.addEventListener('DOMContentLoaded', function() {
    const formSection = document.querySelector('.hero-form-section');
    const container = document.querySelector('#container');
    const cards = container.querySelectorAll('.card');
    
    if (formSection && cards.length >= 3) {
        const thirdCard = cards[2];
        // Store initial values to avoid continuous recalculation
        const formInitialHeight = formSection.offsetHeight;
        let lastScrollTop = 0;
        let isPositionAdjusted = false;
        let ticking = false;
        
        // Add debouncing for smoother performance
        window.addEventListener('scroll', function() {
            if (!ticking) {
                // Use requestAnimationFrame for better performance
                window.requestAnimationFrame(function() {
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    const thirdCardRect = thirdCard.getBoundingClientRect();
                    const formRect = formSection.getBoundingClientRect();
                    
                    // Only process if we've scrolled a meaningful amount
                    const scrollDelta = Math.abs(scrollTop - lastScrollTop);
                    if (scrollDelta < 10 && isPositionAdjusted) {
                        ticking = false;
                        return;
                    }
                    
                    lastScrollTop = scrollTop;
                    
                    // Get the current positions
                    const thirdCardBottom = thirdCardRect.bottom;
                    const viewportHeight = window.innerHeight;
                    
                    // Determine when form should be relatively positioned
                    if (thirdCardBottom <= formRect.bottom) {
                        if (!isPositionAdjusted) {
                            isPositionAdjusted = true;
                            
                            // Calculate the offsets just once when transitioning
                            const offset = Math.max(0, thirdCardBottom - formInitialHeight);
                            
                            // Apply the position change with transition classes instead of direct style changes
                            formSection.classList.add('form-relative');
                            formSection.style.top = `${offset}px`;
                        }
                    } else {
                        if (isPositionAdjusted) {
                            isPositionAdjusted = false;
                            
                            // Apply transitions with classes for better performance
                            formSection.classList.remove('form-relative');
                            formSection.style.top = '20px';
                        }
                    }
                    
                    ticking = false;
                });
                
                ticking = true;
            }
        });
        
        // Add scroll event listener for smoother scrolling
        window.addEventListener('scroll', function() {
            // Force GPU acceleration on scroll
            document.body.style.perspective = '1000px';
            document.body.style.backfaceVisibility = 'hidden';
        }, { passive: true });
        
        // Add style tag for transitions
        const styleTag = document.createElement('style');
        styleTag.textContent = `
            .hero-form-section {
                transition: top 0.2s ease-out, transform 0.2s ease-out;
            }
            .form-relative {
                position: relative !important;
            }
        `;
        document.head.appendChild(styleTag);
    }
}); 