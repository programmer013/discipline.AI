let API_KEY = "";
const conversationHistory = [];

function saveApiKey() {
    const keyInput = document.getElementById("apiKeyInput").value.trim();
    if (!keyInput) {
        alert("Please enter your API key!!");
        return;
    }
    API_KEY = keyInput;
    document.getElementById("apiScreen").style.display = "none";
    document.getElementById("chatScreen").style.display = "flex";
}

async function sendMessage() {
    const userInput = document.getElementById("userInput");
    const chatBox = document.getElementById("chatBox");
    
    const message = userInput.value.trim();
    if (!message) return;

    chatBox.innerHTML += `
        <div class="message user-message">${message}</div>
    `;
    userInput.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    chatBox.innerHTML += `
        <div class="message ai-message" id="typing">✨ Thinking...</div>
    `;

    conversationHistory.push({
        role: "user",
        content: message
    });

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: "You are DisciplineAI, a friendly assistant that helps students build study discipline. You help them create study schedules, stay motivated, avoid procrastination and build good habits. Keep responses short, friendly and motivating."
                    },
                    ...conversationHistory
                ]
            })
        });

        const data = await response.json();
        document.getElementById("typing").remove();

        if (data.choices && data.choices[0]) {
            const aiReply = data.choices[0].message.content;
            conversationHistory.push({
                role: "assistant",
                content: aiReply
            });
            chatBox.innerHTML += `
                <div class="message ai-message">${aiReply}</div>
            `;
        } else {
            chatBox.innerHTML += `
                <div class="message ai-message">❌ Error: ${JSON.stringify(data)}</div>
            `;
        }

    } catch (error) {
        document.getElementById("typing").remove();
        chatBox.innerHTML += `
            <div class="message ai-message">❌ Error: ${error.message}</div>
        `;
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}

document.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        if (document.getElementById("chatScreen").style.display !== "none") {
            sendMessage();
        } else {
            saveApiKey();
        }
    }
});