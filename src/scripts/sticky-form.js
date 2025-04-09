document.addEventListener('DOMContentLoaded', function() {
    const formSection = document.querySelector('.hero-form-section');
    const container = document.querySelector('#container');
    const cards = container.querySelectorAll('.card');
    
    if (formSection && cards.length >= 3) {
        const thirdCard = cards[2];
        
        window.addEventListener('scroll', function() {
            const thirdCardBottom = thirdCard.getBoundingClientRect().bottom;
            const formBottom = formSection.getBoundingClientRect().bottom;
            
            if (thirdCardBottom <= formBottom) {
                formSection.style.position = 'relative';
                formSection.style.top = `${thirdCardBottom - formSection.offsetHeight}px`;
            } else {
                formSection.style.position = 'sticky';
                formSection.style.top = '20px';
            }
        });
    }
}); 