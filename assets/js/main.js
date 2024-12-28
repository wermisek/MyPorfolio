// Initialize all animations and interactions
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileNav();
    initSmoothScroll();
    initSkillBars();
    initScrollAnimations();
    initContactForm();
    fetchGitHubProjects();
});

// Theme Switcher
function initTheme() {
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Set initial theme
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        updateThemeIcon(currentTheme);
        } else {
        const theme = prefersDarkScheme.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        updateThemeIcon(theme);
    }
    
    // Theme toggle click handler
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-toggle i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Mobile Navigation
function initMobileNav() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mainContent = document.querySelector('.main-content');
    
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mobileNav.classList.toggle('expanded');
        mainContent.classList.toggle('nav-open');
    });
}

// Smooth Scrolling
function initSmoothScroll() {
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
            if (target) {
                const mobileNav = document.querySelector('.mobile-nav');
                const menuToggle = document.querySelector('.menu-toggle');
                
                // Close mobile nav if open
                if (mobileNav.classList.contains('expanded')) {
                    mobileNav.classList.remove('expanded');
                    menuToggle.classList.remove('active');
                }
                
                // Smooth scroll to target
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
}

// Skill Bars Animation
function initSkillBars() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    skillItems.forEach(item => {
        const level = item.getAttribute('data-level');
        const bar = item.querySelector('.skill-bar');
        bar.style.setProperty('--level', level);
    });
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements
    const elements = document.querySelectorAll('.fade-in, .slide-in, .scale-in');
    elements.forEach(el => observer.observe(el));
}

// Contact Form
function initContactForm() {
    const form = document.querySelector('.contact-form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
            submitBtn.classList.add('success');
            form.reset();
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.classList.remove('success');
                submitBtn.disabled = false;
            }, 3000);
            
        } catch (error) {
            // Show error message
            submitBtn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error';
            submitBtn.classList.add('error');
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.classList.remove('error');
                submitBtn.disabled = false;
            }, 3000);
        }
    });
}

// Fetch GitHub Projects
async function fetchGitHubProjects() {
    const username = 'wermisek';
    const projectsGrid = document.querySelector('.work-grid');
    
    // Define the desired project order
    const projectOrder = [
        'Watchiru',
        'HelpDeskFlutter',
        'StocksPredictor',
        'SpotifyCloneFlutter',
        'Kalkulator'
    ];
    
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        const repos = await response.json();
        
        // Clear loading state
        projectsGrid.innerHTML = '';
        
        // Filter and map repositories
        let projects = repos
            .filter(repo => !repo.fork) // Exclude forked repositories
            .map(repo => ({
                title: repo.name,
                description: repo.description || getDefaultDescription(repo.name),
                image: `https://opengraph.githubassets.com/1/${username}/${repo.name}`,
                technologies: [repo.language].filter(Boolean),
                liveLink: repo.homepage || repo.html_url,
                githubLink: repo.html_url,
                stars: repo.stargazers_count,
                forks: repo.forks_count
            }));
        
        // Sort projects according to the specified order
        projects.sort((a, b) => {
            const indexA = projectOrder.indexOf(a.title);
            const indexB = projectOrder.indexOf(b.title);
            
            // If both projects are in the order list, sort by their position
            if (indexA !== -1 && indexB !== -1) {
                return indexA - indexB;
            }
            // If only one project is in the order list, prioritize it
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            // For projects not in the order list, keep their original order
            return 0;
        });
        
        // Take only the first 5 projects
        projects = projects.slice(0, 5);
        
        // Create and append project cards
        projects.forEach(project => {
            const card = createProjectCard(project);
            projectsGrid.appendChild(card);
        });

        // Add GitHub profile button
        const githubButton = document.createElement('a');
        githubButton.href = `https://github.com/${username}`;
        githubButton.target = '_blank';
        githubButton.className = 'github-profile-btn';
        githubButton.innerHTML = `
            <i class="fab fa-github"></i>
            <span>View More on GitHub</span>
        `;
        projectsGrid.insertAdjacentElement('afterend', githubButton);
        
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        projectsGrid.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Failed to load projects. Please try again later.</p>
            </div>
        `;
    }
}

// Helper function to get default descriptions for specific projects
function getDefaultDescription(projectName) {
    const descriptions = {
        'Watchiru': '[web] A modern anime streaming platform featuring a sleek dark-themed interface, responsive video player, and advanced search capabilities. Built with HTML5, CSS3, and Vanilla JavaScript.',
        'HelpDeskFlutter': '[desktop] A Windows help desk application for managing school IT issues, featuring user-friendly interface for teachers to report problems and admin panel for ticket management. Built with Flutter.',
        'SpotifyCloneFlutter': '[mobile] A Spotify-inspired mobile music player built with Flutter, featuring a sleek dark interface, music playback controls, and playlist management. Cross-platform compatibility for iOS and Android.',
        'Kalkulator': '[mobile] A sleek calculator app built with Flutter and Dart, featuring basic arithmetic operations and a modern interface. Cross-platform support for iOS and Android.',
        'StocksPredictor': '[web] An AI-powered stock price prediction web application that uses machine learning and technical analysis to forecast market trends. Built with Python, Streamlit, and advanced ML algorithms for real-time stock data analysis and visualization.'
    };
    
    return descriptions[projectName] || 'A GitHub project';
}

// Create Project Card
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card fade-in';
    
    card.innerHTML = `
        <div class="project-image">
            <img src="${project.image}" alt="${project.title}" loading="lazy">
            <div class="project-overlay">
                <div class="project-stats">
                    <span><i class="fas fa-star"></i> ${project.stars}</span>
                    <span><i class="fas fa-code-branch"></i> ${project.forks}</span>
                </div>
                </div>
            </div>
            <div class="project-content">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
                <div class="project-tech">
                ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            <div class="project-links">
                <a href="${project.liveLink}" target="_blank" class="project-link" aria-label="View Live Project">
                    <i class="fas fa-external-link-alt"></i>
                </a>
                <a href="${project.githubLink}" target="_blank" class="project-link" aria-label="View GitHub Repository">
                    <i class="fab fa-github"></i>
                </a>
                </div>
        </div>
    `;

    return card;
}

// Add scroll-based parallax effect
    window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax');
    
    parallaxElements.forEach(el => {
        const speed = el.dataset.speed || 0.5;
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add cursor effect
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.cursor');
    if (!cursor) return;
    
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    // Add hover effect for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
        });
    });