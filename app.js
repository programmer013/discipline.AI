const API_KEY = ""; // keep your key here

const conversationHistory = [];

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

    // Add user message to history
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
temperature: 0.7,
max_tokens: 500,
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
            
            // Add AI response to history
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
        console.error("Error:", error);
    }

    chatBox.scrollTop = chatBox.scrollHeight;
}

document.getElementById("userInput").addEventListener("keypress", function(e) {
    if (e.key === "Enter") sendMessage();
});