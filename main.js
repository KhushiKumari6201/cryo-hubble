// Typing Animation Logic
const typingText = document.querySelector("#typing-text");
const phrases = ["a Full Stack Developer", "a Problem Solver", "a System Designer", "a Creative Thinker"];
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

// Dark Mode Toggle
const themeToggle = document.querySelector("#themeToggle");
const body = document.body;
const icon = themeToggle.querySelector("i");

themeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-theme");
    if (body.classList.contains("dark-theme")) {
        icon.classList.replace("ph-sun", "ph-moon");
        localStorage.setItem("theme", "dark");
    } else {
        icon.classList.replace("ph-moon", "ph-sun");
        localStorage.setItem("theme", "light");
    }
});

// Load saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "light") {
    body.classList.remove("dark-theme");
    icon.classList.replace("ph-moon", "ph-sun");
}

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
const projectsGrid = document.querySelector("#projectsGrid");
const filterBtns = document.querySelectorAll(".filter-btn");

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
