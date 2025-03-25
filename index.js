document.addEventListener("DOMContentLoaded", function(){

    function displayMovieTitle() {
        fetch("http://localhost:3000/films")
        .then(res => res.json())
        .then(films => {
            const movieList = document.getElementById('movies');
            movieList.innerHTML = ''; 
    
            films.forEach(film => {
                const movieTitle = document.createElement('li');
                movieTitle.textContent = film.title.toUpperCase(); 
                movieTitle.classList.add('movie-title');
                movieList.appendChild(movieTitle); 
                
            });
        })
        .catch(error => console.error('Error fetching films:', error)); 
    }
       
displayMovieTitle();

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
        }
    })
    .catch(error => console.error('Error fetching movie details:', error));  
}

displayFirstMovieDetails();  

























































});