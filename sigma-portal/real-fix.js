// Quick fix for template literal issues
document.addEventListener('DOMContentLoaded', function() {
    // Fix user display
    const currentUser = localStorage.getItem('currentUser') || 'Sigma User';
    document.getElementById('userName').textContent = currentUser;
    document.getElementById('userAvatar').textContent = currentUser.charAt(0).toUpperCase();
    
    // Fix join date
    document.getElementById('joinDate').textContent = new Date().toLocaleDateString();
    
    // Fix any other template literals
    const elements = document.querySelectorAll('*');
    elements.forEach(el => {
        if (el.textContent.includes('${currentUser}')) {
            el.textContent = el.textContent.replace('${currentUser}', currentUser);
        }
        if (el.textContent.includes('${new Date()')) {
            el.textContent = el.textContent.replace('${new Date().toLocaleDateString()}', new Date().toLocaleDateString());
        }
    });
});
