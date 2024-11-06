fetch('/api/games')
  .then(response => response.json())
  .then(data => {
    console.log(data); // Add this line to inspect the data structure
    const gamesList = document.createElement('ul');
    data.forEach(game => {
      const listItem = document.createElement('li');
      listItem.textContent = game.game_name // Adjust to match your actual column name
      gamesList.appendChild(listItem);
    });
    document.body.appendChild(gamesList);
  })
  .catch(error => console.error('Error fetching games:', error));