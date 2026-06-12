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

// ============================================
// Currently Learning — Scroll Animations
// ============================================
function initCurrentlyLearning() {
    // Animate SVG ring
    const ringFill = document.querySelector('.cl-ring-fill');
    if (ringFill) {
        const progress = parseFloat(ringFill.getAttribute('data-progress')) || 0;
        const circumference = 264; // 2 * π * r(42)
        const offset = circumference - (progress / 100) * circumference;

        const ringObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    ringFill.style.strokeDashoffset = offset;
                    ringObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        const spotlightEl = document.querySelector('.cl-spotlight');
        if (spotlightEl) ringObserver.observe(spotlightEl);
    }

    // Animate topic fill bars on scroll into view
    const badgeEls = document.querySelectorAll('.cl-topic-badge');
    if (badgeEls.length) {
        const barObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const fill = entry.target.querySelector('.cl-topic-fill');
                    if (fill) fill.style.width = fill.getAttribute('data-width');
                    barObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        badgeEls.forEach(badge => barObserver.observe(badge));
    }
}

window.addEventListener('load', initCurrentlyLearning);

// ============================================================
//  LeetCode Analytics Section — Vanilla JS
//  Fetches live data via the /api/leetcode proxy on the server
// ============================================================

const LC_USER = 'brs9Vhbczx';

// ── GraphQL query helpers ────────────────────────────────────
async function lcQuery(query, variables = {}) {
    const res = await fetch('/api/leetcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables })
    });
    if (!res.ok) throw new Error(`Proxy error ${res.status}`);
    const json = await res.json();
    if (json.errors) throw new Error(json.errors[0].message);
    return json.data;
}

const PROFILE_QUERY = `
  query userPublicProfile($username: String!) {
    matchedUser(username: $username) {
      username
      profile { ranking userAvatar realName countryName school }
      submitStats: submitStatsGlobal {
        acSubmissionNum { difficulty count submissions }
      }
      badges { id displayName icon }
      activeBadge { displayName }
    }
    allQuestionsCount { difficulty count }
  }`;

const CONTEST_QUERY = `
  query userContestRankingInfo($username: String!) {
    userContestRanking(username: $username) {
      attendedContestsCount rating globalRanking topPercentage
    }
  }`;

const SUBS_QUERY = `
  query recentAcSubmissions($username: String!, $limit: Int!) {
    recentAcSubmissionList(username: $username, limit: $limit) {
      id title titleSlug timestamp lang
    }
  }`;

const CALENDAR_QUERY = `
  query userProfileCalendar($username: String!) {
    matchedUser(username: $username) {
      userCalendar { streak totalActiveDays submissionCalendar }
    }
  }`;

// ── Helpers ──────────────────────────────────────────────────
function lcEl(id) { return document.getElementById(id); }

function lcTimeAgo(ts) {
    const diff = Date.now() / 1000 - parseInt(ts);
    if (diff < 60)    return 'just now';
    if (diff < 3600)  return `${Math.floor(diff/60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff/86400)}d ago`;
    return new Date(ts * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const LANG_COLORS = {
    python3: '#3B82F6', python: '#3B82F6',
    java: '#F97316', cpp: '#A855F7', c: '#6B7280',
    javascript: '#EAB308', typescript: '#60A5FA',
    rust: '#EF4444', golang: '#22D3EE', kotlin: '#7C3AED'
};
const LANG_LABELS = { python3: 'Py3', python: 'Py', java: 'Java', cpp: 'C++', javascript: 'JS', typescript: 'TS', rust: 'Rust', golang: 'Go', c: 'C', kotlin: 'Kotlin' };

// ── Donut SVG helper ─────────────────────────────────────────
function setDonutSegment(elId, fraction, dashOffset, color) {
    const el = lcEl(elId);
    if (!el) return;
    const C = 2 * Math.PI * 42;   // circumference
    el.style.strokeDasharray  = `${fraction * C} ${C}`;
    el.style.strokeDashoffset = dashOffset;
    el.style.stroke = color;
}

// ── Heatmap builder ────────────────────────────────────────────
function buildHeatmap(calObj) {
    const container = lcEl('lcHeatmap');
    if (!container) return;

    // ── Step 1: Convert every calObj timestamp → "YYYY-MM-DD" key ──
    // LeetCode stores Unix timestamps (seconds). Converting via new Date()
    // and using LOCAL date methods gives us stable day strings regardless
    // of the server's timezone vs. the viewer's timezone.
    const dateCount = {};
    for (const [tsStr, cnt] of Object.entries(calObj)) {
        const d = new Date(parseInt(tsStr, 10) * 1000);
        const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        dateCount[key] = (dateCount[key] || 0) + cnt;
    }

    // ── Step 2: Build the grid ──────────────────────────────────
    const isDark = document.body.classList.contains('dark-theme');
    // Light = GitHub palette; Dark = dark-green GitHub palette
    const COLORS = isDark
        ? ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353']
        : ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'];

    const today = new Date();
    // Start from 52 weeks ago, aligned to Sunday
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 7 * 52);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const CELL = 13, GAP = 3;
    let html = `<div style="display:flex;gap:${GAP}px;">`;

    for (let w = 0; w < 53; w++) {
        html += `<div style="display:flex;flex-direction:column;gap:${GAP}px;">`;
        for (let d = 0; d < 7; d++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + w * 7 + d);

            if (date > today) {
                html += `<div style="width:${CELL}px;height:${CELL}px;"></div>`;
                continue;
            }

            // ── Step 3: Match using local "YYYY-MM-DD" key ─────
            const key = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
            const count = dateCount[key] || 0;

            // Pick intensity bucket
            let bg;
            if      (count === 0) bg = COLORS[0];
            else if (count <= 2)  bg = COLORS[1];
            else if (count <= 5)  bg = COLORS[2];
            else if (count <= 9)  bg = COLORS[3];
            else                  bg = COLORS[4];

            const label = `${count} submission${count !== 1 ? 's' : ''} on ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
            html += `<div class="lc-heatmap-cell" title="${label}" data-count="${count}" data-date="${key}" style="width:${CELL}px;height:${CELL}px;background:${bg};border-radius:3px;cursor:pointer;"></div>`;
        }
        html += '</div>';
    }

    html += '</div>';
    container.innerHTML = html;
}

// ── Progress bar + donut renderer ────────────────────────────
function renderProgress(solved, totals) {
    const easy   = solved.easy,   easyT   = totals.easy;
    const medium = solved.medium, mediumT = totals.medium;
    const hard   = solved.hard,   hardT   = totals.hard;
    const total  = solved.all;
    const C = 2 * Math.PI * 42;

    // Donut: stacked segments
    const easyF   = easyT   > 0 ? easy   / totals.all : 0;
    const mediumF = mediumT > 0 ? medium / totals.all : 0;
    const hardF   = hardT   > 0 ? hard   / totals.all : 0;

    const easyLen   = easyF   * C;
    const mediumLen = mediumF * C;
    const hardLen   = hardF   * C;

    // Easy at top (offset = 0)
    const easyEl = lcEl('lcDonutEasy');
    if (easyEl) {
        easyEl.style.strokeDasharray  = `${easyLen} ${C}`;
        easyEl.style.strokeDashoffset = 0;
        easyEl.style.stroke = '#00B8A3';
    }
    // Medium after easy
    const medEl = lcEl('lcDonutMedium');
    if (medEl) {
        medEl.style.strokeDasharray  = `${mediumLen} ${C}`;
        medEl.style.strokeDashoffset = -easyLen;
        medEl.style.stroke = '#FFB800';
    }
    // Hard after medium
    const hardEl = lcEl('lcDonutHard');
    if (hardEl) {
        hardEl.style.strokeDasharray  = `${hardLen} ${C}`;
        hardEl.style.strokeDashoffset = -(easyLen + mediumLen);
        hardEl.style.stroke = '#EF4743';
    }

    lcEl('lcTotalSolved').textContent = total;
    lcEl('lcEasySolved').textContent  = easy;
    lcEl('lcEasyTotal').textContent   = `/${easyT}`;
    lcEl('lcMediumSolved').textContent = medium;
    lcEl('lcMediumTotal').textContent  = `/${mediumT}`;
    lcEl('lcHardSolved').textContent  = hard;
    lcEl('lcHardTotal').textContent   = `/${hardT}`;

    // Animated progress bars (delayed)
    requestAnimationFrame(() => {
        setTimeout(() => {
            const ePct = easyT > 0 ? ((easy/easyT)*100).toFixed(1) : 0;
            const mPct = mediumT > 0 ? ((medium/mediumT)*100).toFixed(1) : 0;
            const hPct = hardT > 0 ? ((hard/hardT)*100).toFixed(1) : 0;

            lcEl('lcEasyBar').style.width   = ePct + '%';
            lcEl('lcMediumBar').style.width = mPct + '%';
            lcEl('lcHardBar').style.width   = hPct + '%';
            lcEl('lcEasyPct').textContent   = ePct + '%';
            lcEl('lcMediumPct').textContent = mPct + '%';
            lcEl('lcHardPct').textContent   = hPct + '%';
        }, 300);
    });
}

// ── Submissions renderer ──────────────────────────────────────
function renderSubmissions(subs) {
    const list = lcEl('lcSubmissionsList');
    if (!list || !subs.length) return;
    list.innerHTML = subs.map((s, i) => {
        const lang = s.lang?.toLowerCase() || '';
        const color = LANG_COLORS[lang] || '#6B7280';
        const label = LANG_LABELS[lang] || lang;
        return `
        <div class="lc-sub-row">
            <span class="lc-sub-num">${i+1}</span>
            <a href="https://leetcode.com/problems/${s.titleSlug}/" target="_blank" class="lc-sub-title">${s.title}</a>
            <span class="lc-sub-lang" style="background:${color}22;color:${color};border-color:${color}44">${label}</span>
            <span class="lc-sub-time">${lcTimeAgo(s.timestamp)}</span>
        </div>`;
    }).join('');
}

// ── Badges renderer ───────────────────────────────────────────
function renderBadges(badges, activeBadge) {
    if (!badges || badges.length === 0) return;
    const grid = lcEl('lcBadgesGrid');
    const card = lcEl('lcBadgesCard');
    const count = lcEl('lcBadgeCount');
    if (!grid || !card) return;

    count.textContent = badges.length;
    grid.innerHTML = badges.map(b => {
        const isActive = activeBadge?.displayName === b.displayName;
        // Shorten "LeetCoding Challenge" to fit nicely
        const shortName = b.displayName
            .replace('LeetCoding Challenge', 'Challenge')
            .replace('LeetCode', 'LC');
        return `
        <div class="lc-badge-item${isActive ? ' active' : ''}" title="${b.displayName}">
            <div class="lc-badge-icon-wrap">
                ${b.icon ? `<img src="${b.icon}" alt="${b.displayName}" class="lc-badge-img" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="lc-badge-emoji" style="display:none">🏅</div>` : '<div class="lc-badge-emoji">🏅</div>'}
            </div>
            <div class="lc-badge-info">
                <span class="lc-badge-name">${shortName}</span>
                ${isActive ? '<span class="lc-badge-active-pill">Active</span>' : ''}
            </div>
        </div>`;
    }).join('');
    card.style.display = 'block';
}

// ── Show / hide error ─────────────────────────────────────────
function showLcError(msg) {
    const err = lcEl('lcError');
    if (err) { lcEl('lcErrorMsg').textContent = msg; err.style.display = 'flex'; }
}
function hideLcError() {
    const err = lcEl('lcError');
    if (err) err.style.display = 'none';
}

// ── Render LeetCode Dashboard UI from data object ──────────────
function renderLeetCodeUI(data) {
    // ── Profile ──────────────────────────────────────────
    if (data.profile && data.profile.matchedUser) {
        const u = data.profile.matchedUser;
        const p = u.profile;

        // Avatar
        const avatarEl  = lcEl('lcAvatar');
        const fallbackEl = lcEl('lcAvatarFallback');
        if (p.userAvatar && avatarEl) {
            avatarEl.src = p.userAvatar;
            avatarEl.style.display = 'block';
            if (fallbackEl) fallbackEl.style.display = 'none';
        }

        // Name / country / school
        if (p.realName)   lcEl('lcRealName').textContent = p.realName;
        if (p.countryName) lcEl('lcCountry').innerHTML = `<i class="ph ph-map-pin"></i> ${p.countryName}`;
        if (p.school) {
            lcEl('lcSchoolName').textContent = p.school;
            lcEl('lcSchool').style.display = 'inline-flex';
        }
        if (p.ranking && p.ranking < 9999999) {
            lcEl('lcGlobalRank').textContent = '#' + p.ranking.toLocaleString();
        }

        // Solved stats
        const stats = u.submitStats.acSubmissionNum;
        const allQ  = data.profile.allQuestionsCount;
        const toMap  = (arr) => Object.fromEntries(arr.map(s => [s.difficulty, s.count]));
        const solved = toMap(stats);
        const totals = toMap(allQ);

        const solvedAll = solved.All || 0;
        renderProgress(
            { all: solvedAll, easy: solved.Easy || 0, medium: solved.Medium || 0, hard: solved.Hard || 0 },
            { all: totals.All || 0, easy: totals.Easy || 0, medium: totals.Medium || 0, hard: totals.Hard || 0 }
        );

        // Update home page DSA stats counter
        const dsaCounter = document.querySelector('.stats-grid .stat-card:first-child .counter');
        if (dsaCounter) {
            dsaCounter.setAttribute('data-target', solvedAll);
            if (dsaCounter.textContent !== '0') {
                dsaCounter.textContent = solvedAll + '+';
            }
        }

        // Acceptance rate
        const allEntry = stats.find(s => s.difficulty === 'All');
        if (allEntry && allEntry.submissions > 0) {
            lcEl('lcAcceptRate').textContent = ((allEntry.count / allEntry.submissions) * 100).toFixed(1) + '%';
        }

        // Badges
        renderBadges(u.badges, u.activeBadge);
    }

    // ── Contest ───────────────────────────────────────────
    if (data.contest && data.contest.userContestRanking) {
        const cr = data.contest.userContestRanking;
        if (cr.rating)                lcEl('lcContestRating').textContent = Math.round(cr.rating);
        if (cr.attendedContestsCount) lcEl('lcContests').textContent = cr.attendedContestsCount;
        if (cr.topPercentage)         lcEl('lcTopPct').textContent = cr.topPercentage.toFixed(1) + '%';
    }

    // ── Recent submissions ─────────────────────────────────
    if (data.submissions && data.submissions.recentAcSubmissionList) {
        renderSubmissions(data.submissions.recentAcSubmissionList);
    }

    // ── Calendar / heatmap ─────────────────────────────────
    if (data.calendar && data.calendar.matchedUser && data.calendar.matchedUser.userCalendar) {
        const cal = data.calendar.matchedUser.userCalendar;
        if (cal.streak)         lcEl('lcStreak').textContent = cal.streak + ' days';
        if (cal.totalActiveDays) lcEl('lcActiveDays').textContent = cal.totalActiveDays;

        let calObj = {};
        try { calObj = JSON.parse(cal.submissionCalendar); } catch {}
        buildHeatmap(calObj);
        updateHeatmapLegend(document.body.classList.contains('dark-theme'));
    }
}

// ── Load cached LeetCode data from localStorage ────────────────
function loadCachedLeetCodeData() {
    try {
        const cached = localStorage.getItem('leetcode_dashboard_cache');
        if (cached) {
            const dataObj = JSON.parse(cached);
            renderLeetCodeUI(dataObj);
        }
    } catch (e) {
        console.error('Error loading cached LeetCode data:', e);
    }
}

// ── Main fetch & render function ─────────────────────────────
async function initLeetCodeSection() {
    hideLcError();

    const refreshBtn  = lcEl('lcRefreshBtn');
    const refreshIcon = lcEl('lcRefreshIcon');
    if (refreshBtn) refreshBtn.disabled = true;
    if (refreshIcon) refreshIcon.classList.add('ph-spin');

    try {
        // Fire all requests in parallel
        const [profileRes, contestRes, subsRes, calRes] = await Promise.allSettled([
            lcQuery(PROFILE_QUERY,  { username: LC_USER }),
            lcQuery(CONTEST_QUERY,  { username: LC_USER }),
            lcQuery(SUBS_QUERY,     { username: LC_USER, limit: 15 }),
            lcQuery(CALENDAR_QUERY, { username: LC_USER })
        ]);

        if (profileRes.status === 'fulfilled' && profileRes.value?.matchedUser) {
            const dataObj = {
                profile: profileRes.value,
                contest: contestRes.status === 'fulfilled' && contestRes.value?.userContestRanking ? contestRes.value : null,
                submissions: subsRes.status === 'fulfilled' ? subsRes.value : null,
                calendar: calRes.status === 'fulfilled' && calRes.value?.matchedUser?.userCalendar ? calRes.value : null
            };

            // Render fresh data to UI
            renderLeetCodeUI(dataObj);

            // Store in cache
            localStorage.setItem('leetcode_dashboard_cache', JSON.stringify(dataObj));
        } else {
            showLcError(profileRes.reason?.message || 'Could not load profile.');
        }

    } catch (err) {
        console.error('LeetCode section error:', err);
        showLcError(err.message || 'Unexpected error loading LeetCode data.');
    } finally {
        if (refreshBtn) refreshBtn.disabled = false;
        if (refreshIcon) refreshIcon.classList.remove('ph-spin');
    }
}

// ── Wire up Refresh button & auto-load on section scroll ──────
document.addEventListener('DOMContentLoaded', () => {
    // 1. Try to load cached data instantly
    loadCachedLeetCodeData();

    const refreshBtn = lcEl('lcRefreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', initLeetCodeSection);
    }

    // Auto-fetch when #leetcode section scrolls into view (once)
    const lcSection = document.getElementById('leetcode');
    if (lcSection) {
        let loaded = false;
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !loaded) {
                loaded = true;
                initLeetCodeSection();
                observer.disconnect();
            }
        }, { threshold: 0.1 });
        observer.observe(lcSection);
    }

    // Re-render heatmap when theme toggles (colors are theme-specific)
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            // Wait one tick for the class to be applied, then rebuild
            setTimeout(() => {
                const heatmapEl = lcEl('lcHeatmap');
                if (heatmapEl && heatmapEl.innerHTML.trim() !== '') {
                    // Parse existing calendar data from the cells and rebuild
                    const cells = heatmapEl.querySelectorAll('.lc-heatmap-cell');
                    if (cells.length > 0) {
                        const isDark = document.body.classList.contains('dark-theme');
                        const COLORS = isDark
                            ? ['#1e2235', '#0e4429', '#006d32', '#26a641', '#39d353']
                            : ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'];
                        cells.forEach(cell => {
                            const count = parseInt(cell.dataset.count || '0');
                            let bg;
                            if      (count === 0)  bg = COLORS[0];
                            else if (count <= 2)   bg = COLORS[1];
                            else if (count <= 5)   bg = COLORS[2];
                            else if (count <= 9)   bg = COLORS[3];
                            else                   bg = COLORS[4];
                            cell.style.background = bg;
                        });
                        // Also update legend colors
                        updateHeatmapLegend(isDark);
                    }
                }
            }, 50);
        });
    }
});

// ── Update heatmap legend colors ─────────────────────────────
function updateHeatmapLegend(isDark) {
    const cells = document.querySelectorAll('.lc-legend-cell');
    const DARK  = ['#1e2235', '#0e4429', '#006d32', '#26a641', '#39d353'];
    const LIGHT = ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'];
    const colors = isDark ? DARK : LIGHT;
    cells.forEach((cell, i) => { if (colors[i]) cell.style.background = colors[i]; });
}


