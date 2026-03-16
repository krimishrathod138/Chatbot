const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const chatContainer = document.getElementById('chat-container');
const welcomeScreen = document.querySelector('.welcome-screen');
const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');
const trainingBtn = document.getElementById('training-btn');
const trainingScreen = document.getElementById('training-screen');
const newChatBtn = document.querySelector('.new-chat-btn');

let isBackendConnected = false;

// Check backend connection
async function checkConnection() {
    try {
        const response = await fetch('http://localhost:5050/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'ping' })
        });
        if (response.ok) {
            isBackendConnected = true;
            statusDot.classList.add('connected');
            statusText.innerText = 'Backend Connected';
        }
    } catch (e) {
        isBackendConnected = false;
        statusDot.classList.remove('connected');
        statusText.innerText = 'Local Mode';
    }
}

checkConnection();
setInterval(checkConnection, 5000);

// Switch to Training Center
trainingBtn.addEventListener('click', () => {
    welcomeScreen.style.display = 'none';
    trainingScreen.style.display = 'block';
    // Clear messages visually for training view
    const messages = document.querySelectorAll('.message-wrapper');
    messages.forEach(m => m.style.display = 'none');
    
    document.querySelectorAll('.history-item').forEach(i => i.classList.remove('active'));
    trainingBtn.classList.add('active');
});

// New Chat / Switch back
newChatBtn.addEventListener('click', () => {
    location.reload(); // Simple way to reset
});

// Auto-resize textarea
userInput.addEventListener('input', () => {
    userInput.style.height = 'auto';
    userInput.style.height = userInput.scrollHeight + 'px';
    sendBtn.disabled = userInput.value.trim() === '';
});

// Handle Enter key
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

sendBtn.addEventListener('click', sendMessage);

function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    if (welcomeScreen) welcomeScreen.style.display = 'none';
    if (trainingScreen) trainingScreen.style.display = 'none';

    addMessage(text, 'user');
    userInput.value = '';
    userInput.style.height = 'auto';
    sendBtn.disabled = true;

    const typingId = addTypingIndicator();
    fetchAIResponse(text, typingId);
}

function addMessage(text, sender) {
    const wrapper = document.createElement('div');
    wrapper.className = `message-wrapper ${sender}`;
    const icon = sender === 'user' ? 'fa-user' : 'fa-robot';
    const avatarColor = sender === 'user' ? '#5436da' : '#10a37f';

    wrapper.innerHTML = `
        <div class="message-content">
            <div class="msg-avatar" style="background-color: ${avatarColor}">
                <i class="fas ${icon}"></i>
            </div>
            <div class="text">${escapeHtml(text)}</div>
        </div>
    `;

    chatContainer.appendChild(wrapper);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function addTypingIndicator() {
    const id = 'typing-' + Date.now();
    const wrapper = document.createElement('div');
    wrapper.className = 'message-wrapper ai';
    wrapper.id = id;

    wrapper.innerHTML = `
        <div class="message-content">
            <div class="msg-avatar" style="background-color: #10a37f">
                <i class="fas fa-robot"></i>
            </div>
            <div class="text">
                <div class="typing">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
            </div>
        </div>
    `;

    chatContainer.appendChild(wrapper);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    return id;
}

async function fetchAIResponse(text, typingId) {
    if (isBackendConnected) {
        try {
            const response = await fetch('http://localhost:5050/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });

            const data = await response.json();
            removeTypingIndicator(typingId);
            typeWriterEffect(data.reply || "I encountered an error processing that.", typingId);
            return;
        } catch (error) {
            console.error('Backend error:', error);
        }
    }

    // Fallback Simulation
    setTimeout(() => {
        removeTypingIndicator(typingId);
        const fallbackResponse = getSimulatedResponse(text);
        typeWriterEffect(fallbackResponse, typingId);
    }, 1000);
}

function removeTypingIndicator(id) {
    const indicator = document.getElementById(id);
    if (indicator) indicator.remove();
}

function typeWriterEffect(text, id) {
    const wrapper = document.createElement('div');
    wrapper.className = 'message-wrapper ai';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    content.innerHTML = `
        <div class="msg-avatar" style="background-color: #10a37f">
            <i class="fas fa-robot"></i>
        </div>
        <div class="text"></div>
    `;
    
    wrapper.appendChild(content);
    chatContainer.appendChild(wrapper);
    
    const textElement = content.querySelector('.text');
    let i = 0;
    
    function type() {
        if (i < text.length) {
            textElement.textContent += text.charAt(i);
            i++;
            chatContainer.scrollTop = chatContainer.scrollHeight;
            setTimeout(type, 15);
        }
    }
    
    type();
}

function getSimulatedResponse(text) {
    const input = text.toLowerCase();
    
    const knowledge = {
        "html": "HTML is the backbone of web structure. It uses tags like <div> and <span> to organize content.",
        "css": "CSS allows you to style your HTML. You can use Flexbox or Grid for professional layouts.",
        "javascript": "JS is what makes the web alive. It's used for logic, like the chat system you are using right now!",
        "python": "Python is famous for its simple syntax and power in AI and Data Science.",
        "ai": "Artificial Intelligence is the technology I use to understand your messages and respond professionally.",
        "chatgpt": "I am a clone of ChatGPT, designed to show how professional AI interfaces and backends are built.",
        "training": "I have been trained on thousands of lines of code and text to be helpful and accurate.",
        "validation": "My validation process ensures that I never provide harmful or incorrect information."
    };

    for (const key in knowledge) {
        if (input.includes(key)) return `[TRAINED RESPONSE] ${knowledge[key]}`;
    }
    
    return `You're asking about "${text}". As an AI, I've been trained to provide expert-level explanations on this. To get a full 10-paragraph breakdown, please ensure the Node.js backend is running!`;
}

// Handle suggestion clicks
document.querySelectorAll('.suggestion-card').forEach(card => {
    card.addEventListener('click', () => {
        userInput.value = card.querySelector('p').innerText;
        userInput.style.height = 'auto';
        userInput.style.height = userInput.scrollHeight + 'px';
        sendBtn.disabled = false;
        sendMessage();
    });
});
