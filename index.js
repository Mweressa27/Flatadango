document.addEventListener("DOMContentLoaded", function() {
    
    
    function displayMovieDetails(filmId) {
        fetch(`http://localhost:3000/films/${filmId}`, {
            method: "GET"
        })
        .then(res => res.json())
        .then(film => {  
            
            document.getElementById("movie-poster").src = film.poster;
            document.getElementById("movie-title").innerText = film.title;
            document.getElementById("movie-description").innerText = film.description;
            document.getElementById("movie-runtime").innerText = film.runtime;
            document.getElementById("movie-showtime").innerText = film.showtime;
        
            
            const availableTickets = film.capacity - film.tickets_sold;
            document.getElementById("tickets-available").innerText = availableTickets;
        
            const buyTicketButton = document.getElementById("buy-ticket-button");

            
            if (availableTickets === 0) {
                buyTicketButton.disabled = true;  
                buyTicketButton.textContent = "Sold Out";  
            } else {
                buyTicketButton.disabled = false;  
                buyTicketButton.textContent = "Buy Ticket";

                
                buyTicketButton.addEventListener('click', () => {
                    buyTicket(film); 
                });
            }
        })
        .catch(error => console.error('Error fetching movie details:', error));  
    }

    
    function displayFirstMovieDetails() {
        fetch('http://localhost:3000/films/1', {
            method: "GET"
        })
        .then(res => res.json())  
        .then(film => {  
            
            document.getElementById("movie-poster").src = film.poster;
            document.getElementById("movie-title").innerText = film.title;
            document.getElementById("movie-description").innerText = film.description;
            document.getElementById("movie-runtime").innerText = film.runtime;
            document.getElementById("movie-showtime").innerText = film.showtime;
        
            
            const availableTickets = film.capacity - film.tickets_sold;
            document.getElementById("tickets-available").innerText = availableTickets;
        
            const buyTicketButton = document.getElementById("buy-ticket-button");

            
            if (availableTickets === 0) {
                buyTicketButton.disabled = true;  
                buyTicketButton.textContent = "Sold Out";  
            } else {
                buyTicketButton.disabled = false;  
                buyTicketButton.textContent = "Buy Ticket";

                
                buyTicketButton.addEventListener('click', () => {
                    buyTicket(film); 
                });
            }
        })
        .catch(error => console.error('Error fetching first movie details:', error));  
    }

    
    function displayMovieTitles() {
        fetch("http://localhost:3000/films", {
            method: "GET"
        })
        .then(res => res.json())
        .then(films => {
            const movieList = document.getElementById('movies');
            movieList.innerHTML = ''; 

            films.forEach(film => {
                const movieTitle = document.createElement('li');

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                
            
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); 
                    deleteMovie(film.id, movieTitle);  
                });

                movieTitle.textContent = film.title;
                movieTitle.classList.add('movie-title');
                movieList.appendChild(movieTitle);
                movieTitle.appendChild(deleteBtn); 

                
                movieTitle.addEventListener('click', () => {
                    displayMovieDetails(film.id);  
                });
            });
        })
        .catch(error => console.error('Error fetching films:', error));
    }

    
    function buyTicket(film) {
        
        const availableTickets = film.capacity - film.tickets_sold;
        if (availableTickets > 0) {
            
            fetch(`http://localhost:3000/films/${film.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tickets_sold: film.tickets_sold + 1  
                })
            })
            .then(res => res.json())
            .then(updatedFilm => {
                
                const newAvailableTickets = updatedFilm.capacity - updatedFilm.tickets_sold;
                document.getElementById("tickets-available").innerText = newAvailableTickets;

                
                if (newAvailableTickets === 0) {
                    const buyTicketButton = document.getElementById("buy-ticket-button");
                    buyTicketButton.disabled = true;
                    buyTicketButton.textContent = "Sold Out";
                }

                
                logTicketPurchase(film.id);
            })
            .catch(error => console.error('Error updating tickets sold:', error));
        }
    }

    
    function logTicketPurchase(filmId) {
        fetch('http://localhost:3000/tickets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                film_id: filmId,
                number_of_tickets: 1  
            })
        })
        .then(res => res.json())
        .then(ticket => {
            console.log('Ticket purchased:', ticket);
        })
        .catch(error => console.error('Error logging ticket purchase:', error));
    }

        function deleteMovie(filmId, movieTitle) {
        fetch(`http://localhost:3000/films/${filmId}`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(() => {
            movieTitle.remove();  
        })
        .catch(error => console.error('Error deleting film:', error));  
    }

    
    displayFirstMovieDetails();
   
    displayMovieTitles();

});

