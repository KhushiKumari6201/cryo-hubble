const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON requests
app.use(express.json());

// Serve static files from current directory
app.use(express.static(__dirname));

// Smart local fallback responder (runs when ANTHROPIC_API_KEY is not set)
function matchFallbackResponse(msg) {
    const text = msg.toLowerCase().trim();
    
    if (/\b(hi|hello|hey|greetings|good morning|good afternoon)\b/.test(text)) {
        return "Hello there! I'm Khushi's AI assistant. Ask me anything about her skills, projects, availability, or contact information!";
    }
    
    if (/\b(skill|skills|tech|stack|languages|react|javascript|java|mongodb|mysql)\b/.test(text)) {
        return "Khushi is skilled in full-stack development. Her core tech stack includes **React & JavaScript**, **Node.js/Express**, and **Java Development**. She also works with MongoDB, MySQL, Git/GitHub, Docker, and Postman. Check out the 'Technical Skills' section for more detail!";
    }
    
    if (/\b(project|projects|built|make|prescripto|ecommerce|fresh mart|freshmart)\b/.test(text)) {
        return "Khushi has built three major projects:\n1. **Doctor Appointment Booking System (Prescripto)**: A healthcare platform built with React, Node.js, MongoDB, and Tailwind CSS.\n2. **E-commerce Website**: A storefront built with Next.js, Redux, Tailwind CSS, and Stripe.\n3. **Fresh Mart**: An organic grocery delivery tracking app built with React and Firebase.\n\nAll of these feature clean code and are linked to their GitHub repos in the 'My Projects' section above!";
    }
    
    if (/\b(avail|available|hire|hiring|intern|internship|job|role|work)\b/.test(text)) {
        return "Yes, Khushi is currently in her 3rd year of Computer Science Engineering and is actively looking for remote or on-site **software engineering internships** and developer roles. Feel free to connect via the contact form at the bottom of the page!";
    }
    
    if (/\b(contact|email|mail|reach|connect|linkedin|github)\b/.test(text)) {
        return "You can reach out to Khushi through:\n- **Email**: khushikri.92637@gmail.com\n- **LinkedIn**: [linkedin.com/in/khushi-k-642b57323](https://linkedin.com/in/khushi-k-642b57323)\n- **GitHub**: [github.com/KhushiKumari6201](https://github.com/KhushiKumari6201)\n\nAlternatively, you can write a message in the 'Get In Touch' contact form on this page!";
    }
    
    if (/\b(resume|cv|download)\b/.test(text)) {
        return "You can download Khushi's resume directly by clicking the **'Resume'** button in the hero section at the top of the page!";
    }
    
    if (/\b(leetcode|dsa|algo|structure|problems)\b/.test(text)) {
        return "Khushi enjoys solving algorithmic challenges and has solved over 100+ Data Structures & Algorithms problems on LeetCode. You can view her profile here: [leetcode.com/u/brs9Vhbczx/](https://leetcode.com/u/brs9Vhbczx/)";
    }
    
    return "That's a great question! I'm currently running in Demo Mode (without an API key). I can answer questions about Khushi's skills, projects, availability, resume, or contact info. What would you like to ask?";
}

// POST endpoint for AI Chatbot
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    
    if (!message) {
        return res.status(400).json({ error: "Message is required." });
    }
    
    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
        // Run in Demo Mode using the smart fallback responder
        console.log("ANTHROPIC_API_KEY is not set. Running in Demo Mode.");
        const reply = matchFallbackResponse(message);
        // Simulate a tiny delay for a natural chat experience
        await new Promise(resolve => setTimeout(resolve, 800));
        return res.json({ reply, isDemo: true });
    }
    
    try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json"
            },
            body: JSON.stringify({
                model: "claude-3-5-sonnet-20241022",
                max_tokens: 300,
                system: "You are a professional, friendly AI assistant representing Khushi Kumari on her personal portfolio. Answer questions about her profile, skills, projects, education, and availability. Be extremely concise (maximum 3 sentences per reply). Do not make up facts. Details about Khushi: 3rd year Computer Science Engineering student. Skills: React, Node.js, Java, MySQL, MongoDB, Git. Projects: Doctor Booking (Prescripto), E-commerce Website, Fresh Mart. Contact: khushikri.92637@gmail.com, GitHub: KhushiKumari6201, LinkedIn: khushi-k-642b57323, LeetCode: brs9Vhbczx. Availability: Open for internships and remote dev roles. Always speak in first-person as her AI representative (e.g., 'Khushi is currently...'). Maintain a helpful and professional tone.",
                messages: [
                    { role: "user", content: message }
                ]
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Claude API Error Status:", response.status, errorText);
            throw new Error(`Anthropic API returned status ${response.status}`);
        }
        
        const data = await response.json();
        const reply = data.content && data.content[0] ? data.content[0].text : "I'm sorry, I couldn't generate a response.";
        return res.json({ reply, isDemo: false });
        
    } catch (err) {
        console.error("AI Chat Endpoint Error:", err);
        // Graceful degradation: Fall back to local helper if API fails
        const reply = matchFallbackResponse(message);
        return res.json({ reply, isDemo: true, error: true });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
