document.addEventListener("DOMContentLoaded", function() {
    // Fetch and display films when the page loads
    fetchFilms();

    // Fetch and display movie details when a movie from the list is clicked
    function fetchFilms() {
        fetch('http://localhost:3000/films')
            .then(response => response.json())
            .then(films => {
                const filmsList = document.getElementById("films");
                filmsList.innerHTML = ''; // Clear existing list

                films.forEach(film => {
                    const availableTickets = film.capacity - film.tickets_sold;
                    const filmItem = document.createElement("li");
                    filmItem.classList.add("film-item");

                    // Add film details to the list item
                    filmItem.innerHTML = `
                        <div class="flex justify-between items-center">
                            <div class="flex items-center">
                                <img src="${film.poster}" alt="${film.title} Poster" class="w-16 h-24 mr-4">
                                <span class="font-semibold">${film.title}</span>
                            </div>
                        </div>
                    `;

                    // If the film is sold out, change button text and apply sold-out class
                    if (availableTickets === 0) {
                        filmItem.classList.add("sold-out");
                    }

                    // Add click event to display details when a movie is clicked
                    filmItem.addEventListener("click", () => {
                        displayMovieDetails(film.id);
                    });

                    filmsList.appendChild(filmItem);
                });
            })
            .catch(error => console.error('Error fetching films:', error));
    }

    // Function to fetch and display movie details
    function displayMovieDetails(filmId) {
        fetch(`/films/${filmId}`)
            .then(response => response.json())
            .then(film => {
                // Update movie details section
                document.getElementById("movie-title").innerText = film.title;
                document.getElementById("movie-poster").src = film.poster;
                document.getElementById("movie-description").innerText = film.description;
                document.getElementById("movie-runtime").innerText = film.runtime;
                document.getElementById("movie-showtime").innerText = film.showtime;

                const availableTickets = film.capacity - film.tickets_sold;
                document.getElementById("tickets-available").innerText = availableTickets;

                const buyTicketButton = document.getElementById("buy-ticket-button");
                // Enable the button if tickets are available, otherwise disable it
                if (availableTickets > 0) {
                    buyTicketButton.disabled = false;
                    buyTicketButton.innerText = "Buy Ticket";
                    buyTicketButton.addEventListener("click", () => {
                        buyTicket(film.id, availableTickets);
                    });
                } else {
                    buyTicketButton.disabled = true;
                    buyTicketButton.innerText = "Sold Out";
                }
            })
            .catch(error => console.error('Error fetching movie details:', error));
    }

    // Function to handle buying a ticket
    function buyTicket(filmId, availableTickets) {
        // Make sure tickets are still available before proceeding
        if (availableTickets > 0) {
            const newTicketsSold = availableTickets + 1;

            // Update the tickets sold on the server
            fetch(`/films/${filmId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tickets_sold: newTicketsSold })
            })
            .then(response => response.json())
            .then(() => {
                // Create the ticket purchase on the server
                return fetch('/tickets', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        film_id: filmId,
                        number_of_tickets: 1
                    })
                });
            })
            .then(() => {
                // Update the UI after successful purchase
                document.getElementById("tickets-available").innerText = availableTickets - 1;
            })
            .catch(error => console.error("Error purchasing ticket:", error));
        }
    }
});

