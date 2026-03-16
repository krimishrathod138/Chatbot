const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 5050;

app.use(cors());
app.use(express.json());

// 1. ADVANCED TRAINING (System Knowledge Base)
const KNOWLEDGE_BASE = {
    "html": "HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser. It defines the content and structure of web pages using symbols called 'tags'. For example, <h1> is for headings, and <p> is for paragraphs.",
    "css": "CSS (Cascading Style Sheets) is a stylesheet language used for describing the presentation of a document written in HTML. It handles the layout, colors, fonts, and overall visual appearance of a website, allowing for responsive and attractive designs.",
    "javascript": "JavaScript is a versatile, high-level programming language that adds interactivity to web pages. It allows for complex features like animations, dynamic content updates, and asynchronous communication with servers (AJAX/Fetch).",
    "python": "Python is a high-level, interpreted programming language known for its readability and versatility. It is widely used in data science, artificial intelligence, web development, and automation scripts.",
    "ai": "Artificial Intelligence (AI) is the simulation of human intelligence processes by machines, especially computer systems. These processes include learning, reasoning, and self-correction. Modern AI, like ChatGPT, uses Large Language Models (LLMs) to understand and generate text.",
    "chatgpt": "ChatGPT is an AI-powered chatbot developed by OpenAI. It uses a transformer-based architecture to process language and can answer questions, write essays, and even generate code based on user prompts.",
    "training": "Training an AI involves feeding it massive amounts of data so it can learn patterns and relationships. This process, called machine learning, allows the AI to predict the next word in a sentence or recognize objects in an image.",
    "validation": "Validation is the process of testing an AI model on a separate dataset to ensure it can generalize its knowledge and provide accurate, safe, and unbiased results in real-world scenarios.",
    "react": "React is a popular JavaScript library for building user interfaces, especially for single-page applications. It's used for handling the view layer in web and mobile apps. React allows developers to create reusable UI components.",
    "node": "Node.js is a cross-platform, open-source JavaScript runtime environment that can run on Windows, Linux, Unix, macOS, and more. Node.js runs the V8 JavaScript engine, the core of Google Chrome, outside of the browser.",
    "database": "A database is an organized collection of structured information, or data, typically stored electronically in a computer system. A database is usually controlled by a database management system (DBMS)."
};

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });
    if (message === 'ping') return res.json({ status: 'ok' });

    // Validation
    if (message.length < 2) return res.json({ reply: "Please provide a more detailed question so I can explain it properly." });

    // AI Explanation Logic
    setTimeout(() => {
        const reply = generateDetailedExplanation(message);
        res.json({ reply });
    }, 1500);
});

function generateDetailedExplanation(text) {
    const input = text.toLowerCase();
    
    // Check Knowledge Base
    for (const topic in KNOWLEDGE_BASE) {
        if (input.includes(topic)) {
            return `Here is a detailed explanation of ${topic.toUpperCase()}:\n\n${KNOWLEDGE_BASE[topic]}\n\nWould you like me to dive deeper into any specific part of this?`;
        }
    }

    // Generic "AI Thinking" response for other topics
    if (input.split(' ').length > 3) {
        return `I've analyzed your request regarding "${text}". \n\nTo explain this properly: This topic involves complex interactions between various factors. In a professional context, we look at how these elements influence the final outcome. \n\nSpecifically, you might want to consider the historical context and the modern applications of this concept. Would you like a more technical breakdown?`;
    }

    return "That's an interesting topic! To provide a ChatGPT-level explanation, I need a bit more context. Could you specify which part of this you'd like me to explain in detail?";
}

app.listen(port, () => {
    console.log(`\n🚀 Advanced AI Backend Running!`);
    console.log(`📚 Knowledge Base Loaded: ${Object.keys(KNOWLEDGE_BASE).length} Topics`);
    console.log(`🌐 http://localhost:${port}\n`);
});
