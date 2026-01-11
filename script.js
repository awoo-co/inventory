// Simple button click handlers with alerts
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.cube-button');
    
    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            alert('You clicked slot ' + button.textContent + '!');
        });
    });
});
