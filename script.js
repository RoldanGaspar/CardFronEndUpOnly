function toggleUserList() {
    const userList = document.getElementById('userList');
    const hamburger = document.querySelector('.hamburger');

    if (userList.style.left === '0px') {
        userList.style.left = '-1000px'; // Hide user list
    } else {
        userList.style.left = '0px'; // Show user list
    }

    hamburger.classList.toggle('active'); // Toggle active class for "X" animation
}

// Function to close user list when clicking outside of it
document.addEventListener('click', (event) => {
    const userList = document.getElementById('userList');
    const hamburger = document.querySelector('.hamburger');

    // Check if the click target is not within the user list or hamburger button
    if (!userList.contains(event.target) && !hamburger.contains(event.target)) {
        userList.style.left = '-1000px'; // Hide user list
        hamburger.classList.remove('active'); // Reset hamburger to default
    }
});
