// fetchGames.js
async function fetchGames() {
    try {
        const response = await fetch('/api/games');
        const games = await response.json();
        const gamesList = document.getElementById('games-list');
        
        games.forEach(game => {
            const li = document.createElement('li');
            li.textContent = `Name: ${game.game_name}, Genre: ${game.genre}, Release Year: $${game.release_year}`;
            gamesList.appendChild(li);
        });
    } catch (err) {
        console.error('Error fetching games:', err);
    }
}

fetchGames();
