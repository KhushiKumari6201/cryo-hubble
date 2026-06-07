// Typing Animation Logic
const typingText = document.querySelector("#typing-text");
const phrases = ["a Web Developer", "a Java Programmer", "a Problem Solver"];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function type() {
    const currentPhrase = phrases[phraseIndex];
    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 50;
    } else {
        typingText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 150;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typeSpeed = 1500; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}

// Theme Toggle Logic
const themeToggle = document.querySelector("#themeToggle");
const themeIconWrapper = themeToggle.querySelector(".mode-icon-wrapper");
const body = document.body;

function updateThemeUI(isDark) {
    themeIconWrapper.innerHTML = isDark ? "🌞" : "🌙";
    body.classList.toggle("dark-theme", isDark);
}

themeToggle.addEventListener("click", () => {
    const isNowDark = !body.classList.contains("dark-theme");
    updateThemeUI(isNowDark);
    localStorage.setItem("portfolio-theme", isNowDark ? "dark" : "light");
});

// Load saved theme
const savedTheme = localStorage.getItem("portfolio-theme");
updateThemeUI(savedTheme === "dark");

// Mobile Menu Toggle
const navToggle = document.querySelector("#navToggle");
const mobileNav = document.querySelector("#mobileNav");
const mobileNavLinks = document.querySelectorAll(".mobile-nav-links a");
const navToggleIcon = navToggle.querySelector("i");

navToggle.addEventListener("click", () => {
    mobileNav.classList.toggle("active");
    if (mobileNav.classList.contains("active")) {
        navToggleIcon.classList.replace("ph-list", "ph-x");
    } else {
        navToggleIcon.classList.replace("ph-x", "ph-list");
    }
});

mobileNavLinks.forEach(link => {
    link.addEventListener("click", () => {
        mobileNav.classList.remove("active");
        navToggleIcon.classList.replace("ph-x", "ph-list");
    });
});

// Sticky Navbar
const navbar = document.querySelector("#navbar");
window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        navbar.classList.add("sticky");
    } else {
        navbar.classList.remove("sticky");
    }
});

// Dynamic Projects
const filterBtns = document.querySelectorAll(".filter-btn");

// Extreme 3D Card Effect
function init3DEffect() {
    document.addEventListener("mousemove", (e) => {
        const cards = document.querySelectorAll(".project-card, .stat-card, .profile-container");
        const x = e.clientX;
        const y = e.clientY;

        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const cardX = rect.left + rect.width / 2;
            const cardY = rect.top + rect.height / 2;

            const angleX = (cardY - y) / 15; // Increased sensitivity
            const angleY = (x - cardX) / 15;

            if (Math.abs(angleX) < 20 && Math.abs(angleY) < 20) {
                card.style.transform = `perspective(1200px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(10px)`;
                card.style.borderColor = "var(--primary)";
            } else {
                card.style.transform = "";
                card.style.borderColor = "";
            }
        });

        // 3D Cube Follow-Mouse nudge
        const cube = document.querySelector(".cube");
        if(cube) {
            const cubeX = (window.innerWidth / 2 - x) / 50;
            const cubeY = (window.innerHeight / 2 - y) / 50;
            cube.style.transform = `rotateX(${cubeY}deg) rotateY(${cubeX}deg)`;
        }
        
        // Mouse Glow Global
        const mouseGlow = document.querySelector(".mouse-glow");
        if(mouseGlow) {
            mouseGlow.style.left = x + "px";
            mouseGlow.style.top = y + "px";
        }
    });
}

async function fetchProjects() {
    try {
        const response = await fetch("projects.json");
        const projects = await response.json();
        
        displayProjects(projects);
        
        filterBtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                const filter = e.target.getAttribute("data-filter");
                filterBtns.forEach(b => b.classList.remove("active"));
                e.target.classList.add("active");
                
                if (filter === "all") {
                    displayProjects(projects);
                } else {
                    const filtered = projects.filter(p => p.category === filter);
                    displayProjects(filtered);
                }
            });
        });
    } catch (err) {
        console.error("Error fetching projects:", err);
    }
}

function displayProjects(projects) {
    projectsGrid.innerHTML = projects.map(project => `
        <div class="project-card reveal">
            <div class="project-img">
                <img src="${project.image}" alt="${project.name}">
            </div>
            <div class="project-info">
                <div class="project-tags">
                    ${project.tech.map(t => `<span class="project-tag">${t}</span>`).join('')}
                </div>
                <h4>${project.name}</h4>
                <p>${project.description}</p>
                <div class="project-features" style="margin-bottom: 1.5rem;">
                    <ul style="font-size: 0.9rem; color: var(--text-muted); list-style: circle; padding-left: 1.2rem;">
                        ${project.features.map(f => `<li>${f}</li>`).join('')}
                    </ul>
                </div>
                <div class="project-links">
                    <a href="${project.github}" target="_blank" title="GitHub Source"><i class="ph ph-github-logo"></i></a>
                    <a href="${project.live}" target="_blank" title="Live Preview"><i class="ph ph-arrow-square-out"></i></a>
                </div>
            </div>
        </div>
    `).join('');
}

// Stats Counter Animation
const counters = document.querySelectorAll('.counter');
const speed = 200;

function animateCounters() {
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target + "+";
            }
        };
        updateCount();
    });
}

// Scroll Reveal
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2000,
    delay: 200,
    reset: false // Keep revealed elements visible
});

sr.reveal('.hero-text, .hero-image', { origin: 'bottom', interval: 200 });
sr.reveal('.about-image-side, .about-content', { origin: 'left', interval: 200 });
sr.reveal('.skills-column', { origin: 'bottom', interval: 200 });
sr.reveal('.section-header', { interval: 100 });
sr.reveal('.stat-card', { 
    interval: 100,
    afterReveal: (el) => {
        // Trigger counter animation once stat card is revealed
        const countEl = el.querySelector('.counter');
        if(countEl && countEl.innerText === "0") {
            animateCounters();
        }
    }
});

// Loader
window.addEventListener("load", () => {
    const loader = document.querySelector(".loader-wrapper");
    loader.style.opacity = "0";
    setTimeout(() => {
        loader.style.display = "none";
        type();
        fetchProjects();
        init3DEffect();
        initAIChatbot();
    }, 500);
});

// Form Submission (Simulated)
document.querySelector("#contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = e.target.querySelector("button");
    const originalText = btn.innerHTML;
    btn.innerHTML = "Sending... <i class='ph ph-spinner-gap ph-spin'></i>";
    
    setTimeout(() => {
        alert("Message sent successfully! (Demo Mode)");
        e.target.reset();
        btn.innerHTML = originalText;
    }, 1500);
});

// Shard Generator
function createShards() {
    const container = document.querySelector(".bg-shards");
    if(!container) return;
    
    for(let i = 0; i < 20; i++) {
        const shard = document.createElement("div");
        shard.className = "shard";
        shard.style.left = Math.random() * 100 + "vw";
        shard.style.animationDelay = Math.random() * 5 + "s";
        shard.style.opacity = Math.random() * 0.3;
        container.appendChild(shard);
    }
}
createShards();


// Live GitHub Data Fetching
async function fetchGitHubData() {
    try {
        const username = "KhushiKumari6201";
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        const repos = await reposRes.json();
        const container = document.querySelector("#github-repos");
        
        if (container && Array.isArray(repos)) {
            container.innerHTML = repos.map(repo => `
                <div class="github-card reveal">
                    <div class="repo-header">
                        <i class="ph ph-git-repository"></i>
                        <h5>${repo.name}</h5>
                    </div>
                    <p>${repo.description || "Live repository on GitHub."}</p>
                    <div class="repo-meta">
                        <span><i class="ph ph-star"></i> ${repo.stargazers_count}</span>
                        <span><i class="ph ph-git-fork"></i> ${repo.forks_count}</span>
                        <span><i class="ph ph-code"></i> ${repo.language || "Mixed"}</span>
                    </div>
                    <a href="${repo.html_url}" target="_blank" class="repo-link">View Repo <i class="ph ph-arrow-right"></i></a>
                </div>
            `).join("");
        }
    } catch (e) { console.error("GitHub Fetch Error:", e); }
}
fetchGitHubData();


// Global Pop Click Animation
document.addEventListener("click", (e) => {
    // Add pop-click class to target element or its closest interactive parent
    const target = e.target.closest("button, a, .stat-card, .project-card, .tool-tag");
    if(target) {
        target.classList.add("pop-click");
        setTimeout(() => target.classList.remove("pop-click"), 200);
    }
    
    // Sparkle effect at mouse position
    const sparkle = document.createElement("div");
    sparkle.className = "click-sparkle";
    sparkle.style.left = e.clientX + "px";
    sparkle.style.top = e.clientY + "px";
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 500);
});


// Text-specific Pop Click
document.addEventListener("click", (e) => {
    const textTarget = e.target.closest("h1, h2, h3, h4, p, span, li");
    if(textTarget && !textTarget.classList.contains("pop-click")) {
        textTarget.classList.add("pop-click");
        setTimeout(() => textTarget.classList.remove("pop-click"), 200);
    }
});


// AI Chatbot Client Side Logic
function initAIChatbot() {
    const chatbot = document.querySelector("#ai-chatbot");
    const toggleBtn = document.querySelector("#chat-toggle-btn");
    const closeBtn = document.querySelector("#chat-close-btn");
    const chatWindow = document.querySelector("#chat-window");
    const chatForm = document.querySelector("#chat-form");
    const chatInput = document.querySelector("#chat-input");
    const chatMessages = document.querySelector("#chat-messages");
    const suggestBtns = document.querySelectorAll(".suggest-btn");

    if (!chatbot || !toggleBtn || !chatWindow) return;

    // Toggle Chat Window
    toggleBtn.addEventListener("click", () => {
        chatWindow.classList.toggle("active");
        
        // Hide badge on click
        const badge = toggleBtn.querySelector(".chat-badge");
        if (badge) badge.style.display = "none";
        
        // Auto scroll to bottom when opened
        if (chatWindow.classList.contains("active")) {
            setTimeout(scrollToBottom, 300);
            chatInput.focus();
        }
    });

    closeBtn.addEventListener("click", () => {
        chatWindow.classList.remove("active");
    });

    // Auto-scroll helper
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Append Message Helper
    function appendMessage(sender, text) {
        const msgDiv = document.createElement("div");
        msgDiv.className = `message ${sender === "user" ? "user-msg" : "bot-msg"}`;
        
        // Simple markdown links support (replaces [text](url) with HTML link)
        const formattedText = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="text-decoration: underline; color: inherit; font-weight: 700;">$1</a>');
        msgDiv.innerHTML = formattedText;
        
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    // Show/Hide Typing Indicator
    function setTypingIndicator(show) {
        const existing = chatMessages.querySelector(".typing-indicator");
        if (show) {
            if (!existing) {
                const indicator = document.createElement("div");
                indicator.className = "typing-indicator";
                indicator.innerHTML = `
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                `;
                chatMessages.appendChild(indicator);
                scrollToBottom();
            }
        } else {
            if (existing) {
                existing.remove();
            }
        }
    }

    // Handle sending a message
    async function sendMessage(text) {
        const userMsg = text.trim();
        if (!userMsg) return;

        // Add user message
        appendMessage("user", userMsg);
        chatInput.value = "";
        
        // Show typing indicator
        setTypingIndicator(true);

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ message: userMsg })
            });

            if (!response.ok) {
                throw new Error("Chat request failed");
            }

            const data = await response.json();
            setTypingIndicator(false);
            appendMessage("bot", data.reply);

        } catch (error) {
            console.error("Chat Error:", error);
            setTypingIndicator(false);
            appendMessage("bot", "Oops! I ran into an error connecting to the server. Please try again in a moment.");
        }
    }

    // Handle Form Submit
    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        sendMessage(chatInput.value);
    });

    // Handle Quick Suggestions
    suggestBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const query = btn.getAttribute("data-query");
            if (query) {
                sendMessage(query);
            }
        });
    });
}

