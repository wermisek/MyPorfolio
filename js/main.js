// Navigation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// GitHub Projects Integration
async function fetchGitHubProjects() {
    try {
        const username = 'wermisek';
        const response = await fetch(`https://api.github.com/users/${username}/repos`);
        const projects = await response.json();

        const projectsGrid = document.querySelector('.projects-grid');
        projectsGrid.innerHTML = ''; // Clear existing content

        projects.forEach(project => {
            if (!project.fork) { // Only show non-forked projects
                const projectCard = createProjectCard(project);
                projectsGrid.appendChild(projectCard);
            }
        });
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
    }
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    card.innerHTML = `
        <h3>${project.name}</h3>
        <p>${project.description || 'No description available'}</p>
        <div class="project-links">
            <a href="${project.html_url}" target="_blank" rel="noopener noreferrer">
                <i class="fab fa-github"></i> View on GitHub
            </a>
            ${project.homepage ? `
                <a href="${project.homepage}" target="_blank" rel="noopener noreferrer">
                    <i class="fas fa-external-link-alt"></i> Live Demo
                </a>
            ` : ''}
        </div>
    `;

    return card;
}

// Contact Form
const contactForm = document.getElementById('contact-form');
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const formProps = Object.fromEntries(formData);
    
    // Add your form submission logic here
    // For now, we'll just log the data
    console.log('Form submitted:', formProps);
    
    // Clear form
    contactForm.reset();
    alert('Thank you for your message! I will get back to you soon.');
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchGitHubProjects();
});

// Add scroll-based animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, {
    threshold: 0.1
});

// Observe all sections
document.querySelectorAll('section').forEach((section) => {
    observer.observe(section);
}); 