document.addEventListener("DOMContentLoaded", function(){

    function displayMovieTitle() {
        fetch("http://localhost:3000/films")
        .then(res => res.json())
        .then(films => {
            const movieList = document.getElementById('movies');
            movieList.innerHTML = ''; // Clear the list before adding new items
    
            films.forEach(film => {
                const movieTitle = document.createElement('li');
                movieTitle.textContent = film.title; // Access title of each film
                movieList.appendChild(movieTitle); // Append each movie title to the list
            });
        })
        .catch(error => console.error('Error fetching films:', error)); // Optional: Handle errors
    }
    
    displayMovieTitle();
    


























































});