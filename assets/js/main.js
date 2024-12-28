// Navigation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links li');

// Hamburger menu animation
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
    
    // Animate nav items
    navItems.forEach((item, index) => {
        if (item.style.animation) {
            item.style.animation = '';
        } else {
            item.style.animation = `navItemFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
});

// Smooth scrolling for navigation links with enhanced animation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        // Close mobile menu if open
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }

        // Smooth scroll with callback
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        // Add highlight animation to the target section
        setTimeout(() => {
            target.classList.add('highlight');
            setTimeout(() => target.classList.remove('highlight'), 1000);
        }, 800);
    });
});

// Enhanced scroll animations with 3D effects
const animateOnScroll = () => {
    const elements = document.querySelectorAll(
        '.slide-in-left:not(.contact *), .slide-in-right:not(.contact *), .scale-in:not(.contact *), .rotate-in:not(.contact *), .clip-in:not(.contact *), .skill-tags span, .project-card'
    );

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const isVisible = (elementTop < window.innerHeight - 50) && (elementBottom > 0);

        if (isVisible && !element.classList.contains('animate')) {
            element.classList.add('animate');
            
            // Simpler animation for cards
            if (element.classList.contains('project-card')) {
                element.style.transform = 'translateY(15px)';
                setTimeout(() => {
                    element.style.transform = 'translateY(0)';
                }, 50);
            }
        }
    });
};

// Throttle function for better performance
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Add scroll event listener with throttling
window.addEventListener('scroll', throttle(animateOnScroll, 50));

// Active section highlighting with smooth transition
const sections = document.querySelectorAll('section');
const navLi = document.querySelectorAll('.nav-links li');

window.addEventListener('scroll', throttle(() => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navLi.forEach(li => {
        li.classList.remove('active');
        if (li.querySelector('a').getAttribute('href') === `#${current}`) {
            li.classList.add('active');
        }
    });
}, 100));

// Dynamic text animation in hero section
function initDynamicText() {
    const phrases = [
        "I'm a Full Stack Developer",
        "I Build Modern Websites",
        "I Create Digital Experiences",
        "I Love Coding"
    ];
    const dynamicText = document.querySelector('.dynamic-text');
    let currentPhrase = 0;

    function typePhrase(phrase) {
        let i = 0;
        dynamicText.textContent = '';
        
        function type() {
            if (i < phrase.length) {
                dynamicText.textContent += phrase.charAt(i);
                i++;
                setTimeout(type, Math.random() * 100 + 50);
            } else {
                setTimeout(deletePhrase, 2000);
            }
        }
        
        type();
    }

    function deletePhrase() {
        let phrase = dynamicText.textContent;
        
        function deleteLetter() {
            if (phrase.length > 0) {
                phrase = phrase.slice(0, -1);
                dynamicText.textContent = phrase;
                setTimeout(deleteLetter, Math.random() * 50 + 25);
            } else {
                currentPhrase = (currentPhrase + 1) % phrases.length;
                typePhrase(phrases[currentPhrase]);
            }
        }
        
        deleteLetter();
    }

    typePhrase(phrases[0]);
}

// Enhanced GitHub Projects Integration with specific projects
async function fetchGitHubProjects() {
    try {
        const username = 'wermisek';
        const projectsGrid = document.querySelector('.projects-grid');
        
        if (!projectsGrid) {
            console.error('Projects grid element not found');
            return;
        }

        projectsGrid.innerHTML = `
            <div class="loading-message">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading projects...</p>
            </div>
        `;

        // List of pinned repository names
        const pinnedRepos = [
            'Watchiru',
            'HelpDeskFlutter',
            'StocksPredictor',
            'SpotifyCloneFlutter',
            'Kalkulator',
            'PythonDrawing'
        ];

        // Fetch all repositories
        const response = await fetch(`https://api.github.com/users/${username}/repos`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            throw new Error(`GitHub API responded with status ${response.status}`);
        }

        const allProjects = await response.json();

        // Filter only pinned repositories
        const pinnedProjects = allProjects.filter(project => 
            pinnedRepos.includes(project.name)
        );

        if (pinnedProjects.length === 0) {
            projectsGrid.innerHTML = `
                <div class="message">
                    <i class="fas fa-info-circle"></i>
                    <p>No projects found.</p>
                </div>
            `;
            return;
        }

        projectsGrid.innerHTML = '';

        // Function to determine project type based on repository description and name
        function determineProjectType(project) {
            const name = project.name.toLowerCase();
            const description = (project.description || '').toLowerCase();
            
            // Specific project categorization
            if (name === 'helpdesk' || name === 'helpdeskflutter' || name.includes('helpdesk')) {
                return 'desktop';
            }
            if (name === 'kalkulator' || name.includes('kalkulator')) {
                return 'mobile';
            }
            if (name === 'password-generator' || name.includes('generator')) {
                return 'script';
            }
            
            // Get category from description
            if (description.includes('[desktop]')) {
                return 'desktop';
            }
            if (description.includes('[mobile]')) {
                return 'mobile';
            }
            if (description.includes('[script]')) {
                return 'script';
            }
            if (description.includes('[web]')) {
                return 'web';
            }
            
            // Default categorization based on technologies
            if (name.includes('flutter')) {
                return 'mobile';
            }
            if (project.language === 'JavaScript' || project.language === 'HTML') {
                return 'web';
            }
            
            // Default to other if no category found
            return 'other';
        }

        // Sort projects to match the pinned order
        const sortedProjects = pinnedProjects.sort((a, b) => {
            return pinnedRepos.indexOf(a.name) - pinnedRepos.indexOf(b.name);
        });

        sortedProjects.forEach((project, index) => {
            try {
                const type = determineProjectType(project);
                const projectCard = createProjectCard(project, type);
                if (projectCard) {
                    projectCard.style.transitionDelay = `${index * 0.1}s`;
                projectsGrid.appendChild(projectCard);
                    setTimeout(() => projectCard.classList.add('animate'), 100);
                }
            } catch (cardError) {
                console.error('Error creating project card:', cardError);
            }
        });

    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        const projectsGrid = document.querySelector('.projects-grid');
        if (projectsGrid) {
            projectsGrid.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>Failed to load projects. Please try again later.</p>
                    <p class="error-details">${error.message}</p>
                </div>
            `;
        }
    }
}

// Enhanced project card creation with error handling
function createProjectCard(project, type) {
    try {
    const card = document.createElement('div');
    card.className = 'project-card';
        card.dataset.type = type;
        
        // Get project language if available
        const language = project.language || 'Not specified';
        
        // Get type label with all categories
        const typeLabel = {
            'web': 'Web App',
            'mobile': 'Mobile App',
            'desktop': 'Desktop App',
            'script': 'Script',
            'other': 'Other'
        }[type] || type;
        
        // Clean description by removing category tag
        const cleanDescription = (project.description || 'No description available')
            .replace(/\[(desktop|mobile|script|web)\]/i, '')
            .trim();

        // Special handling for Watchiru project
        const homepageUrl = project.name === 'Watchiru' 
            ? 'https://watchiru.vercel.app'
            : project.homepage;
    
    card.innerHTML = `
            <div class="project-header">
                <i class="far ${getIconForType(type)}"></i>
        <div class="project-links">
                    ${homepageUrl ? 
                        `<a href="${homepageUrl}" 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            class="project-link live-demo" 
                            title="View Live Demo">
                            <i class="fas fa-external-link-alt"></i>
                            <span class="tooltip">View Live Demo</span>
                        </a>` : ''
                    }
                    <a href="${project.html_url}" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        class="project-link github" 
                        title="View Source Code">
                        <i class="fab fa-github"></i>
                        <span class="tooltip">View Source Code</span>
                    </a>
                </div>
            </div>
            <div class="project-content">
                <h3>${project.name}</h3>
                <p>${cleanDescription}</p>
                <div class="project-tech">
                    <span class="tech-badge primary">${language}</span>
                </div>
                <div class="project-type">
                    <span class="type-badge ${type}">${typeLabel}</span>
                </div>
        </div>
    `;

    return card;
    } catch (error) {
        console.error('Error creating project card:', error);
        return null;
    }
}

// Helper function to get appropriate icon for project type
function getIconForType(type) {
    const icons = {
        'web': 'fa-globe',
        'mobile': 'fa-mobile-alt',
        'desktop': 'fa-desktop',
        'script': 'fa-code',
        'other': 'fa-folder'
    };
    return icons[type] || 'fa-folder';
}

// Smooth scroll with progress indicator
function initSmoothScroll() {
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-progress';
    document.body.appendChild(scrollIndicator);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollIndicator.style.width = scrolled + '%';
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Show about section content immediately
    const aboutContent = document.querySelector('.about-content');
    if (aboutContent) {
        aboutContent.style.opacity = '1';
        aboutContent.style.transform = 'none';
        
        // Make all about section children visible
        aboutContent.querySelectorAll('*').forEach(element => {
            element.style.opacity = '1';
            element.style.transform = 'none';
            element.style.visibility = 'visible';
        });
    }

    // Initialize features (removed initProjectFilters)
    initDynamicText();
    initSmoothScroll();
    fetchGitHubProjects();
    
    // Show contact section immediately
    const contactSection = document.querySelector('.contact');
    if (contactSection) {
        contactSection.style.opacity = '1';
        contactSection.style.transform = 'none';
    }
    
    // Add scroll animations for other sections
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.closest('.about-content')) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll:not(.about-content *)').forEach(el => {
        animateOnScroll.observe(el);
    });

    updateSkillTags();
});

// Contact Form with enhanced validation and feedback
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalBtnText = submitBtn.innerHTML;
    const nameInput = contactForm.querySelector('input[type="text"]');
    const emailInput = contactForm.querySelector('input[type="email"]');
    const messageInput = contactForm.querySelector('textarea');
    
    // Basic validation
    if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
        showFormError('Please fill in all fields');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
        showFormError('Please enter a valid email address');
        return;
    }

    // Animate button
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');

    try {
        // Prepare form data
        const formData = {
            name: nameInput.value,
            email: emailInput.value,
            message: messageInput.value
        };

        // Here you would typically send the data to your server
        // For now, we'll simulate a successful submission
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Success feedback
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';
        submitBtn.classList.remove('loading');
        submitBtn.classList.add('success');

        // Add success state to form fields
        [nameInput, emailInput, messageInput].forEach(input => {
            input.classList.add('success');
            input.style.borderColor = 'var(--primary-color)';
        });

        // Show success message
        showFormSuccess('Message sent successfully! I\'ll get back to you soon.');

        // Reset form after delay
        setTimeout(() => {
    contactForm.reset();
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('success');
            [nameInput, emailInput, messageInput].forEach(input => {
                input.classList.remove('success');
                input.style.borderColor = '';
            });
        }, 3000);

    } catch (error) {
        console.error('Form submission error:', error);
        submitBtn.innerHTML = '<i class="fas fa-times"></i> Error';
        submitBtn.classList.remove('loading');
        submitBtn.classList.add('error');
        
        showFormError('Something went wrong. Please try again.');

        setTimeout(() => {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            submitBtn.classList.remove('error');
        }, 3000);
    }
});

// Form feedback functions
function showFormError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-feedback error';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    removeExistingFeedback();
    contactForm.insertBefore(errorDiv, contactForm.firstChild);
    
    setTimeout(() => errorDiv.remove(), 5000);
}

function showFormSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'form-feedback success';
    successDiv.innerHTML = `<i class="fas fa-check-circle"></i> Thanks! ${message}`;
    
    removeExistingFeedback();
    contactForm.insertBefore(successDiv, contactForm.firstChild);
    
    setTimeout(() => {
        successDiv.style.opacity = '0';
        setTimeout(() => successDiv.remove(), 300);
    }, 4000);
}

function removeExistingFeedback() {
    const existingFeedback = contactForm.querySelector('.form-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
}

// Add real-time validation
function addFormValidation() {
    const inputs = contactForm.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            validateInput(input);
        });

        input.addEventListener('blur', () => {
            validateInput(input);
        });
    });
}

function validateInput(input) {
    const value = input.value.trim();
    
    if (input.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            input.classList.add('error');
            input.classList.remove('success');
        } else {
            input.classList.add('success');
            input.classList.remove('error');
        }
    } else {
        if (!value) {
            input.classList.add('error');
            input.classList.remove('success');
        } else {
            input.classList.add('success');
            input.classList.remove('error');
        }
    }
}

// Initialize form validation
addFormValidation();

// Enhanced form animations
function addFormAnimations() {
    const form = document.getElementById('contact-form');
    const inputs = form.querySelectorAll('input, textarea');

    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });
}

// Initialize with enhanced animations
document.addEventListener('DOMContentLoaded', () => {
    // Make contact section visible immediately
    const contactSection = document.querySelector('.contact');
    if (contactSection) {
        contactSection.style.opacity = '1';
        contactSection.style.transform = 'none';
        
        // Make all contact section children visible
        contactSection.querySelectorAll('*').forEach(element => {
            element.style.opacity = '1';
            element.style.transform = 'none';
        });
    }

    // Add mouse parallax effect
    addMouseParallax();
    
    // Add form animations
    addFormAnimations();
    
    // Initialize other features
    setTimeout(animateOnScroll, 200);
    setTimeout(fetchGitHubProjects, 400);
    
    // More natural typing
    const heroTitle = document.querySelector('.hero-content .post-title');
    setTimeout(() => {
        typeWriter(heroTitle, "I create websites with passion", 50);
    }, 600);
    
    // Add parallax scroll effect
    window.addEventListener('scroll', throttle(() => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');
        
        if (scrolled < window.innerHeight) {
            heroContent.style.transform = `
                perspective(1000px)
                translateY(${scrolled * 0.4}px)
                rotateX(${scrolled * 0.02}deg)
            `;
            hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
        }
    }, 50));
});

// Typing animation for hero section
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            // Add random delay to make typing feel more human
            const randomDelay = Math.random() * 50 + speed;
            setTimeout(type, randomDelay);
        }
    }
    
    type();
}

// Add mouse parallax effect
function addMouseParallax() {
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    const layers = document.querySelectorAll('.hero-content > *');

    hero.addEventListener('mousemove', (e) => {
        const { offsetWidth: width, offsetHeight: height } = hero;
        const { clientX: x, clientY: y } = e;
        
        const xPos = (x / width - 0.5) * 2; // -1 to 1
        const yPos = (y / height - 0.5) * 2; // -1 to 1

        // Move hero content
        heroContent.style.transform = `
            rotateY(${xPos * 5}deg)
            rotateX(${-yPos * 5}deg)
            translateZ(10px)
        `;

        // Move layers with different intensities
        layers.forEach((layer, i) => {
            const intensity = (i + 1) * 15;
            layer.style.transform = `
                translate3d(${xPos * intensity}px, ${yPos * intensity}px, 0)
            `;
        });
    });

    // Reset on mouse leave
    hero.addEventListener('mouseleave', () => {
        heroContent.style.transform = 'none';
        layers.forEach(layer => {
            layer.style.transform = 'none';
        });
    });
}

// Update the skill tags in the about section
function updateSkillTags() {
    const skillTags = document.querySelector('.skill-tags');
    if (!skillTags) return;

    const skills = [
        'JavaScript',
        'TypeScript',
        'HTML5',
        'CSS3',
        'Python',
        'C#',
        'C++',
        'Flutter',
        'Dart',
        'Java'
    ];

    skillTags.innerHTML = skills.map(skill => `
        <span>${skill}</span>
    `).join('');
} 