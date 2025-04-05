/* ====================== */
/* GLOBAL VARIABLES */
/* ====================== */

// Array to store all fetched users
let allUsers = [];

// Pagination variables
let currentPage = 1;
const usersPerPage = 6;
const totalPages = 5;

// Dark mode state
let darkMode = false;

// Array of professional skills for users
const skills = ['software-engineer', 'cyber-security', 'web-developer', 'game-developer'];

/* ====================== */
/* USER FETCHING & DISPLAY */
/* ====================== */

// Fetch users from API and initialize application
function fetchUsers() {
    // Show loading spinner
    document.getElementById("loading").style.display = "block";

    // Fetch user data from API
    fetch(`https://randomuser.me/api/?results=${usersPerPage * totalPages}`)
        .then(response => response.json())
        .then(data => {
            // Add random skill to each user
            allUsers = data.results.map(user => {
                return {
                    ...user,
                    skill: skills[Math.floor(Math.random() * skills.length)]
                };
            });
            
            // Save a copy of the full user list for filtering
            originalUsers = [...allUsers];
            
            // Update UI with fetched users
            displayUsers();
            populateUserList();
            
            // Hide loading spinner
            document.getElementById("loading").style.display = "none";
        })
        .catch(error => console.error("Error fetching users:", error));
}

// Display users for the current page
function displayUsers() {
    const userList = document.getElementById("user-list");
    userList.innerHTML = "";

    // Calculate pagination range
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    const paginatedUsers = allUsers.slice(startIndex, endIndex);

    // Create and display user cards
    paginatedUsers.forEach((user, index) => {
        const userCard = document.createElement("div");
        userCard.classList.add("user-card");

        // Create user card HTML
        userCard.innerHTML = `
            <div class="user-badge ${user.skill}">${user.skill.replace('-', ' ')}</div>
            <img src="${user.picture.large}" alt="Profile Picture" onclick="showUserDetails(${index})">
            <h3 onclick="showUserDetails(${index})">${user.name.first} ${user.name.last}</h3>
            <p onclick="showUserDetails(${index})">${user.location.city}, ${user.location.country}</p>
            <button class="like-btn" onclick="toggleLike(${index})">❤️ Like</button>
            <button class="follow-btn" onclick="toggleFollow(${index})">➕ Follow</button>
        `;

        userList.appendChild(userCard);
    });

    // Update pagination controls
    updatePaginationButtons();
}

/* ====================== */
/* NOTIFICATION SYSTEM */
/* ====================== */

// Show temporary notification message
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Hide and remove notification after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 2000);
}

/* ====================== */
/* USER INTERACTIONS */
/* ====================== */

// Toggle like state for a user
function toggleLike(index) {
    let btn = document.querySelectorAll(".like-btn")[index];
    const isLiking = !btn.classList.contains("liked");
    btn.classList.toggle("liked");
    btn.innerText = btn.classList.contains("liked") ? "💖 Liked" : "❤️ Like";
    
    const user = allUsers[(currentPage-1)*usersPerPage + index];
    showNotification(isLiking 
        ? `💝You liked💖 ${user.name.first} ${user.name.last}!` 
        : `👎You unliked😂 ${user.name.first} ${user.name.last}`);
}

// Toggle follow state for a user
function toggleFollow(index) {
    let btn = document.querySelectorAll(".follow-btn")[index];
    const isFollowing = !btn.classList.contains("following");
    btn.classList.toggle("following");
    btn.innerText = btn.classList.contains("following") ? "✔ Following" : "➕ Follow";
    
    const user = allUsers[(currentPage-1)*usersPerPage + index];
    showNotification(isFollowing 
        ? `🫂You followed✅ ${user.name.first} ${user.name.last}!` 
        : `❌You unfollowed😭 ${user.name.first} ${user.name.last}`);
}

/* ====================== */
/* PAGINATION */
/* ====================== */

// Update pagination controls state
function updatePaginationButtons() {
    const filteredTotalPages = Math.ceil(allUsers.length / usersPerPage);
    document.getElementById("prevBtn").disabled = currentPage === 1;
    document.getElementById("nextBtn").disabled = currentPage === filteredTotalPages;
    document.getElementById("pageIndicator").innerText = `Page ${currentPage} of ${filteredTotalPages}`;
}

// Change current page
function changePage(step) {
    currentPage += step;
    displayUsers();
}

/* ====================== */
/* SEARCH & FILTER */
/* ====================== */

// Clear search input and reset user list
function clearSearch() {
    document.getElementById("search").value = "";
    filterUsers();
}

// Filter users by search query with debounce
let debounceTimer;
function filterUsers() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        const searchQuery = document.getElementById("search").value.toLowerCase();

        if (searchQuery === "") {
            allUsers = [...originalUsers]; // Restore full list if search is empty
        } else {
            allUsers = originalUsers.filter(user =>
                `${user.name.first} ${user.name.last}`.toLowerCase().includes(searchQuery)
            );
        }
        
        currentPage = 1; // Reset to first page
        displayUsers();
    }, 300);
}

// Filter users by skill
function filterBySkill(skill) {
    if (!skill) {
        allUsers = [...originalUsers];
    } else {
        allUsers = originalUsers.filter(user => user.skill === skill);
    }
    currentPage = 1;
    displayUsers();
}

/* ====================== */
/* DARK MODE */
/* ====================== */

// Toggle dark mode
function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.classList.toggle("dark-mode", darkMode);
    localStorage.setItem("darkMode", darkMode);
}

// Initialize dark mode from localStorage
document.addEventListener("DOMContentLoaded", function () {
    darkMode = JSON.parse(localStorage.getItem("darkMode")) || false;
    document.body.classList.toggle("dark-mode", darkMode);
});

/* ====================== */
/* USER DETAILS MODAL */
/* ====================== */

// Show user details in modal
function showUserDetails(index) {
    const user = allUsers[(currentPage-1)*usersPerPage + index];
    const modal = document.getElementById("userModal");
    const content = document.getElementById("userDetailsContent");
    
    // Create modal content
    content.innerHTML = `
        <img src="${user.picture.large}" alt="Profile Picture">
        <h2>${user.name.first} ${user.name.last}</h2>
        <div class="user-info">
            <div class="info-item"><strong>Email:</strong> ${user.email}</div>
            <div class="info-item"><strong>Phone:</strong> ${user.phone}</div>
            <div class="info-item"><strong>Location:</strong> ${user.location.city}, ${user.location.country}</div>
            <div class="info-item"><strong>Skill:</strong> ${user.skill.replace('-', ' ')}</div>
            <div class="info-item"><strong>Gender:</strong> ${user.gender}</div>
            <div class="info-item"><strong>Age:</strong> ${user.dob.age}</div>
        </div>
    `;
    
    modal.style.display = "block";
}

// Close user details modal
function closeModal() {
    document.getElementById("userModal").style.display = "none";
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById("userModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

/* ====================== */
/* INITIALIZATION */
/* ====================== */

// Initialize application on page load
document.addEventListener("DOMContentLoaded", function () {
    // Set up pagination buttons
    document.getElementById("prevBtn").addEventListener("click", function () {
        changePage(-1);
    });

    document.getElementById("nextBtn").addEventListener("click", function () {
        changePage(1);
    });

    // Set up sidebar toggle button
    const toggleBtn = document.getElementById("toggleUserList");
    const sidebar = document.querySelector(".user-list-sidebar");
    
    toggleBtn.addEventListener("click", function(e) {
        e.stopPropagation();
        if (sidebar) {
            sidebar.classList.toggle("show");
        }
    });

    // Close sidebar when clicking outside
    document.addEventListener("click", function(e) {
        if (sidebar && !sidebar.contains(e.target) && e.target !== toggleBtn) {
            sidebar.classList.remove("show");
        }
    });

    // Set up clear search button
    document.getElementById("clearSearch").addEventListener("click", clearSearch);

    // Fetch users and initialize
    fetchUsers();
});

/* ====================== */
/* SORTING */
/* ====================== */

// Sort users by criteria
function sortUsers(criteria) {
    if (criteria === "name") {
        allUsers.sort((a, b) => a.name.first.localeCompare(b.name.first));
    } else if (criteria === "country") {
        allUsers.sort((a, b) => a.location.country.localeCompare(b.location.country));
    }
    displayUsers();
}

/* ====================== */
/* SIDEBAR USER LIST */
/* ====================== */

// Populate sidebar with user names
function populateUserList() {
    const userListSidebar = document.getElementById("user-name-list");
    if (!userListSidebar) return;
    
    userListSidebar.innerHTML = ""; // Clear old list

    // Create list items for each user
    allUsers.forEach(user => {
        const listItem = document.createElement("li");
        listItem.textContent = `${user.name.first} ${user.name.last}`;
        listItem.onclick = () => {
            document.getElementById("search").value = `${user.name.first} ${user.name.last}`;
            filterUsers();
        };
        userListSidebar.appendChild(listItem);
    });
}
