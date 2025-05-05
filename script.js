// ==================== Configuration ====================
// Store Amadeus API credentials for authentication
const AMADEUS_CLIENT_ID = 'QlWHrU6YpZi0HM8T4GJjzS8PkoI4eGbh';
const AMADEUS_CLIENT_SECRET = 'McKMJFWIlLXdfV3N';

// ==================== Application State ====================
// Store flight search results in memory, retrieve from localStorage if available
let flights = JSON.parse(localStorage.getItem('flights')) || [];
// Track the currently selected flight's index
let currentFlightId = null;

// Store user's favorite flights, retrieve from localStorage if available
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
// Store flights selected for comparison
let flightsToCompare = [];

// ==================== DOM Elements ====================
// Get reference to the search form element
const searchForm = document.getElementById('searchForm');
// Get reference to the results list container
const resultsList = document.getElementById('resultsList');
// Get reference to the clear results button
const clearResults = document.getElementById('clearResults');
// Get reference to the flight details modal
const modal = document.getElementById('flightModal');
// Get reference to the modal content container
const modalContent = document.getElementById('modalContent');
// Get reference to the modal close button
const closeModal = document.querySelector('.close');
// Get reference to the delete flight button
const deleteFlightBtn = document.getElementById('deleteFlight');

// ==================== New DOM Elements ====================
// Get reference to the sorting dropdown
const sortBy = document.getElementById('sortBy');
// Get reference to the filtering dropdown
const filterBy = document.getElementById('filterBy');
// Get reference to the maximum price input
const maxPrice = document.getElementById('maxPrice');
// Get reference to the save favorite button
const saveFavorite = document.getElementById('saveFavorite');
// Get reference to the comparison modal
const comparisonModal = document.getElementById('comparisonModal');

// ==================== Tab Elements ====================
// Get all tab buttons for switching between different views
const tabButtons = document.querySelectorAll('.tab-btn');
// Get all tab content containers
const tabContents = document.querySelectorAll('.tab-content');
// Get reference to the favorites list container
const favoritesList = document.getElementById('favoritesList');
// Get reference to the clear favorites button
const clearFavorites = document.getElementById('clearFavorites');

// ==================== Map Elements ====================
// Initialize map variable for flight route visualization
let map;
// Initialize flight route variable for storing the current route
let flightRoute;

// ==================== UI Elements ====================
// Get reference to the loading spinner
const loadingSpinner = document.querySelector('.loading-spinner');
// Get reference to the overlay that appears during loading
const overlay = document.querySelector('.overlay');
// Get reference to the error message container
const errorMessage = document.querySelector('.error-message');
// Get reference to the error text element
const errorText = document.querySelector('.error-text');

// ==================== Currency Conversion ====================
// Store API key for currency exchange rate service
const EXCHANGE_RATE_API_KEY = '1d3ed02fa5c387c3d04396e7';
// Store exchange rates data
let exchangeRates = {};
// Track when exchange rates were last updated
let lastExchangeRateUpdate = 0;
// Define cache duration for exchange rates (1 hour in milliseconds)
const EXCHANGE_RATE_CACHE_DURATION = 3600000;

// ==================== Booking State ====================
// Store booked flights, retrieve from localStorage if available
let bookedFlights = JSON.parse(localStorage.getItem('bookedFlights')) || [];

// ==================== Airport Data ====================
// Define a list of airports with their details
const airports = [
    // Philippine Airports
    { code: 'MNL', name: 'Ninoy Aquino International Airport', city: 'Manila', country: 'Philippines' },
    { code: 'CRK', name: 'Clark International Airport', city: 'Pampanga', country: 'Philippines' },
    { code: 'CEB', name: 'Mactan-Cebu International Airport', city: 'Cebu', country: 'Philippines' },
    { code: 'DVO', name: 'Davao International Airport', city: 'Davao', country: 'Philippines' },
    { code: 'ILO', name: 'Iloilo International Airport', city: 'Iloilo', country: 'Philippines' },
    { code: 'KLO', name: 'Kalibo International Airport', city: 'Kalibo', country: 'Philippines' },
    { code: 'PPS', name: 'Puerto Princesa International Airport', city: 'Puerto Princesa', country: 'Philippines' },
    { code: 'TAG', name: 'Tagbilaran Airport', city: 'Tagbilaran', country: 'Philippines' },
    { code: 'ZAM', name: 'Zamboanga International Airport', city: 'Zamboanga', country: 'Philippines' },
    { code: 'BCD', name: 'Bacolod-Silay International Airport', city: 'Bacolod', country: 'Philippines' },
    
    // Asian Airports
    { code: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'China' },
    { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore' },
    { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand' },
    { code: 'ICN', name: 'Incheon International Airport', city: 'Seoul', country: 'South Korea' },
    { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan' },
    { code: 'PEK', name: 'Beijing Capital International Airport', city: 'Beijing', country: 'China' },
    { code: 'PVG', name: 'Shanghai Pudong International Airport', city: 'Shanghai', country: 'China' },
    { code: 'KUL', name: 'Kuala Lumpur International Airport', city: 'Kuala Lumpur', country: 'Malaysia' },
    { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'Delhi', country: 'India' },
    { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', country: 'India' },
    { code: 'CGK', name: 'Soekarno-Hatta International Airport', city: 'Jakarta', country: 'Indonesia' },
    { code: 'TPE', name: 'Taiwan Taoyuan International Airport', city: 'Taipei', country: 'Taiwan' },
    { code: 'HAN', name: 'Noi Bai International Airport', city: 'Hanoi', country: 'Vietnam' },
    { code: 'SGN', name: 'Tan Son Nhat International Airport', city: 'Ho Chi Minh City', country: 'Vietnam' },
    
    // North American Airports
    { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'USA' },
    { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'USA' },
    { code: 'SFO', name: 'San Francisco International Airport', city: 'San Francisco', country: 'USA' },
    { code: 'ORD', name: "O'Hare International Airport", city: 'Chicago', country: 'USA' },
    { code: 'YYZ', name: 'Toronto Pearson International Airport', city: 'Toronto', country: 'Canada' },
    { code: 'YVR', name: 'Vancouver International Airport', city: 'Vancouver', country: 'Canada' },
    
    // European Airports
    { code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'UK' },
    { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France' },
    { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany' },
    { code: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands' },
    { code: 'FCO', name: 'Leonardo da Vinci-Fiumicino Airport', city: 'Rome', country: 'Italy' },
    { code: 'MAD', name: 'Adolfo Suárez Madrid-Barajas Airport', city: 'Madrid', country: 'Spain' },
    
    // Middle Eastern Airports
    { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'UAE' },
    { code: 'AUH', name: 'Abu Dhabi International Airport', city: 'Abu Dhabi', country: 'UAE' },
    { code: 'DOH', name: 'Hamad International Airport', city: 'Doha', country: 'Qatar' },
    
    // Australian Airports
    { code: 'SYD', name: 'Sydney Airport', city: 'Sydney', country: 'Australia' },
    { code: 'MEL', name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia' },
    { code: 'BNE', name: 'Brisbane Airport', city: 'Brisbane', country: 'Australia' },
    
    // New Zealand Airports
    { code: 'AKL', name: 'Auckland Airport', city: 'Auckland', country: 'New Zealand' },
    { code: 'WLG', name: 'Wellington Airport', city: 'Wellington', country: 'New Zealand' }
];

// Function to initialize the map and set a default view
function initializeMap() { 
    // Create a new map instance centered roughly on the world at zoom level 2
    map = L.map('flightMap').setView([20, 0], 2); 

    // Add OpenStreetMap tiles as the base layer of the map
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors' // Display attribution for the map data
    }).addTo(map);

    // Add a default marker in Pampanga, Philippines for initial display
    L.marker([15.0794, 120.6200]).addTo(map)  // Pampanga coordinates
        .bindPopup('Map initialized successfully in Pampanga, Philippines') // Show popup message
        .openPopup(); // Automatically open the popup when map loads
}

// Function to update the map with a flight route between two airports
function updateMap(origin, destination) {
    console.log('Updating map with:', origin, destination); // Log selected airports to console
    
    // Remove the previous flight route from the map if it exists
    if (flightRoute) {
        map.removeLayer(flightRoute);
    }

    // Get the latitude and longitude coordinates of the origin and destination airports
    const originCoords = getAirportCoordinates(origin);
    const destCoords = getAirportCoordinates(destination);

    console.log('Coordinates:', originCoords, destCoords); // Log the coordinates to verify

    // Proceed only if both sets of coordinates are found
    if (originCoords && destCoords) {
        // Add a circle marker for the origin airport
        const originMarker = L.circleMarker(originCoords, {
            className: 'airport-marker origin', // Custom CSS class for styling
            radius: 8 // Size of the marker
        }).addTo(map);

        // Add a circle marker for the destination airport
        const destMarker = L.circleMarker(destCoords, {
            className: 'airport-marker destination', // Custom CSS class for styling
            radius: 8
        }).addTo(map);

        // Draw a dashed polyline (route) connecting the origin and destination markers
        flightRoute = L.polyline([originCoords, destCoords], {
            color: '#3498db', // Line color (blue)
            weight: 2,        // Line thickness
            dashArray: '5, 5', // Creates a dashed line
            className: 'flight-route' // Custom CSS class for styling
        }).addTo(map);

        // Add a popup to the origin marker with flight info
        originMarker.bindPopup(`<div class="flight-info-window">
            <h3>Origin</h3>
            <p><strong>Airport:</strong> ${origin}</p>
        </div>`);

        // Add a popup to the destination marker with flight info
        destMarker.bindPopup(`<div class="flight-info-window">
            <h3>Destination</h3>
            <p><strong>Airport:</strong> ${destination}</p>
        </div>`);

        // Adjust the map view to ensure both markers are visible with padding
        map.fitBounds([originCoords, destCoords], {
            padding: [50, 50] // Add padding around the bounds for better view
        }); 
    } else { 
        // If coordinates are missing, show an error in the console
        console.error('Could not find coordinates for one or both airports');
    }
}

// Helper function to get airport coordinates
function getAirportCoordinates(airportCode) {
    const airportCoordinates = {
        // Philippine Airports
        'MNL': [14.5086, 121.0197],  // Manila Ninoy Aquino International
        'CRK': [15.1860, 120.5600],  // Clark International Airport
        'CEB': [10.3070, 123.9790],  // Mactan-Cebu International
        'DVO': [7.1255, 125.6458],   // Davao International
        'ILO': [10.7130, 122.5450],  // Iloilo International
        'KLO': [14.5475, 121.1000],  // Kalibo International
        'PPS': [9.7422, 118.7587],   // Puerto Princesa International
        'TAG': [9.6641, 123.8533],   // Tagbilaran Airport
        'ZAM': [6.9224, 122.0596],   // Zamboanga International
        'BCD': [10.6425, 122.9297],  // Bacolod-Silay International
        
        // Asian Airports
        'HKG': [22.3080, 113.9185],  // Hong Kong International
        'SIN': [1.3502, 103.9940],   // Singapore Changi
        'BKK': [13.6811, 100.7475],  // Bangkok Suvarnabhumi
        'ICN': [37.4602, 126.4407],  // Seoul Incheon
        'NRT': [35.7647, 140.3863],  // Tokyo Narita
        'PEK': [40.0799, 116.6031],  // Beijing Capital
        'PVG': [31.1434, 121.8052],  // Shanghai Pudong
        'KUL': [2.7456, 101.7072],   // Kuala Lumpur International
        'DEL': [28.5562, 77.1000],   // Delhi Indira Gandhi
        'BOM': [19.0887, 72.8679],   // Mumbai Chhatrapati Shivaji
        'CGK': [-6.1256, 106.6558],  // Jakarta Soekarno-Hatta
        'TPE': [25.0777, 121.2328],  // Taipei Taoyuan
        'HAN': [21.2212, 105.8072],  // Hanoi Noi Bai
        'SGN': [10.8188, 106.6520],  // Ho Chi Minh City Tan Son Nhat
        
        // North American Airports
        'JFK': [40.6413, -73.7781],  // New York JFK
        'LAX': [33.9416, -118.4085], // Los Angeles
        'SFO': [37.7749, -122.4194], // San Francisco
        'ORD': [41.9742, -87.9073],  // Chicago O'Hare
        'YYZ': [43.6777, -79.6248],  // Toronto Pearson
        'YVR': [49.1939, -123.1844], // Vancouver
        
        // European Airports
        'LHR': [51.4700, -0.4543],   // London Heathrow
        'CDG': [49.0097, 2.5478],    // Paris Charles de Gaulle
        'FRA': [50.0379, 8.5622],    // Frankfurt
        'AMS': [52.3086, 4.7639],    // Amsterdam Schiphol
        'FCO': [41.8003, 12.2389],   // Rome Fiumicino
        'MAD': [40.4983, -3.5676],   // Madrid Barajas
        
        // Middle Eastern Airports
        'DXB': [25.2528, 55.3644],   // Dubai International
        'AUH': [24.4331, 54.6511],   // Abu Dhabi International
        'DOH': [25.2609, 51.6138],   // Doha Hamad
        
        // Australian Airports
        'SYD': [-33.9461, 151.1772], // Sydney
        'MEL': [-37.6733, 144.8433], // Melbourne
        'BNE': [-27.3842, 153.1175], // Brisbane
        
        // New Zealand Airports
        'AKL': [-37.0081, 174.7920], // Auckland
        'WLG': [-41.3272, 174.8051]  // Wellington
    };

    return airportCoordinates[airportCode] || null;
}

// Event Listeners
// This section sets up event listeners for the main application actions
searchForm.addEventListener('submit', handleSearch); // Listens for form submission to handle flight search
clearResults.addEventListener('click', clearAllResults); // Listens for click to clear all search results
closeModal.addEventListener('click', closeModalHandler); // Listens for click to close the flight details modal
deleteFlightBtn.addEventListener('click', deleteFlight); // Listens for click to delete a flight from the list

// New Event Listeners
// This section sets up event listeners for sorting and filtering functionality
sortBy.addEventListener('change', handleSort); // Listens for changes in the sorting dropdown
filterBy.addEventListener('change', handleFilter); // Listens for changes in the filtering dropdown

// Add event listeners for tabs
// This section manages tab switching functionality
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Gets the tab ID from the button's data attribute
        const tabId = button.getAttribute('data-tab');
        
        // Updates active tab button by removing active class from all buttons
        tabButtons.forEach(btn => btn.classList.remove('active'));
        // Adds active class to the clicked button
        button.classList.add('active');
        
        // Shows corresponding tab content by removing active class from all contents
        tabContents.forEach(content => content.classList.remove('active'));
        // Adds active class to the selected tab's content
        document.getElementById(`${tabId}Tab`).classList.add('active');
        
        // If favorites tab is selected, updates the favorites display
        if (tabId === 'favorites') {
            displayFavorites();
        }
    });
});

//================================================================================================================================
//=============================================== Favorites Section ====================================================================
//================================================================================================================================
// Add event listener for clear all favorites
// This section handles clearing all favorites with confirmation
clearFavorites.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all favorites?')) {
        favorites = [];
        localStorage.setItem('favorites', JSON.stringify(favorites));
        displayFavorites();
        updateNotificationBadges();
        // Refresh the search results to update indicators
        displayResults(flights);
    }
});

// Add event listener for save favorite button
// This section handles saving/removing a flight from favorites
saveFavorite.addEventListener('click', () => {
    // Checks if there's a currently selected flight
    if (currentFlightId !== null) {
        // Gets the current flight from the flights array
        const flight = flights[currentFlightId];
        // Toggles the favorite status of the flight
        toggleFavorite(flight);
        // Closes the modal after toggling
        closeModalHandler();
    }
});

// Function to toggle favorite status of a flight
function toggleFavorite(flight) {
    // Search for the flight in the favorites array by comparing key details including price
    const index = favorites.findIndex(f =>  
        f.itineraries[0].segments[0].departure.iataCode === flight.itineraries[0].segments[0].departure.iataCode && 
        f.itineraries[0].segments[0].arrival.iataCode === flight.itineraries[0].segments[0].arrival.iataCode && 
        f.itineraries[0].segments[0].departure.at === flight.itineraries[0].segments[0].departure.at &&
        f.itineraries[0].segments[0].carrierCode === flight.itineraries[0].segments[0].carrierCode &&
        f.itineraries[0].segments[0].number === flight.itineraries[0].segments[0].number &&
        f.price.total === flight.price.total &&  // Add price comparison
        f.price.currency === flight.price.currency  // Add currency comparison
    );
    
    // If flight is not found in favorites
    if (index === -1) {
        // Add the flight to the favorites array
        favorites.push(flight);

        // Change the button text and style to indicate it's a favorite now
        saveFavorite.textContent = 'Remove from Favorites';
        saveFavorite.classList.add('active');

        // Create a success message element to notify user
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <div class="success-content">
                <i class="fas fa-heart"></i>
                <h3>Added to Favorites!</h3>
                <p>Flight has been added to your favorites.</p>
            </div>
        `;
        
        // Add the success message to the page
        document.body.appendChild(successMessage);
        
        // Remove the message after 3 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 3000);
    } else {
        // If flight is already a favorite, remove it from the array
        favorites.splice(index, 1);

        // Reset the button text and style to default
        saveFavorite.textContent = 'Save to Favorites';
        saveFavorite.classList.remove('active');

        // Create a message indicating removal from favorites
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <div class="success-content">
                <i class="fas fa-trash"></i>
                <h3>Removed from Favorites!</h3>
                <p>Flight has been removed from your favorites.</p>
            </div>
        `;
        
        // Add the message to the document
        document.body.appendChild(successMessage);
        
        // Remove the message after 3 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 3000);
    }
    
    // Save the updated favorites list to localStorage
    localStorage.setItem('favorites', JSON.stringify(favorites));

    // Refresh the list of displayed flights
    displayResults(flights);

    // Refresh the displayed list of favorites
    displayFavorites();

    // Update any UI elements like badges to reflect changes
    updateNotificationBadges(); 
}


//================================================================================================================================
//=============================================== Search Section ====================================================================
//================================================================================================================================

//  Function to validate the flight search form inputs
function validateForm() {
    let isValid = true; // Assume form is valid initially

    // Get trimmed values from the input fields
    const origin = document.getElementById('origin').value.trim();
    const destination = document.getElementById('destination').value.trim(); 
    const departureDate = document.getElementById('departureDate').value; 

    // Clear any previous error messages and styling from form groups
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error'); // Remove error highlight
        const errorText = group.querySelector('.error-text');
        if (errorText) errorText.style.display = 'none'; // Hide error message
    });
    hideError(); // Also hide global error message (if any)

    // Check if origin is empty
    if (!origin) {
        showFieldError('origin', 'Please enter origin airport/city');
        isValid = false; // Mark form as invalid
    }

    // Check if destination is empty
    if (!destination) {
        showFieldError('destination', 'Please enter destination airport/city');
        isValid = false;
    }

    // Check if departure date is selected
    if (!departureDate) {
        showFieldError('departureDate', 'Please select departure date');
        isValid = false;
    } else {
        // Check if selected date is in the past
        const selectedDate = new Date(departureDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today's time

        if (selectedDate < today) {
            showFieldError('departureDate', 'Departure date cannot be in the past');
            isValid = false;
        }
    }

    return isValid;
}

// Helper function to show an error message on a specific form field
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId); // Get the input field
    const formGroup = field.closest('.form-group'); // Get the container div
    formGroup.classList.add('error'); // Highlight the group with error style

    // Find or create the error text element
    let errorText = formGroup.querySelector('.error-text');
    if (!errorText) {
        errorText = document.createElement('div');
        errorText.className = 'error-text';
        formGroup.appendChild(errorText); // Append it to the form group
    }

    // Set the message and display the error
    errorText.textContent = message;
    errorText.style.display = 'block';
}

// Show loading spinner and disable scroll when an API call or process is in progress
function showLoading() {
    loadingSpinner.style.display = 'block'; // Show spinner
    overlay.style.display = 'block';        // Show overlay background
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

// Hide the loading spinner and re-enable scroll
function hideLoading() {
    loadingSpinner.style.display = 'none';  // Hide spinner
    overlay.style.display = 'none';         // Hide overlay
    document.body.style.overflow = 'auto';  // Allow scrolling again
}

// Display a global error message (for API errors, etc.)
function showError(message) {
    errorText.textContent = message;          // Set the message
    errorMessage.style.display = 'block';     // Make the error container visible
}

// Hide the global error message
function hideError() { 
    errorMessage.style.display = 'none'; 
}

//================================================================================================================================
//=============================================== Search Section ====================================================================
//================================================================================================================================

// Function to handle flight search form submission
async function handleSearch(e) {
    e.preventDefault(); // Prevent default form submission behavior (page reload)
    
    // Validate form inputs first; if invalid, stop the function
    if (!validateForm()) { 
        return; 
    } 

    // Get user input values from form fields
    const origin = document.getElementById('origin').value.trim(); // Origin airport/city
    const destination = document.getElementById('destination').value.trim(); // Destination airport/city
    const departureDate = document.getElementById('departureDate').value; // Selected departure date

//================================================================================================================================
//=============================================== API FLOW STARTS====================================================================
//================================================================================================================================

    try {
        // Show the loading spinner and hide any previous error messages
        showLoading();
        hideError();

        // Request a fresh access token from the Amadeus API (required before any API call)
        const accessToken = await getAccessToken();
        
        // Use the token to search for flights based on the user's input
        let flightData = await searchFlights(accessToken, origin, destination, departureDate);
        
        // Save the results globally and to localStorage (for persistence)
        flights = flightData;
        localStorage.setItem('flights', JSON.stringify(flights));
        
        // If no flights were found, show an error message
        if (flights.length === 0) {
            showError('No flights found matching your criteria. Please try different search parameters.');
            // Clear the map if no flights found
            if (flightRoute) {
                map.removeLayer(flightRoute);
            }
            map.setView([20, 0], 2);
        } else {
            // Otherwise, display the results in the UI
            displayResults(flights);

            // Update the map with the current search route
            if (origin && destination) {
                // Remove any existing route
                if (flightRoute) {
                    map.removeLayer(flightRoute);
                }
                // Update map with new route
                updateMap(origin, destination);
            }

            // Smooth scroll to the results section when clicking the search button
            const resultsSection = document.querySelector('.results-container');
            if (resultsSection) {
                resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    } catch (error) {
        // Catch and log any errors, and show a user-friendly error message
        console.error('Error:', error);
        showError('An error occurred while searching for flights. Please try again later.');
        // Clear the map on error
        if (flightRoute) {
            map.removeLayer(flightRoute);
        }
        map.setView([20, 0], 2);
    } finally {
        // Always hide the loading spinner once the process completes (success or error)
        hideLoading();
    } 
}

//================================================================================================================================
//=============================================== API GET ACCESS TOKEN ====================================================================
//================================================================================================================================

// Function to request and retrieve an access token from the Amadeus API
async function getAccessToken() {
    try {
        // Send POST request to get OAuth2 token using client credentials
        const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
            method: 'POST', // HTTP method
            headers: { 
                'Content-Type': 'application/x-www-form-urlencoded' // Set request content type
            },
            // Request body with grant type and credentials (client ID and secret)
            body: `grant_type=client_credentials&client_id=${AMADEUS_CLIENT_ID}&client_secret=${AMADEUS_CLIENT_SECRET}`
        });
        
        // If response is not OK (status 200-299), throw an error
        if (!response.ok) {
            throw new Error('Failed to authenticate with Amadeus API');
        }

        // Parse response JSON to extract the token
        const data = await response.json();
        return data.access_token; // Return access token
    } catch (error) {
        // Log any error and throw a new one for the caller to handle
        console.error('Authentication error:', error);
        throw new Error('Failed to authenticate with the flight search service');
    }
}

// Function to search for flights using Amadeus API with token and user inputs
async function searchFlights(accessToken, origin, destination, departureDate) {
    try {
        // Construct API request with query parameters
        const response = await fetch(
            `https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=${origin}&destinationLocationCode=${destination}&departureDate=${departureDate}&adults=1&max=6`,
            {
                headers: {
                    // Use Bearer token for authorization
                    'Authorization': `Bearer ${accessToken}`
                }
            }
        );
        
        // If request fails, throw error
        if (!response.ok) {
            throw new Error('Failed to fetch flight data');
        }

        // Parse response and return the data array or an empty array
        const data = await response.json();
        return data.data || [];
    } catch (error) {
        // Log and rethrow the error
        console.error('Search error:', error);
        throw new Error('Failed to search for flights');
    }
}



// Function to display the list of flight search results in the UI
function displayResults(flights) {
    resultsList.innerHTML = ''; // Clear previous results

    // If no flights are found, show a message
    if (flights.length === 0) {
        resultsList.innerHTML = '<p class="no-results">No flights found matching your criteria.</p>';
        return;
    }

    // Loop through each flight and create a result card, then add to the list
    flights.forEach((flight, index) => {
        const flightCard = createFlightCard(flight, index); // Create a visual card element
        resultsList.appendChild(flightCard); // Append card to results container
    });
}


//===========================================================================================================================================
//====================================== Search Results Modal Section =====================================================================
//================================================================================================================================

// Function to open a modal showing detailed flight information
function openModal(flight, index) { 
    currentFlightId = index; // Store the index of the currently selected flight for use in other functions (e.g., delete or edit)

    // Check if the selected flight is already in the favorites list by matching flight IDs
    const isFavorite = favorites.some(f => 
        f.itineraries[0].segments[0].departure.iataCode === flight.itineraries[0].segments[0].departure.iataCode &&
        f.itineraries[0].segments[0].arrival.iataCode === flight.itineraries[0].segments[0].arrival.iataCode &&
        f.itineraries[0].segments[0].departure.at === flight.itineraries[0].segments[0].departure.at &&
        f.itineraries[0].segments[0].carrierCode === flight.itineraries[0].segments[0].carrierCode &&
        f.itineraries[0].segments[0].number === flight.itineraries[0].segments[0].number &&
        f.price.total === flight.price.total &&
        f.price.currency === flight.price.currency
    );
    
    // Update the save favorite button text and state based on favorite status
    const saveFavorite = document.getElementById('saveFavorite');
    if (saveFavorite) {
        saveFavorite.textContent = isFavorite ? 'Remove from Favorites' : 'Save to Favorites';
        saveFavorite.classList.toggle('active', isFavorite);
    }

    // Construct and insert the flight detail HTML into the modal content area with grid layout
    modalContent.innerHTML = `
        <div class="flight-details-grid">
            <div class="grid-item">
                <h4>From</h4>
                <p>${flight.itineraries[0].segments[0].departure.iataCode}</p>
            </div>
            <div class="grid-item">
                <h4>To</h4>
                <p>${flight.itineraries[0].segments[0].arrival.iataCode}</p>
            </div>
            <div class="grid-item">
                <h4>Departure</h4>
                <p>${new Date(flight.itineraries[0].segments[0].departure.at).toLocaleString()}</p>
            </div>
            <div class="grid-item">
                <h4>Arrival</h4>
                <p>${new Date(flight.itineraries[0].segments[0].arrival.at).toLocaleString()}</p>
            </div>
            <div class="grid-item">
                <h4>Duration</h4>
                <p>${calculateDuration(flight)}</p>
            </div>
            <div class="grid-item">
                <h4>Price</h4>
                <p>${flight.price.total} ${flight.price.currency}</p>
            </div>
            <div class="grid-item">
                <h4>Airline</h4>
                <p>${flight.validatingAirlineCodes[0]}</p>
            </div>
            <div class="grid-item">
                <h4>Flight Number</h4>
                <p>${flight.itineraries[0].segments[0].carrierCode}${flight.itineraries[0].segments[0].number}</p>
            </div>
        </div>
    `;

    // Make the modal visible on the screen
    modal.style.display = 'block';
}

// Function to close both the flight and comparison modals
function closeModalHandler() {
    modal.style.display = 'none'; // Hide the flight details modal
    comparisonModal.style.display = 'none'; // Hide the comparison modal
    currentFlightId = null; // Reset the flight ID to indicate no selection
}

// Function to delete the currently selected flight from the saved list
function deleteFlight() {
    if (currentFlightId !== null) { // Ensure a flight is selected
        if (confirm('Are you sure you want to delete this flight?')) { // Confirm deletion
            flights.splice(currentFlightId, 1); // Remove the flight from the array using its index
            localStorage.setItem('flights', JSON.stringify(flights)); // Save the updated list back to localStorage
            displayResults(flights); // Re-render the flight list on the UI
            closeModalHandler(); // Close the modal after deletion
        }
    }
}

// Function to completely clear the flight results and reset the UI
function clearAllResults() {
    flights = []; // Empty the array holding flight data
    localStorage.removeItem('flights'); // Remove saved flights from browser storage
    resultsList.innerHTML = ''; // Clear the HTML container showing results
    
    // Remove the route layer from the map, if it exists
    if (flightRoute) {
        map.removeLayer(flightRoute);
    }

    // Reset the map to its initial world-view center and zoom level
    map.setView([20, 0], 2);

    // Hide any visible error messages from the screen
    hideError();
}


// Event listener to close modals when clicking outside their boundary
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none'; // Close main modal
        currentFlightId = null; // Reset selected flight
    }
    if (e.target === comparisonModal) {
        comparisonModal.style.display = 'none'; // Close comparison modal
    }
});

//================================================================================================================================
//=============================================== Sorting Section ====================================================================
//================================================================================================================================

// Function to sort flights based on user-selected criteria
function handleSort() {
    const sortValue = sortBy.value; // Get selected sort option from the dropdown
    let sortedFlights = [...flights]; // Make a shallow copy of the flights array for sorting

    switch(sortValue) {
        case 'price':
            // Sort from lowest to highest total price
            sortedFlights.sort((a, b) => parseFloat(a.price.total) - parseFloat(b.price.total));
            break;
        case 'price-desc':
            // Sort from highest to lowest total price
            sortedFlights.sort((a, b) => parseFloat(b.price.total) - parseFloat(a.price.total));
            break;
        case 'duration':
            // Sort by shortest flight time (arrival - departure)
            sortedFlights.sort((a, b) => {
                const durationA = new Date(a.itineraries[0].segments[0].arrival.at) - new Date(a.itineraries[0].segments[0].departure.at);
                const durationB = new Date(b.itineraries[0].segments[0].arrival.at) - new Date(b.itineraries[0].segments[0].departure.at);
                return durationA - durationB;
            });
            break;
        case 'departure':
            // Sort by earliest departure time
            sortedFlights.sort((a, b) => new Date(a.itineraries[0].segments[0].departure.at) - new Date(b.itineraries[0].segments[0].departure.at));
            break;
    }

    displayResults(sortedFlights); // Display the sorted flight list on the UI
}

//================================================================================================================================
//=============================================== Filtering Section ====================================================================
//================================================================================================================================

// Function to filter flights based on type and departure time
function handleFilter() {
    const filterValue = filterBy.value; // Get selected filter option
    let filteredFlights = [...flights]; // Clone the flights array for filtering

    switch(filterValue) {
        case 'direct':
            // Only include direct flights (i.e., flights with a single segment)
            filteredFlights = filteredFlights.filter(flight => flight.itineraries[0].segments.length === 1);
            break;
        case 'morning':
            // Include flights departing between 6:00 and 11:59 AM
            filteredFlights = filteredFlights.filter(flight => {
                const hour = new Date(flight.itineraries[0].segments[0].departure.at).getHours();
                return hour >= 6 && hour < 12;
            });
            break;
        case 'afternoon':
            // Include flights departing between 12:00 and 5:59 PM
            filteredFlights = filteredFlights.filter(flight => {
                const hour = new Date(flight.itineraries[0].segments[0].departure.at).getHours();
                return hour >= 12 && hour < 18;
            });
            break;
        case 'evening':
            // Include flights departing between 6:00 PM and 5:59 AM (overnight flights)
            filteredFlights = filteredFlights.filter(flight => {
                const hour = new Date(flight.itineraries[0].segments[0].departure.at).getHours();
                return hour >= 18 || hour < 6;
            });
            break; 
    } 
     
    displayResults(filteredFlights); // Show the filtered results in the UI
}

//===========================================================================================================================================
//=============================================== Compare Section ====================================================================
//================================================================================================================================

// Comparison function to add/remove flights and show comparison if needed
function toggleCompare(flight) {
    const index = flightsToCompare.findIndex(f => f.id === flight.id); // Check if flight already exists in comparison list

    if (index === -1) { 
        flightsToCompare.push(flight); // If not found, add flight to comparison list
    } else { 
        flightsToCompare.splice(index, 1); // If found, remove flight from comparison list
    }

    if (flightsToCompare.length >= 2) {
        showComparison(); // Show comparison table if at least 2 flights are selected
    }
}

// Function to display a comparison table of selected flights
function showComparison() {
    if (flightsToCompare.length < 2) {
        alert('Please select at least 2 flights to compare'); // Alert user if fewer than 2 flights are selected
        return; // Exit function
    }

    const table = document.createElement('table'); // Create a table element
    table.className = 'comparison-table'; // Add CSS class for styling

    // Create table header row with departure → arrival route for each flight
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Feature</th>
            ${flightsToCompare.map(flight => `<th>${flight.itineraries[0].segments[0].departure.iataCode} → ${flight.itineraries[0].segments[0].arrival.iataCode}</th>`).join('')}
        </tr>
    `;

    // Create table body with rows for each flight feature
    const tbody = document.createElement('tbody');
    tbody.innerHTML = `
        <tr>
            <td>Price</td>
            ${flightsToCompare.map(flight => `<td>${flight.price.total} ${flight.price.currency}</td>`).join('')}
        </tr>
        <tr>
            <td>Departure</td>
            ${flightsToCompare.map(flight => `<td>${new Date(flight.itineraries[0].segments[0].departure.at).toLocaleString()}</td>`).join('')}
        </tr>
        <tr>
            <td>Arrival</td>
            ${flightsToCompare.map(flight => `<td>${new Date(flight.itineraries[0].segments[0].arrival.at).toLocaleString()}</td>`).join('')}
        </tr>
        <tr>
            <td>Duration</td>
            ${flightsToCompare.map(flight => `<td>${calculateDuration(flight)}</td>`).join('')} <!-- Assumes calculateDuration() returns readable string -->
        </tr>
        <tr>
            <td>Airline</td>
            ${flightsToCompare.map(flight => `<td>${flight.validatingAirlineCodes[0]}</td>`).join('')}
        </tr>
        <tr>
            <td>Flight Number</td>
            ${flightsToCompare.map(flight => `<td>${flight.itineraries[0].segments[0].carrierCode}${flight.itineraries[0].segments[0].number}</td>`).join('')}
        </tr>
    `;

    table.appendChild(thead); // Add thead to the table
    table.appendChild(tbody); // Add tbody to the table

    document.getElementById('comparisonContent').innerHTML = ''; // Clear any previous content
    document.getElementById('comparisonContent').appendChild(table); // Add the new comparison table
    comparisonModal.style.display = 'block'; // Show the comparison modal
}


// Helper function to calculate duration between departure and arrival
function calculateDuration(flight) {
    const departure = new Date(flight.itineraries[0].segments[0].departure.at); // Convert departure time to Date object
    const arrival = new Date(flight.itineraries[0].segments[0].arrival.at);     // Convert arrival time to Date object

    const duration = arrival - departure; // Calculate duration in milliseconds

    const hours = Math.floor(duration / (1000 * 60 * 60)); // Convert duration to full hours
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60)); // Get remaining minutes

    return `${hours}h ${minutes}m`; // Return formatted string (e.g., "2h 45m")
}

// Function to create a flight card element displaying flight details and actions
function createFlightCard(flight, index) {
    // Create the main container div for the flight card and assign CSS class
    const card = document.createElement('div');
    card.className = 'flight-card';
    
    // Create a container for status indicators (e.g., booked, favorite)
    const statusIndicators = document.createElement('div');
    statusIndicators.className = 'status-indicators';

//================================================================================================================================
//=============================================== Flight Card Section ====================================================================
//================================================================================================================================
    
    // Determine if the current flight is already booked by checking the bookedFlights array
    // This comparison ensures an exact match by verifying origin, destination, departure date/time, and price
    // The departure date/time is converted to a locale string for consistent comparison
    const isBooked = bookedFlights.some(booking => 
        booking.flight.origin === flight.itineraries[0].segments[0].departure.iataCode &&
        booking.flight.destination === flight.itineraries[0].segments[0].arrival.iataCode &&
        booking.flight.date === new Date(flight.itineraries[0].segments[0].departure.at).toLocaleString() &&
        booking.flight.price === `${flight.price.total} ${flight.price.currency}`
    );
    
    // Determine if the current flight is marked as a favorite by checking the favorites array
    // This comparison checks multiple flight segment details to ensure the exact same flight is identified
    const isFavorite = favorites.some(f => 
        f.itineraries[0].segments[0].departure.iataCode === flight.itineraries[0].segments[0].departure.iataCode &&
        f.itineraries[0].segments[0].arrival.iataCode === flight.itineraries[0].segments[0].arrival.iataCode &&
        f.itineraries[0].segments[0].departure.at === flight.itineraries[0].segments[0].departure.at &&
        f.itineraries[0].segments[0].carrierCode === flight.itineraries[0].segments[0].carrierCode &&
        f.itineraries[0].segments[0].number === flight.itineraries[0].segments[0].number
    );

//================================================================================================================================
//=============================================== booked status ====================================================================
//================================================================================================================================
    
    // If the flight is booked, create and append a booked status indicator icon to the status container
    if (isBooked) {
        const bookedIndicator = document.createElement('div');
        bookedIndicator.className = 'status-indicator booked';
        bookedIndicator.innerHTML = '<i class="fas fa-check"></i>'; // Checkmark icon to indicate booking
        statusIndicators.appendChild(bookedIndicator);
    }
    
    // If the flight is a favorite, create and append a favorite (heart) status indicator icon
    if (isFavorite) {
        const favoriteIndicator = document.createElement('div');
        favoriteIndicator.className = 'status-indicator favorite';
        favoriteIndicator.innerHTML = '<i class="fas fa-heart"></i>'; // Heart icon to indicate favorite
        statusIndicators.appendChild(favoriteIndicator);
    }
    
    // Create a container for detailed flight information such as route, date, and duration
    const flightDetails = document.createElement('div');
    flightDetails.className = 'flight-details';
    flightDetails.innerHTML = `
        <h3>${flight.itineraries[0].segments[0].departure.iataCode} → ${flight.itineraries[0].segments[0].arrival.iataCode}</h3>
        <p><strong>Date:</strong> ${new Date(flight.itineraries[0].segments[0].departure.at).toLocaleString()}</p>
        <p><strong>Duration:</strong> ${calculateDuration(flight)}</p>
    `;
    
    // Append the price display element created by updatePriceDisplay function to the flight details
    // This shows the total price with the appropriate currency symbol
    const priceDisplay = updatePriceDisplay(
        parseFloat(flight.price.total),
        flight.price.currency
    );
    flightDetails.appendChild(priceDisplay);
    
    // Create a container for action buttons such as booking and comparing flights
    const actions = document.createElement('div');
    actions.className = 'flight-actions';
    
    // Create the "Book Now" button with dynamic text and disabled state based on booking status
    const bookButton = document.createElement('button');
    bookButton.className = 'book-now-btn';
    bookButton.textContent = isBooked ? 'Already Booked' : 'Book Now';
    bookButton.disabled = isBooked; // Disable button if flight is already booked
    
    // Add click event handler for booking button
    bookButton.onclick = (e) => {
        e.stopPropagation(); // Prevent click event from bubbling up to the card click handler
        if (!isBooked) {
            // Prepare a simplified flight object with essential booking details
            const bookingFlight = {
                origin: flight.itineraries[0].segments[0].departure.iataCode,
                destination: flight.itineraries[0].segments[0].arrival.iataCode,
                date: new Date(flight.itineraries[0].segments[0].departure.at).toLocaleString(),
                price: `${flight.price.total} ${flight.price.currency}`,
                duration: calculateDuration(flight),
                airline: flight.validatingAirlineCodes[0],
                flightNumber: `${flight.itineraries[0].segments[0].carrierCode}${flight.itineraries[0].segments[0].number}`
            };
            // Open the booking modal dialog with the prepared flight information
            openBookingModal(bookingFlight);
        }
    };
    
    // Create a checkbox input for selecting the flight to compare with others
    const compareCheckbox = document.createElement('input');
    compareCheckbox.type = 'checkbox';
    compareCheckbox.className = 'compare-checkbox';
    compareCheckbox.id = `compare-${index}`;
    
    // Add click event handler for compare checkbox to toggle compare state without triggering card click
    compareCheckbox.onclick = (e) => {
        e.stopPropagation(); // Prevent click event from propagating to the card click handler
        toggleCompare(flight); // Toggle the flight's comparison status
    };
    
    // Create a label for the compare checkbox to improve accessibility and UX
    const compareLabel = document.createElement('label');
    compareLabel.htmlFor = `compare-${index}`;
    compareLabel.textContent = 'Compare';
    
    // Prevent label clicks from triggering the card click event
    compareLabel.onclick = (e) => {
        e.stopPropagation();
    };
    
    // Create a container div for the compare checkbox and label for better layout control
    const compareContainer = document.createElement('div');
    compareContainer.className = 'compare-container';
    
    // Prevent clicks inside the compare container from propagating to the card click handler
    compareContainer.onclick = (e) => {
        e.stopPropagation();
    };
    
    // Append compare checkbox and label to the compare container
    compareContainer.appendChild(compareCheckbox);
    compareContainer.appendChild(compareLabel);
    
    // Append the booking button and compare container to the actions container
    actions.appendChild(bookButton);
    actions.appendChild(compareContainer);
    
    // Append all major sections (status indicators, flight details, actions) to the main card container
    card.appendChild(statusIndicators);
    card.appendChild(flightDetails);
    card.appendChild(actions);
    
    // Add a click event listener on the entire card to open a modal with detailed flight information
    card.onclick = () => openModal(flight, index);
    
    // Return the fully constructed flight card element ready to be inserted into the DOM
    return card;
}


//===========================================================================================================================================
//=============================================== Favorites Section ====================================================================
//================================================================================================================================


/**
 * Renders the user's favorite flights in the UI
 * - Clears the current favorites list
 * - Shows an empty state message if no favorites exist
 * - Creates interactive cards for each favorited flight with removal functionality
 * - Each card shows key flight details and can be clicked for more information
 */
function displayFavorites() {
    // Clear the current content of the favorites list container
    favoritesList.innerHTML = '';
    
    // Display a helpful empty state message with icon if no favorites exist
    if (favorites.length === 0) {
        favoritesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-heart"></i>
                <p>No favorite flights yet</p>
                <p>Search for flights and add them to your favorites!</p>
            </div>
        `;
        return;
    }
    
    // Iterate through each favorite flight and create a visual card representation
    favorites.forEach((flight, index) => {
        // Create container element for the favorite flight card
        const favoriteCard = document.createElement('div');
        favoriteCard.className = 'favorite-card';
        
        // Populate the card with flight details using template literals
        // Includes route, price, departure time, duration and airline information
        favoriteCard.innerHTML = `
            <i class="fas fa-times remove-favorite"></i>
            <h3>${flight.itineraries[0].segments[0].departure.iataCode} → ${flight.itineraries[0].segments[0].arrival.iataCode}</h3>
            <div class="flight-info">
                <p><strong>Price:</strong> ${flight.price.total} ${flight.price.currency}</p>
                <p><strong>Departure:</strong> ${new Date(flight.itineraries[0].segments[0].departure.at).toLocaleString()}</p>
                <p><strong>Duration:</strong> ${calculateDuration(flight)}</p>
                <p><strong>Airline:</strong> ${flight.validatingAirlineCodes[0]}</p>
            </div>
        `;
        
        // Configure event listener for the remove button to handle removing favorites
        // Using stopPropagation to prevent triggering the card's click event
        const removeButton = favoriteCard.querySelector('.remove-favorite');
        removeButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent the card click event from firing
            toggleFavorite(flight); // Toggle this flight's favorite status (will remove it)
        });
        
        // Add click functionality to the entire card to show detailed flight information
        // Finds the flight in the main flights array by ID to ensure we have the latest data
        favoriteCard.addEventListener('click', () => {
            const flightIndex = flights.findIndex(f => f.id === flight.id);
            if (flightIndex !== -1) {
                openModal(flight, flightIndex); // Open detailed view modal with this flight's information
            }
        });
        
        // Add the completed favorite card to the favorites list container
        favoritesList.appendChild(favoriteCard);
    });
}

/**
 * Add custom CSS styles to the document for flight-related UI components
 * - Styles for empty state display
 * - Favorite icon active state styles
 * - Flight details formatting
 * - Dark mode compatibility for comparison tables and booking modals
 */
const style = document.createElement('style');
style.textContent = `
    /* Styling for when no search results are found */
    .no-results {
        text-align: center;
        padding: 20px;
        color: #666;
        font-style: italic;
    }
    
    /* Red color for active favorite icons to indicate saved state */
    .favorite-icon.active {
        color: #e74c3c;
    }
    
    /* Spacing and layout for flight details sections */
    .flight-details {
        margin-bottom: 20px;
    }
    
    /* Consistent spacing for paragraph elements in flight details */
    .flight-details p {
        margin: 10px 0;
    }

    /* Dark mode compatibility for comparison tables - ensures text remains readable */
    [data-theme="dark"] .comparison-table th {
        color: #000000 !important;
        background-color: #f5f5f5;
    }

    /* Dark mode compatibility for booking modal - ensures flight details remain readable */
    [data-theme="dark"] #bookingFlightDetails p,
    [data-theme="dark"] #bookingFlightDetails strong {
        color: #000000 !important;
    }
`;
document.head.appendChild(style);

/**
 * Currency exchange rate functionality
 * - Fetches current exchange rates from API
 * - Implements caching to minimize API calls
 * - Handles errors gracefully with fallback to cached data
 * - Validates response data for reliability
 * @returns {Object} Exchange rate data including conversion rates and metadata
 */
async function getExchangeRates() {
    const now = Date.now();
    
    // Use cached exchange rates if they're still fresh (within cache duration)
    if (exchangeRates.rates && (now - lastExchangeRateUpdate) < EXCHANGE_RATE_CACHE_DURATION) {
        return exchangeRates;
    }

    try {
        // Fetch the latest exchange rates from the API
        const response = await fetch(`https://v6.exchangerate-api.com/v6/1d3ed02fa5c387c3d04396e7/latest/USD`);
        
        // Check for HTTP errors in the response
        if (!response.ok) {
            throw new Error(`Failed to fetch exchange rates: ${response.status} ${response.statusText}`);
        }

        // Parse the JSON response data
        const data = await response.json();
        
        // Validate that the response contains the expected data structure
        if (!data || !data.conversion_rates) {
            throw new Error('Invalid exchange rate data received');
        }

        // Verify that PHP rate exists (specific requirement for this application)
        if (!data.conversion_rates.PHP) {
            throw new Error('PHP exchange rate not available');
        }

        // Update the cached exchange rates with fresh data
        exchangeRates = {
            rates: data.conversion_rates,
            base_code: data.base_code,
            time_last_update_utc: data.time_last_update_utc
        };
        
        // Update the timestamp for when rates were last refreshed
        lastExchangeRateUpdate = now;
        return exchangeRates;
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Exchange rate error:', error);
        
        // Fall back to cached rates if available
        if (exchangeRates.rates) {
            console.warn('Using cached exchange rates due to error');
            return exchangeRates;
        }
        
        // If no cached rates are available, propagate the error
        throw new Error('Failed to fetch exchange rates and no cached rates available');
    }
}

/**
 * Converts price amounts between different currencies
 * - Uses the latest exchange rates
 * - Converts through USD as the base currency if needed
 * - Returns original amount if currencies match or rates unavailable
 * 
 * @param {number} price - The monetary amount to convert
 * @param {string} fromCurrency - The source currency code (e.g., 'USD', 'EUR')
 * @param {string} toCurrency - The target currency code
 * @returns {number} The converted price in the target currency
 */
function convertPrice(price, fromCurrency, toCurrency) {
    // Return the original price if no conversion needed or rates unavailable
    if (!exchangeRates.rates || fromCurrency === toCurrency) {
        return price;
    }

    // Convert to USD first as our base currency if not already USD
    let priceInUSD = price;
    if (fromCurrency !== 'USD') {
        priceInUSD = price / exchangeRates.rates[fromCurrency];
    }

    // Convert from USD to the target currency using stored rates
    return priceInUSD * exchangeRates.rates[toCurrency];
}

/**
 * Formats a numeric price value into a properly formatted currency string
 * - Uses Intl.NumberFormat for locale-aware formatting
 * - Handles different currency symbols and decimal places
 * - Special case for PHP to ensure consistent decimal places
 * 
 * @param {number} price - The raw price value to format
 * @param {string} currency - The currency code (e.g., 'USD', 'EUR', 'PHP')
 * @returns {string} Formatted price string with currency symbol
 */
function formatPrice(price, currency) {
    // Create a currency formatter based on locale and currency
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: currency === 'PHP' ? 2 : 2, // Always show 2 decimal places
        maximumFractionDigits: currency === 'PHP' ? 2 : 2  // Limit to 2 decimal places
    });
    return formatter.format(price);
}

function updatePriceDisplay(price, originalCurrency) {
    const selectedCurrency = document.getElementById('currency').value;
    const convertedPrice = convertPrice(price, originalCurrency, selectedCurrency);
    
    const priceDisplay = document.createElement('div');
    priceDisplay.className = 'price-display';
    priceDisplay.innerHTML = `
        <span class="original-price">${formatPrice(price, originalCurrency)}</span>
        <span>→</span>
        <span class="converted-price">${formatPrice(convertedPrice, selectedCurrency)}</span>
    `;
    
    return priceDisplay;
}

/**
 * Sets up currency selection handler to refresh price displays across the application
 * - Triggers when the user changes their preferred currency
 * - Retrieves the stored flight data from localStorage
 * - Re-renders all flight results with updated currency conversion
 */
document.getElementById('currency').addEventListener('change', () => {
    // Retrieve the current flight search results from local storage
    const flights = JSON.parse(localStorage.getItem('flights')) || [];
    // Re-render all flight cards with prices converted to the newly selected currency
    displayResults(flights);
});

/**
 * Initializes the application when the DOM is fully loaded
 * - Fetches and caches current exchange rates
 * - Sets up the interactive map component
 * - Populates airport selection dropdowns with data
 * - Updates notification badges for favorites and bookings
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Fetch and cache exchange rates before rendering any prices
    await getExchangeRates();
    // Initialize the interactive flight map with airports and routes
    initializeMap();
    // Populate origin and destination dropdowns with airport data
    populateAirportDropdowns();
    // ... rest of your existing initialization code ...
    // Update notification badges for favorites and bookings counts
    updateNotificationBadges();
});

/**
 * Opens the booking modal with flight details for user confirmation
 * - Populates the modal with comprehensive flight information
 * - Stores the current flight data as a data attribute for form submission
 * - Makes the modal visible to the user
 * 
 * @param {Object} flight - The flight object containing all details needed for booking
 */
function openBookingModal(flight) {
    // Get references to the modal and the flight details container
    const modal = document.getElementById('bookingModal');
    const flightDetails = document.getElementById('bookingFlightDetails');
    
    // Populate the flight details section with formatted information
    // Uses template literals for clean HTML generation with dynamic data
    flightDetails.innerHTML = `
        <div class="flight-info">
            <p><strong>From:</strong> ${flight.origin}</p>
            <p><strong>To:</strong> ${flight.destination}</p>
            <p><strong>Date:</strong> ${flight.date}</p>
            <p><strong>Price:</strong> ${flight.price}</p>
            <p><strong>Duration:</strong> ${flight.duration}</p>
            <p><strong>Airline:</strong> ${flight.airline}</p>
            <p><strong>Flight Number:</strong> ${flight.flightNumber}</p>
        </div>
    `;
    
    // Store the flight data as a serialized JSON string in a data attribute
    // This allows the booking handler to access the flight data when the form is submitted
    modal.dataset.currentFlight = JSON.stringify(flight);
    
    // Display the modal by changing its display style
    modal.style.display = 'block';
}

/**
 * Closes the booking modal without completing the booking process
 * - Hides the modal from view when user cancels or after successful booking
 */
function closeBookingModal() {
    // Get reference to the booking modal
    const modal = document.getElementById('bookingModal');
    // Hide the modal by changing its display property
    modal.style.display = 'none';
}

/**
 * Generates a professionally formatted PDF receipt for a completed booking
 * - Creates a visually appealing document with branding elements
 * - Includes all booking details, passenger information, and flight data
 * - Uses gradient backgrounds, modern cards, and styled typography
 * - Saves the document to the user's device with a unique filename
 * 
 * @param {Object} booking - Complete booking object with passenger and flight details
 */
function generateBookingPDF(booking) {
    // Initialize jsPDF from the window object (loaded via CDN)
    const { jsPDF } = window.jspdf;
    // Create a new PDF document with default A4 size
    const doc = new jsPDF();
    
    // Define a consistent color palette for professional appearance
    const primaryColor = '#2171b5'; // Main blue
    const secondaryColor = '#6BAED6'; // Light blue
    const accentColor = '#BDD7E7'; // Very light blue
    const textColor = '#2c3e50'; // Dark text
    const lightGray = '#f5f6fa'; // Background for alternating sections
    
    // Create a gradient header background that spans the full width
    doc.setFillColor(33, 113, 181); // Primary blue
    doc.rect(0, 0, 210, 40, 'F');
    
    // Add decorative circular elements to the header for visual interest
    doc.setFillColor(255, 255, 255, 0.1);
    doc.circle(160, 20, 15, 'F');
    doc.circle(180, 25, 10, 'F');
    
    // Add the main title with white text for contrast against the blue header
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Flight Booking Receipt', 105, 25, { align: 'center' });
    
    // Create a card-style container for the booking reference information
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(20, 50, 170, 25, 3, 3, 'F');
    doc.setTextColor(textColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Booking Reference: ${booking.bookingReference}`, 25, 65);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${new Date(booking.bookingDate).toLocaleDateString()}`, 150, 65);
    
    // Create a card-style container for passenger information with gray background
    doc.setFillColor(lightGray);
    doc.roundedRect(20, 85, 170, 45, 3, 3, 'F');
    doc.setTextColor(textColor);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Passenger Information', 25, 100);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${booking.passenger.firstName} ${booking.passenger.lastName}`, 25, 115);
    doc.text(`Email: ${booking.passenger.email}`, 25, 125);
    doc.text(`Phone: ${booking.passenger.phone}`, 25, 135);
    
    // Create a card-style container for flight details with white background
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(20, 140, 170, 70, 3, 3, 'F');
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Flight Details', 25, 155);
    
    // Highlight the flight route with the primary brand color
    doc.setFontSize(14);
    doc.setTextColor(primaryColor);
    doc.text(`${booking.flight.origin} → ${booking.flight.destination}`, 25, 170);
    doc.setTextColor(textColor);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    
    // Arrange flight details in two columns for better space utilization
    doc.text(`Date: ${booking.flight.date}`, 25, 185);
    doc.text(`Duration: ${booking.flight.duration}`, 110, 185);
    doc.text(`Airline: ${booking.flight.airline}`, 25, 195);
    doc.text(`Flight Number: ${booking.flight.flightNumber}`, 110, 195);
    
    // Create a card-style container for payment information with gray background
    doc.setFillColor(lightGray);
    doc.roundedRect(20, 220, 170, 35, 3, 3, 'F');
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Information', 25, 235);
    doc.setFontSize(14);
    doc.setTextColor(primaryColor);
    doc.text(`Total Amount: ${booking.flight.price}`, 25, 250);
    
    // Add a branded footer with contact information
    doc.setFillColor(primaryColor);
    doc.rect(0, 265, 210, 25, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Thank you for choosing our service!', 105, 275, { align: 'center' });
    doc.text('For any queries, please contact our customer support.', 105, 282, { align: 'center' });
    
    // Set properties for decorative elements
    doc.setDrawColor(secondaryColor);
    doc.setLineWidth(0.5);
    
    // Add subtle separator lines between sections for visual organization
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 75, 190, 75);
    doc.line(20, 130, 190, 130);
    doc.line(20, 210, 190, 210);
    
    // Save the PDF to the user's device with a filename including the booking reference
    doc.save(`flight_booking_${booking.bookingReference}.pdf`);
}

/**
 * Processes the booking form submission and creates a new booking
 * - Prevents default form submission behavior
 * - Extracts and formats passenger information from the form
 * - Creates a booking object with unique ID and reference
 * - Stores the booking in local storage
 * - Displays a success message with booking details
 * - Updates the UI to reflect the new booking
 * 
 * @param {Event} event - The form submission event
 */
function handleBooking(event) {
    // Prevent the default form submission which would reload the page
    event.preventDefault();
    
    // Get references to the form and modal elements
    const form = event.target;
    const modal = document.getElementById('bookingModal');
    // Retrieve the flight data stored in the modal's data attribute
    const flight = JSON.parse(modal.dataset.currentFlight);
    
    // Process the passenger name, splitting it into first and last name components
    const fullName = form.querySelector('#passengerName').value.trim();
    const nameParts = fullName.split(' ');
    const firstName = nameParts[0];
    // If no last name is provided, duplicate the first name as the last name
    const lastName = nameParts.slice(1).join(' ') || firstName;
    
    // Create a comprehensive booking object with all necessary details
    const booking = {
        id: Date.now(), // Use timestamp as unique identifier
        flight: flight, // Include all flight details
        passenger: {
            firstName: firstName,
            lastName: lastName,
            email: form.querySelector('#passengerEmail').value,
            phone: form.querySelector('#passengerPhone').value
        },
        bookingDate: new Date().toISOString(), // Store the exact booking time
        bookingReference: generateBookingReference() // Generate a unique booking reference code
    };
    
    // Add the new booking to the booking collection and persist to localStorage
    bookedFlights.push(booking);
    localStorage.setItem('bookedFlights', JSON.stringify(bookedFlights));
    
    // Close the booking modal now that the booking is complete
    closeBookingModal();
    
    // Create and display a success message with booking details and action buttons
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h3>Booking Confirmed!</h3>
            <p>Your booking reference is: <strong>${booking.bookingReference}</strong></p>
            <p>Thank you for booking with us!</p>
            <button class="view-booking-btn" onclick="showBookedFlights()">View My Bookings</button>
            <button class="download-receipt-btn" onclick="generateBookingPDF(${JSON.stringify(booking).replace(/"/g, '&quot;')})">Download Receipt</button>
        </div>
    `;
    
    // Add the success message to the document body
    document.body.appendChild(successMessage);
    
    // Remove the success message after 5 seconds to avoid cluttering the UI
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
    
    // Update the booked flights tab UI to include the new booking
    updateBookedFlightsUI();
    // Update notification badges to reflect the new booking count
    updateNotificationBadges();
    
    // Refresh all flight cards to show "Already Booked" indicators where applicable
    displayResults(flights);
}

/**
 * Generates a unique alphanumeric booking reference code
 * - Creates a 6-character code using uppercase letters and numbers
 * - Used for easily identifying bookings in customer communications
 * 
 * @returns {string} A unique 6-character booking reference code
 */
function generateBookingReference() {
    // Define the character set for the reference code (uppercase letters and numbers)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let reference = '';
    // Generate a 6-character reference by randomly selecting from the character set
    for (let i = 0; i < 6; i++) {
        reference += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return reference;
}

/**
 * Switches the UI to display the booked flights tab
 * - Updates tab button active states
 * - Shows the booked flights tab content
 * - Refreshes the booked flights display with current data
 */
function showBookedFlights() {
    // Update the tab buttons to highlight the booked flights tab
    document.querySelectorAll('.tab-btn').forEach(btn => {
        // Remove active class from all tab buttons
        btn.classList.remove('active');
        // Add active class only to the booked tab button
        if (btn.dataset.tab === 'booked') {
            btn.classList.add('active');
        }
    });
    
    // Update the tab content areas to show only the booked flights tab
    document.querySelectorAll('.tab-content').forEach(content => {
        // Hide all tab content areas
        content.classList.remove('active');
        // Show only the booked flights tab content
        if (content.id === 'bookedTab') {
            content.classList.add('active');
        }
    });
    
    // Refresh the booked flights UI with the latest booking data
    updateBookedFlightsUI();
}

/**
 * Updates the booked flights section of the UI with current booking data
 * - Clears the existing content in the booked flights list
 * - Displays a message if no bookings exist
 * - Creates interactive cards for each booking with passenger and flight details
 * - Adds action buttons for receipt download and booking cancellation
 */
function updateBookedFlightsUI() {
    // Get reference to the container for booked flights
    const bookedList = document.getElementById('bookedList');
    // Clear any existing content to prevent duplication
    bookedList.innerHTML = '';
    
    // Display a message if the user has no bookings yet
    if (bookedFlights.length === 0) {
        bookedList.innerHTML = '<p>No booked flights yet.</p>';
        return;
    }
    
    // Iterate through each booking and create a visual card for it
    bookedFlights.forEach(booking => {
        // Create container element for the booking card
        const card = document.createElement('div');
        card.className = 'booked-card';
        
        // Populate the card with booking details using template literals
        // Organized into sections: passenger info, flight details, and action buttons
        card.innerHTML = `
            <div class="passenger-info">
                <p><strong>Passenger:</strong> ${booking.passenger.firstName} ${booking.passenger.lastName}</p>
                <p><strong>Email:</strong> ${booking.passenger.email}</p>
                <p><strong>Phone:</strong> ${booking.passenger.phone}</p>
            </div>
            <div class="flight-info">
                <p><strong>Flight:</strong> ${booking.flight.origin} → ${booking.flight.destination}</p>
                <p><strong>Date:</strong> ${booking.flight.date}</p>
                <p><strong>Price:</strong> ${booking.flight.price}</p>
                <p><strong>Booked on:</strong> ${new Date(booking.bookingDate).toLocaleDateString()}</p>
            </div>
            <div class="booked-card-actions">
                <button class="download-receipt-btn" onclick="generateBookingPDF(${JSON.stringify(booking).replace(/"/g, '&quot;')})">
                    <i class="fas fa-download"></i> Download Receipt
                </button>
                <span class="remove-booking" onclick="removeBooking(${booking.id})">×</span>
            </div>
        `;
        
        // Add the completed booking card to the booked flights list
        bookedList.appendChild(card);
    });
}

/**
 * Handles the cancellation of a flight booking
 * - Confirms the cancellation action with the user
 * - Removes the booking from application state and persistent storage
 * - Updates the UI to reflect the cancellation
 * - Displays a confirmation message to the user
 * 
 * @param {number} bookingId - The unique identifier of the booking to remove
 */
function removeBooking(bookingId) {
    // Ask for confirmation before proceeding with cancellation
    if (confirm('Are you sure you want to cancel this booking?')) {
        // Remove the booking from the array using array filtering
        // This creates a new array without the cancelled booking
        bookedFlights = bookedFlights.filter(booking => booking.id !== bookingId);
        
        // Update the bookings in localStorage to persist changes
        localStorage.setItem('bookedFlights', JSON.stringify(bookedFlights));
        
        // Refresh the booked flights display to remove the cancelled booking
        updateBookedFlightsUI();
        
        // Update the booking counter in the navigation if it exists
        const bookingsCount = document.getElementById('bookingsCount');
        if (bookingsCount) {
            bookingsCount.textContent = bookedFlights.length;
        }
        
        // Update all notification badges to reflect current counts
        updateNotificationBadges();
        
        // Refresh all flight cards to remove "Already Booked" indicators
        // for the cancelled flight
        displayResults(flights);
        
        // Create and display a success message for booking cancellation
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <h3>Booking Cancelled!</h3>
                <p>Your booking has been successfully cancelled.</p>
            </div>
        `;
        
        // Add the success message to the document
        document.body.appendChild(successMessage);
        
        // Remove the success message after 3 seconds to avoid cluttering the UI
        setTimeout(() => {
            successMessage.remove();
        }, 3000);
    }
}

/**
 * Sets up event listeners for booking-related functionality when page loads
 * - Initializes the booked flights display
 * - Sets up form submission handling for new bookings
 * - Configures modal close actions through various methods
 */
document.addEventListener('DOMContentLoaded', () => {
    // Populate the booked flights UI with any existing bookings
    updateBookedFlightsUI();
    
    // Set up the booking form to handle submissions
    const bookingForm = document.getElementById('bookingForm');
    bookingForm.addEventListener('submit', handleBooking);
    
    // Configure the close button in the booking modal
    const bookingModal = document.getElementById('bookingModal');
    const closeBtn = bookingModal.querySelector('.close');
    closeBtn.addEventListener('click', closeBookingModal);
    
    // Set up the cancel button to close the modal without booking
    const cancelBtn = document.querySelector('.cancel-btn');
    cancelBtn.addEventListener('click', closeBookingModal);
    
    // Allow users to close the modal by clicking outside of it
    // This improves usability by providing multiple ways to dismiss the modal
    window.addEventListener('click', (event) => {
        if (event.target === bookingModal) {
            closeBookingModal();
        }
    });
});

/**
 * Updates the notification badges throughout the UI
 * - Sets the count for favorites badge
 * - Sets the count for bookings badge
 * - Visually indicates to users how many items are in each collection
 */
function updateNotificationBadges() {
    // Update the favorites counter in the UI
    const favoritesCount = document.getElementById('favoritesCount');
    favoritesCount.textContent = favorites.length;
    
    // Update the bookings counter in the UI
    const bookingsCount = document.getElementById('bookingsCount');
    bookingsCount.textContent = bookedFlights.length;
}

/**
 * Populates the origin and destination dropdown menus with airport data
 * - Sorts airports alphabetically by city name for easier browsing
 * - Adds the same airport options to both dropdowns
 * - Prevents selecting the same airport for both origin and destination
 * - Formats airport options to show city, code, and airport name
 */
function populateAirportDropdowns() {
    // Get references to both dropdown elements
    const originSelect = document.getElementById('origin');
    const destinationSelect = document.getElementById('destination');
    
    // Create a sorted copy of the airports array by city name
    // This makes it easier for users to find their desired location
    const sortedAirports = [...airports].sort((a, b) => a.city.localeCompare(b.city));
    
    // Iterate through the sorted airports to add options to both dropdowns
    sortedAirports.forEach(airport => {
        // Create a descriptive label for each airport with city, code and name
        const optionText = `${airport.city} (${airport.code}) - ${airport.name}`;
        
        // Create and configure option for origin dropdown
        const originOption = document.createElement('option');
        originOption.value = airport.code; // Use airport code as the value
        originOption.textContent = optionText;
        originSelect.appendChild(originOption);
        
        // Create and configure option for destination dropdown
        const destinationOption = document.createElement('option');
        destinationOption.value = airport.code;
        destinationOption.textContent = optionText;
        destinationSelect.appendChild(destinationOption);
    });
    
    // Add change event handler to origin dropdown
    // This disables selecting the same airport in the destination dropdown
    originSelect.addEventListener('change', () => {
        const selectedOrigin = originSelect.value;
        // Loop through all destination options to update their disabled status
        Array.from(destinationSelect.options).forEach(option => {
            // Disable the option if it matches the selected origin
            option.disabled = option.value === selectedOrigin;
            // Clear selection if currently selected option becomes disabled
            if (option.disabled && option.selected) {
                destinationSelect.value = '';
            }
        });
    });
    
    // Add change event handler to destination dropdown
    // This disables selecting the same airport in the origin dropdown
    destinationSelect.addEventListener('change', () => {
        const selectedDestination = destinationSelect.value;
        // Loop through all origin options to update their disabled status
        Array.from(originSelect.options).forEach(option => {
            // Disable the option if it matches the selected destination
            option.disabled = option.value === selectedDestination;
            // Clear selection if currently selected option becomes disabled
            if (option.disabled && option.selected) {
                originSelect.value = '';
            }
        });
    });
}

/**
 * Sets up the clear bookings functionality
 * - Adds a click handler to the clear button
 * - Confirms the action with the user before proceeding
 * - Removes all bookings from state and storage
 * - Updates the UI to reflect the cleared bookings
 */
const clearBooked = document.getElementById('clearBooked');
clearBooked.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all bookings?')) {
        bookedFlights = [];
        localStorage.setItem('bookedFlights', JSON.stringify(bookedFlights));
        updateBookedFlightsUI();
        updateNotificationBadges();
        // Refresh the search results to update indicators
        displayResults(flights);
    }
});

/**
 * Initializes and manages the theme switching functionality
 * - Retrieves saved theme preference from localStorage
 * - Applies the saved theme to the document
 * - Sets up toggling between light and dark themes
 * - Persists theme changes to localStorage for future visits
 */
function initTheme() {
    // Get reference to the theme toggle button
    const themeToggle = document.getElementById('themeToggle');
    // Retrieve previously selected theme or default to light theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Apply the saved or default theme to the document
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Set up click handler for theme toggle button
    themeToggle.addEventListener('click', () => {
        // Get the current theme applied to the document
        const currentTheme = document.documentElement.getAttribute('data-theme');
        // Determine the new theme (toggle between light and dark)
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Apply the new theme to the document
        document.documentElement.setAttribute('data-theme', newTheme);
        // Save the new theme preference to localStorage for persistence
        localStorage.setItem('theme', newTheme);
    });
}

/**
 * Initializes theme settings when the DOM content is loaded
 * - Calls the theme initialization function
 * - Placeholder for other initialization code
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme settings based on saved preferences
    initTheme();
    // ... rest of your existing initialization code ...
});

/**
 * Sets up the close functionality for the flight comparison modal
 * - Adds click handler to the close button
 * - Hides the modal when the close button is clicked
 */
const comparisonCloseBtn = document.querySelector('#comparisonModal .close');
comparisonCloseBtn.addEventListener('click', () => {
    // Hide the comparison modal by changing its display property
    comparisonModal.style.display = 'none';
});
