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
        const cards = document.querySelectorAll(".project-card, .stat-card, .profile-container, .certification-card, .achievement-card");
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

        // 3D Robot Head Follow-Mouse rotation
        const botHead = document.querySelector(".bot-3d-head");
        if (botHead) {
            const rect = botHead.getBoundingClientRect();
            const headX = rect.left + rect.width / 2;
            const headY = rect.top + rect.height / 2;
            
            const diffX = x - headX;
            const diffY = y - headY;
            
            const maxRotation = 22;
            const rotationX = Math.min(Math.max(-diffY / 12, -maxRotation), maxRotation);
            const rotationY = Math.min(Math.max(diffX / 12, -maxRotation), maxRotation);
            
            botHead.style.transform = `translateZ(15px) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
        }

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

// Fetch and Display Certifications
const certificationsGrid = document.querySelector("#certificationsGrid");

async function fetchCertifications() {
    try {
        const response = await fetch("certifications.json");
        const certifications = await response.json();
        displayCertifications(certifications);
    } catch (err) {
        console.error("Error fetching certifications:", err);
    }
}

function displayCertifications(certifications) {
    if (!certificationsGrid) return;
    
    certificationsGrid.innerHTML = certifications.map(cert => `
        <div class="certification-card reveal" data-cert-id="${cert.id}" data-cert-name="${cert.name}" data-cert-issuer="${cert.issuer}" data-cert-date="${cert.date}" data-cert-image="${cert.image}">
            <div class="cert-badge">${cert.icon}</div>
            <h4>${cert.name}</h4>
            <div class="certification-issuer">${cert.issuer}</div>
            <div class="certification-date">${cert.date}</div>
            <div class="certification-status">${cert.status}</div>
            <a href="#" class="certification-view">
                View Certificate <i class="ph ph-arrow-right"></i>
            </a>
        </div>
    `).join('');
    
    // Add click event listeners to all "View Certificate" buttons
    document.querySelectorAll('.certification-view').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const card = link.closest('.certification-card');
            const certName = card.getAttribute('data-cert-name');
            const certIssuer = card.getAttribute('data-cert-issuer');
            const certDate = card.getAttribute('data-cert-date');
            const certImage = card.getAttribute('data-cert-image');
            
            openCertificateModal(certImage, certName, certIssuer, certDate);
        });
    });
}

// Fetch and Display Achievements
const achievementsGrid = document.querySelector("#achievementsGrid");

async function fetchAchievements() {
    try {
        const response = await fetch("achievements.json");
        const achievements = await response.json();
        displayAchievements(achievements);
    } catch (err) {
        console.error("Error fetching achievements:", err);
    }
}

function displayAchievements(achievements) {
    if (!achievementsGrid) return;
    
    achievementsGrid.innerHTML = achievements.map(achievement => `
        <div class="achievement-card reveal">
            <div class="achievement-icon">${achievement.icon}</div>
            <h4>${achievement.name}</h4>
            <div class="achievement-category">${achievement.category}</div>
            <p class="achievement-description">${achievement.description}</p>
            <div class="achievement-detail">${achievement.detail}</div>
            <span class="achievement-badge">${achievement.badge}</span>
        </div>
    `).join('');
}

// Certificate Modal Functions
function openCertificateModal(imageSrc, title, issuer, date) {
    const modal = document.querySelector('#certificateModal');
    const modalTitle = document.querySelector('#certificateTitle');
    const modalIssuer = document.querySelector('#certificateIssuer');
    const modalDate = document.querySelector('#certificateDate');
    const downloadLink = document.querySelector('#certificateDownloadLink');
    const imageWrapper = document.querySelector('.certificate-modal-image-wrapper');

    modalTitle.textContent = title;
    modalIssuer.textContent = `Issued by: ${issuer}`;
    modalDate.textContent = `Date: ${date}`;

    // Reset wrapper
    imageWrapper.innerHTML = '';
    const img = document.createElement('img');
    img.alt = title;
    img.className = 'certificate-modal-image';
    img.style.display = 'none';
    imageWrapper.appendChild(img);

    // Hide download link initially
    downloadLink.style.display = 'none';
    // Remove any old click handlers
    const freshDownloadLink = downloadLink.cloneNode(true);
    downloadLink.parentNode.replaceChild(freshDownloadLink, downloadLink);
    const dlBtn = document.querySelector('#certificateDownloadLink');

    if (imageSrc && imageSrc.trim() !== '') {
        img.onload = function () {
            img.style.display = 'block';
            dlBtn.style.display = 'inline-flex';

            // Blob-based download — works reliably for same-origin files
            dlBtn.onclick = async function (e) {
                e.preventDefault();
                try {
                    dlBtn.innerHTML = 'Downloading... <i class="ph ph-spinner-gap ph-spin"></i>';
                    const response = await fetch(imageSrc);
                    const blob = await response.blob();
                    const blobUrl = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = blobUrl;
                    a.download = `${title}.png`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
                    dlBtn.innerHTML = 'Download Certificate <i class="ph ph-download-simple"></i>';
                } catch (err) {
                    console.error('Download failed:', err);
                    dlBtn.innerHTML = 'Download Certificate <i class="ph ph-download-simple"></i>';
                }
            };
        };
        img.onerror = function () {
            showUploadPrompt(imageWrapper);
        };
        img.src = imageSrc;
    } else {
        showUploadPrompt(imageWrapper);
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function showUploadPrompt(wrapper) {
    wrapper.style.minHeight = '300px';
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.justifyContent = 'center';
    wrapper.innerHTML = `<div style="text-align: center; color: var(--text-muted);">
        <p style="font-size: 3rem; margin-bottom: 1rem;">📤</p>
        <p style="font-size: 1.1rem; font-weight: 700;">Certificate image coming soon!</p>
        <p style="font-size: 0.9rem; margin-top: 0.5rem;">Upload your certificate using the upload area below.</p>
    </div>`;
}

function closeCertificateModal() {
    const modal = document.querySelector('#certificateModal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Add event listeners for certificate modal
document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.querySelector('#closeModal');
    const modalOverlay = document.querySelector('.certificate-modal-overlay');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeCertificateModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeCertificateModal);
    }
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCertificateModal();
        }
    });
});

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
sr.reveal('.certification-card, .achievement-card', { interval: 100 });
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
        fetchCertifications();
        fetchAchievements();
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
    const teaser = document.querySelector("#chat-teaser");
    const teaserClose = document.querySelector("#teaser-close-btn");

    if (!chatbot || !toggleBtn || !chatWindow) return;

    // Teaser Bubble Logic
    let teaserClosed = localStorage.getItem("chat-teaser-closed") === "true";
    
    if (teaser && !teaserClosed && !chatWindow.classList.contains("active")) {
        setTimeout(() => {
            if (!chatWindow.classList.contains("active") && !teaserClosed) {
                teaser.classList.add("active");
            }
        }, 2500);
    }

    if (teaserClose) {
        teaserClose.addEventListener("click", (e) => {
            e.stopPropagation();
            teaser.classList.remove("active");
            teaserClosed = true;
            localStorage.setItem("chat-teaser-closed", "true");
        });
    }

    if (teaser) {
        teaser.addEventListener("click", () => {
            teaser.classList.remove("active");
            chatWindow.classList.add("active");
            setTimeout(scrollToBottom, 300);
            chatInput.focus();
            const badge = toggleBtn.querySelector(".chat-badge");
            if (badge) badge.style.display = "none";
        });
    }

    // Toggle Chat Window
    toggleBtn.addEventListener("click", () => {
        chatWindow.classList.toggle("active");
        if (teaser) teaser.classList.remove("active");
        
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
        const msgWrapper = document.createElement("div");
        msgWrapper.className = `message-wrapper ${sender}-wrapper`;
        
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Simple markdown links support (replaces [text](url) with HTML link)
        const formattedText = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="text-decoration: underline; color: inherit; font-weight: 700;">$1</a>');
        
        if (sender === "bot") {
            msgWrapper.innerHTML = `
                <div class="chat-bot-avatar">
                    <img src="assets/profile.png" alt="AI Avatar">
                </div>
                <div class="message-content">
                    <div class="message bot-msg">${formattedText}</div>
                    <span class="message-time">${time}</span>
                </div>
            `;
        } else {
            msgWrapper.innerHTML = `
                <div class="message-content">
                    <div class="message user-msg">${formattedText}</div>
                    <span class="message-time">${time}</span>
                </div>
            `;
        }
        
        chatMessages.appendChild(msgWrapper);
        scrollToBottom();
    }

    // Show/Hide Typing Indicator
    function setTypingIndicator(show) {
        const existing = chatMessages.querySelector(".typing-indicator-wrapper");
        if (show) {
            if (!existing) {
                const indicator = document.createElement("div");
                indicator.className = "typing-indicator-wrapper";
                indicator.innerHTML = `
                    <div class="chat-bot-avatar">
                        <img src="assets/profile.png" alt="AI Avatar">
                    </div>
                    <div class="typing-indicator">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
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

