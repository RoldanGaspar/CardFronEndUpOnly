<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Travel Search App</title>
    <link rel="stylesheet" href="styles.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
</head>
<body>
    <div class="background-slider">
        <div class="slider-container">
            <div class="slide"></div>
            <div class="slide"></div>
            <div class="slide"></div>
            <div class="slide"></div>
            <div class="slide"></div>
        </div>
    </div>
    <div class="overlay"></div>
    <div class="stms-logo">STMS</div>
    <button id="themeToggle" class="theme-toggle">
        <i class="fas fa-sun"></i>
        <i class="fas fa-moon"></i>
    </button>
    <div class="container">
        <!-- Loading Spinner -->
        <div class="loading-spinner">
            <div class="dots-container">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        </div>

        <!-- Error Message Container -->
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <span class="error-text"></span>
        </div>

        <header>
            <div class="tabs">
                <button class="tab-btn active" data-tab="search">Search Flights</button>
                <button class="tab-btn" data-tab="favorites">
                    My Favorites
                    <span class="notification-badge" id="favoritesCount">0</span>
                </button>
                <button class="tab-btn" data-tab="booked">
                    My Bookings
                    <span class="notification-badge" id="bookingsCount">0</span>
                </button>
            </div>
        </header>
        <div class="MainSearchContainer">
        <div id="searchTab" class="tab-content active">
            <div class="search-container">
                <form id="searchForm">
                    <div class="form-group">
                        <label for="origin">Origin</label>
                        <select id="origin" required>
                            <option value="">Select Origin Airport</option>
                            <!-- Options will be populated by JavaScript -->
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="destination">Destination</label>
                        <select id="destination" required>
                            <option value="">Select Destination Airport</option>
                            <!-- Options will be populated by JavaScript -->
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="departureDate">Departure Date</label>
                        <input type="date" id="departureDate" required>
                    </div>
                    <div class="form-group">
                        <label for="currency">Currency Converter</label>
                        <div class="price-input-container">
                            <select id="currency" class="currency-selector">
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                                <option value="JPY">JPY</option>
                                <option value="INR">INR</option>
                                <option value="AUD">AUD</option>
                                <option value="CAD">CAD</option>
                                <option value="PHP">PHP</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit">Search Flights</button>
                </form>
            </div>

            <div class="results-container">
                <div class="results-header">
                    <h2>Search Results</h2>
                    <div class="results-controls">
                        <div class="sort-options">
                            <label for="sortBy">Sort by:</label>
                            <select id="sortBy">
                                <option value="price">Price (Low to High)</option>
                                <option value="price-desc">Price (High to Low)</option>
                                <option value="duration">Duration</option>
                                <option value="departure">Departure Time</option>
                            </select>
                        </div>
                        <div class="filter-options">
                            <label for="filterBy">Filter by:</label>
                            <select id="filterBy">
                                <option value="all">All Flights</option>
                                <option value="direct">Direct Flights Only</option>
                                <option value="morning">Morning Flights</option>
                                <option value="afternoon">Afternoon Flights</option>
                                <option value="evening">Evening Flights</option>
                            </select>
                        </div>
                        <button id="clearResults" class="clear-btn">Clear All</button>
                    </div>
                </div>
                <div class="results-content">
                    <div id="resultsList" class="results-list">
                        <!-- Results will be displayed here -->
                    </div>
                    <div id="mapSection" class="map-container">
                        <div id="flightMap"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

        <div id="favoritesTab" class="tab-content">
            <div class="favorites-container">
                <div class="favorites-header">
                    <h2>My Favorite Flights</h2>
                    <button id="clearFavorites" class="clear-btn">Clear All Favorites</button>
                </div>
                <div id="favoritesList" class="favorites-list">
                    <!-- Favorites will be displayed here -->
                </div>
            </div>
        </div>

        <!-- Booked Flights Section -->
        <div id="bookedTab" class="tab-content">
            <div class="booked-container">
                <div class="booked-header">
                    <h2>My Booked Flights</h2>
                    <button id="clearBooked" class="clear-btn">Clear All Bookings</button>
                </div>
                <div id="bookedList" class="booked-list">
                    <!-- Booked flights will be displayed here -->
                </div>
            </div>
        </div>

    </div>

    <!-- Flight Details Modal -->
    <div id="flightModal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Flight Details</h2>
            <div id="modalContent">
                <!-- Modal content will be displayed here -->
            </div>
            <div class="modal-actions">
                <button id="saveFavorite" class="favorite-btn">Save to Favorites</button>
                <button id="deleteFlight" class="delete-btn">Delete</button>
            </div>
        </div>
    </div>

    <!-- Comparison Modal -->
    <div id="comparisonModal" class="modal">
        <div class="modal-content comparison-content">
            <span class="close">&times;</span>
            <h2>Compare Flights</h2>
            <div id="comparisonContent">
                <!-- Comparison content will be displayed here -->
            </div>
        </div>
    </div>

    <!-- Booking Modal -->
    <div id="bookingModal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Book Flight</h2>
            <form id="bookingForm">
                <div class="form-group">
                    <label for="passengerName">Passenger Name</label>
                    <input type="text" id="passengerName" required>
                </div>
                <div class="form-group">
                    <label for="passengerEmail">Email</label>
                    <input type="email" id="passengerEmail" required>
                </div>
                <div class="form-group">
                    <label for="passengerPhone">Phone Number</label>
                    <input type="tel" id="passengerPhone" required>
                </div>
                <div class="flight-details-summary">
                    <h3>Flight Details</h3>
                    <div id="bookingFlightDetails">
                        <!-- Flight details will be inserted here -->
                    </div>
                </div>
                <div class="modal-actions">
                    <button type="submit" class="book-btn">Confirm Booking</button>
                    <button type="button" class="cancel-btn">Cancel</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Leaflet JS -->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <!-- jsPDF Library -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="script.js"></script>
</body>
</html>
