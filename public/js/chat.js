document.querySelector('.chat-footer button').addEventListener('click', function() {
    const input = document.querySelector('.chat-footer input');
    const message = input.value.trim();
  
    if (message) {
      const chatBody = document.querySelector('.chat-body');
      const newMessage = document.createElement('p');
      newMessage.textContent = message;
      chatBody.appendChild(newMessage);
      chatBody.scrollTop = chatBody.scrollHeight;
      input.value = '';
    }
  });
  