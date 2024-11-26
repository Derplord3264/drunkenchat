let username = '';

document.getElementById('joinChat').addEventListener('click', () => {
    username = document.getElementById('usernameInput').value.trim();
    if (username) {
        document.getElementById('usernameInput').disabled = true;
        document.getElementById('joinChat').disabled = true;
        document.getElementById('messageInput').disabled = false;
        document.getElementById('sendMessage').disabled = false;
        initChat();
    }
});

function initChat() {
    const clientId = 'yQtCFPNcmCHSYBHC';

    const drone = new ScaleDrone(clientId, {
        data: { name: username }
    });

    drone.on('open', error => {
        if (error) return console.error(error);
        const room = drone.subscribe('observable-room');

        room.on('data', (message, member) => {
            if (member) {
                const messageElement = document.createElement('div');
                messageElement.textContent = member.clientData.name + ": " + transformMessage(message);
                document.getElementById('messages').appendChild(messageElement);
            }
        });
    });

    document.getElementById('sendMessage').addEventListener('click', () => {
        const messageInput = document.getElementById('messageInput');
        drone.publish({
            room: 'observable-room',
            message: messageInput.value
        });
        messageInput.value = '';
    });
}

function transformMessage(message) {
    if (Math.random() < 0.1) return '*burp*';

    const transformations = {
        'a': 'ah',
        'e': 'eh',
        'i': 'ih',
        'o': 'oh',
        'u': 'uh',
        's': 'sh',
        'r': 'rr',
        't': 'tt',
        'd': 'dd',
    };

    const punctuations = ['...', '...*hic*', '!', '!!'];

    // Replace letters
    let transformed = message.split('').map(char => transformations[char.toLowerCase()] || char).join('');

    // Randomly inject "*hic*"
    const hiccupInsertions = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < hiccupInsertions; i++) {
        const pos = Math.floor(Math.random() * transformed.length);
        transformed = transformed.slice(0, pos) + '*hic*' + transformed.slice(pos);
    }

    // Random punctuation insertions
    const punctuationInsertions = Math.floor(Math.random() * 3);
    for (let i = 0; i < punctuationInsertions; i++) {
        const pos = Math.floor(Math.random() * transformed.length);
        transformed = transformed.slice(0, pos) + punctuations[Math.floor(Math.random() * punctuations.length)] + transformed.slice(pos);
    }

    // Randomly swap some letters
    for (let i = 0; i < transformed.length - 1; i++) {
        if (Math.random() < 0.1) {
            let temp = transformed[i];
            transformed = transformed.slice(0, i) + transformed[i + 1] + temp + transformed.slice(i + 2);
        }
    }

    return transformed;
}
