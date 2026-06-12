require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
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

const SYSTEM_PROMPT = `You are a professional, friendly AI representative for Khushi Kumari on her personal portfolio.
Your sole purpose is to answer questions about Khushi's profile, skills, projects, education, and availability using only the information provided below.

STRICT RULES:
1. ONLY answer questions related to Khushi Kumari, her skills, projects, contact info, education, and professional availability.
2. If the user asks about general knowledge, programming/coding problems, writing scripts, math, history, or any topic unrelated to Khushi Kumari, you MUST politely decline. For example: "I am only authorized to answer questions about Khushi's professional portfolio and background. Please feel free to ask about her projects, skills, or availability!"
3. If the user asks to get in touch, hire Khushi, collaborate, or needs her help with a project, welcome them and direct them to use the contact form at the bottom of the page or email her directly at khushikri.92637@gmail.com.
4. Do not make up facts or assumptions. If a question about Khushi cannot be answered using the details below, say "I don't have that information, but you can reach out to Khushi directly via the contact form or email."
5. Be extremely concise (maximum 3 sentences per reply).
6. Always speak in third-person relative to Khushi (e.g., 'Khushi is currently...', 'She has built...'). Maintain a helpful and professional tone.

PORTFOLIO DETAILS:
- Name: Khushi Kumari
- Role: Web Developer, Java Programmer, Full Stack Developer, Problem Solver
- Status: 3rd year Computer Science Engineering student (B.Tech). Open for internships and remote software development roles.
- Skills: React & JavaScript, Backend (Node.js/Express), Java Development, Data Structures & Algorithms, Git & GitHub, VS Code, Postman, Docker, MySQL, MongoDB.
- Projects:
  1. Doctor Appointment Booking System (Prescripto): React, Node.js, MongoDB, Tailwind CSS. (Features: Provider Search, Slot Booking, Appointment History). GitHub: https://github.com/KhushiKumari6201/prescripto-full-stack
  2. E-commerce Website: Next.js, Tailwind CSS, Redux, Stripe. (Features: Product Dashboard, Cart System, User Auth). GitHub: https://github.com/KhushiKumari6201/E-Commerce-Elevate-
  3. Fresh Mart: Organic grocery delivery tracking. React, Firebase, Context API, CSS Modules. (Features: Inventory Sync, Dynamic Search, Rating System). GitHub: https://github.com/KhushiKumari6201/FreshMart
- DSA Stats: Solved over 100+ problems on LeetCode (Profile: https://leetcode.com/u/brs9Vhbczx/).
- GitHub Profile: https://github.com/KhushiKumari6201 (50+ contributions)
- Blogs: "How I learned Java" and "My first project mistakes".
- Contact: Email (khushikri.92637@gmail.com), LinkedIn (linkedin.com/in/khushi-k-642b57323), or the portfolio's contact form.
- Resume: Downloadable at assets/resume.pdf.`;

// POST endpoint for AI Chatbot
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    
    if (!message) {
        return res.status(400).json({ error: "Message is required." });
    }
    
    const openrouterKey = process.env.OPENROUTER_API_KEY;
    const openrouterModel = process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash';
    const geminiKey = process.env.GEMINI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    
    if (!openrouterKey && !geminiKey && !anthropicKey) {
        // Run in Demo Mode using the smart fallback responder
        console.log("No API key (OpenRouter, Gemini or Anthropic) is set. Running in Demo Mode.");
        const reply = matchFallbackResponse(message);
        // Simulate a tiny delay for a natural chat experience
        await new Promise(resolve => setTimeout(resolve, 800));
        return res.json({ reply, isDemo: true });
    }
    
    try {
        if (openrouterKey) {
            // Call OpenRouter API
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${openrouterKey}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "Khushi Kumari Portfolio"
                },
                body: JSON.stringify({
                    model: openrouterModel,
                    messages: [
                        { role: "system", content: SYSTEM_PROMPT },
                        { role: "user", content: message }
                    ],
                    max_tokens: 300,
                    temperature: 0.5
                })
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error("OpenRouter API Error Status:", response.status, errorText);
                throw new Error(`OpenRouter API returned status ${response.status}`);
            }
            
            const data = await response.json();
            const reply = data.choices && data.choices[0] && data.choices[0].message
                ? data.choices[0].message.content
                : "I'm sorry, I couldn't generate a response.";
            return res.json({ reply, isDemo: false });
        } else if (geminiKey) {
            // Call Gemini API
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: "user",
                            parts: [{ text: message }]
                        }
                    ],
                    systemInstruction: {
                        parts: [{ text: SYSTEM_PROMPT }]
                    },
                    generationConfig: {
                        maxOutputTokens: 300,
                        temperature: 0.5
                    }
                })
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Gemini API Error Status:", response.status, errorText);
                throw new Error(`Gemini API returned status ${response.status}`);
            }
            
            const data = await response.json();
            const reply = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]
                ? data.candidates[0].content.parts[0].text
                : "I'm sorry, I couldn't generate a response.";
            return res.json({ reply, isDemo: false });
        } else {
            // Call Anthropic Claude API
            const response = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                    "x-api-key": anthropicKey,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    model: "claude-3-5-sonnet-20241022",
                    max_tokens: 300,
                    system: SYSTEM_PROMPT,
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
        }
        
    } catch (err) {
        console.error("AI Chat Endpoint Error:", err);
        // Graceful degradation: Fall back to local helper if API fails
        const reply = matchFallbackResponse(message);
        return res.json({ reply, isDemo: true, error: true });
    }
});

// ── LeetCode GraphQL Proxy with File Cache ──────────────────────
const CACHE_FILE = path.join(__dirname, 'leetcode_cache.json');

function readCache() {
    try {
        if (fs.existsSync(CACHE_FILE)) {
            return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
        }
    } catch (e) {
        console.error('Error reading LeetCode cache file:', e.message);
    }
    return {};
}

function writeCache(cache) {
    try {
        fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf8');
    } catch (e) {
        console.error('Error writing LeetCode cache file:', e.message);
    }
}

app.post('/api/leetcode', async (req, res) => {
    const { query, variables } = req.body;
    if (!query) return res.status(400).json({ error: 'Query required.' });

    // Identify query to cache
    let cacheKey = null;
    if (query.includes('userPublicProfile')) cacheKey = 'profile';
    else if (query.includes('userContestRankingInfo')) cacheKey = 'contest';
    else if (query.includes('recentAcSubmissions')) cacheKey = 'submissions';
    else if (query.includes('userProfileCalendar')) cacheKey = 'calendar';

    try {
        const response = await fetch('https://leetcode.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
                'Referer': 'https://leetcode.com/',
                'Origin': 'https://leetcode.com'
            },
            body: JSON.stringify({ query, variables })
        });

        if (!response.ok) {
            const text = await response.text();
            console.warn(`LeetCode API returned status ${response.status}. Attempting server cache fallback.`);
            
            if (cacheKey) {
                const cache = readCache();
                if (cache[cacheKey]) {
                    return res.json({ data: cache[cacheKey] });
                }
            }
            return res.status(response.status).json({ error: `LeetCode API returned ${response.status}`, details: text.slice(0, 200) });
        }

        const data = await response.json();

        // Update the server cache if fetch is successful
        if (cacheKey && data.data) {
            const cache = readCache();
            cache[cacheKey] = data.data;
            writeCache(cache);
        }

        return res.json(data);
    } catch (err) {
        console.error('LeetCode Proxy Error:', err.message);
        
        // Fall back to server cache on network/fetch failures
        if (cacheKey) {
            const cache = readCache();
            if (cache[cacheKey]) {
                return res.json({ data: cache[cacheKey] });
            }
        }
        return res.status(502).json({ error: 'Failed to reach LeetCode API.', details: err.message });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
