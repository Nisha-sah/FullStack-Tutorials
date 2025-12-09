// ========================
// RESTful Movie Manager JS
// ========================

// Backend API URL
const API_URL = 'http://localhost:3000/movies';

const movieListDiv = document.getElementById('movie-list');
const searchInput = document.getElementById('search-input');
const form = document.getElementById('add-movie-form');

let allMovies = []; // Stores the full, unfiltered list of movies

// ========================
// Render movies function
// ========================
function renderMovies(moviesToDisplay) {
    movieListDiv.innerHTML = '';

    if (moviesToDisplay.length === 0) {
        movieListDiv.innerHTML = '<p>No movies found matching your criteria.</p>';
        return;
    }

    moviesToDisplay.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie-item');

        // Movie info
        const info = document.createElement('p');
        info.innerHTML = `<strong>${movie.title}</strong> (${movie.year}) - ${movie.genre}`;
        movieElement.appendChild(info);

        // Edit button
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => editMoviePrompt(movie.id, movie.title, movie.year, movie.genre));
        movieElement.appendChild(editBtn);

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteMovie(movie.id));
        movieElement.appendChild(deleteBtn);

        movieListDiv.appendChild(movieElement);

        // Debug: print the element
        console.log('Rendered movie element:', movieElement.outerHTML);
    });
}

// ========================
// Fetch all movies (READ)
// ========================
function fetchMovies() {
    fetch(API_URL)
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch movies');
            return response.json();
        })
        .then(movies => {
            allMovies = movies; // Store the full list
            renderMovies(allMovies); // Display the full list
        })
        .catch(error => console.error('Error fetching movies:', error));
}

// Initial load
fetchMovies();

// ========================
// Search functionality
// ========================
searchInput.addEventListener('input', function () {
    const searchTerm = searchInput.value.toLowerCase();

    const filteredMovies = allMovies.filter(movie => {
        const titleMatch = movie.title.toLowerCase().includes(searchTerm);
        const genreMatch = movie.genre.toLowerCase().includes(searchTerm);
        return titleMatch || genreMatch;
    });

    renderMovies(filteredMovies);
});

// ========================
// Add new movie (CREATE)
// ========================
form.addEventListener('submit', function (event) {
    event.preventDefault();

    const newMovie = {
        title: document.getElementById('title').value.trim(),
        genre: document.getElementById('genre').value.trim(),
        year: parseInt(document.getElementById('year').value)
    };

    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMovie)
    })
        .then(response => {
            if (!response.ok) throw new Error('Failed to add movie');
            return response.json();
        })
        .then(() => {
            form.reset();
            fetchMovies(); // Refresh the list
        })
        .catch(error => console.error('Error adding movie:', error));
});

// ========================
// Edit movie prompt (UPDATE)
// ========================
function editMoviePrompt(id, currentTitle, currentYear, currentGenre) {
    const newTitle = prompt('Enter new Title:', currentTitle);
    const newYearStr = prompt('Enter new Year:', currentYear);
    const newGenre = prompt('Enter new Genre:', currentGenre);

    if (newTitle && newYearStr && newGenre) {
        const updatedMovie = {
            id: id,
            title: newTitle.trim(),
            year: parseInt(newYearStr),
            genre: newGenre.trim()
        };
        updateMovie(id, updatedMovie);
    }
}

// Update movie (PUT)
function updateMovie(movieId, updatedMovieData) {
    fetch(`${API_URL}/${movieId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedMovieData)
    })
        .then(response => {
            if (!response.ok) throw new Error('Failed to update movie');
            return response.json();
        })
        .then(() => fetchMovies()) // Refresh list
        .catch(error => console.error('Error updating movie:', error));
}

// ========================
// Delete movie (DELETE)
// ========================
function deleteMovie(movieId) {
    fetch(`${API_URL}/${movieId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (!response.ok) throw new Error('Failed to delete movie');
            fetchMovies(); // Refresh list
        })
        .catch(error => console.error('Error deleting movie:', error));
}
