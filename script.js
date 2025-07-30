// Educational App JavaScript
class EducationalApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.currentSubject = null;
        this.progress = this.loadProgress();
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupMobileMenu();
        this.setupSubjectCards();
        this.setupProgressTracking();
        this.setupResourceButtons();
        this.updateProgressDisplay();
        this.addScrollEffects();
    }

    // Navigation Management
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.section');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetSection = link.getAttribute('href').substring(1);
                this.switchSection(targetSection);
                
                // Update active nav link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Close mobile menu if open
                this.closeMobileMenu();
            });
        });
    }

    switchSection(sectionId) {
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionId;
            
            // Add entrance animation
            targetSection.style.opacity = '0';
            targetSection.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                targetSection.style.transition = 'all 0.5s ease';
                targetSection.style.opacity = '1';
                targetSection.style.transform = 'translateY(0)';
            }, 50);
        }
    }

    // Mobile Menu Management
    setupMobileMenu() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                
                // Animate hamburger icon
                const icon = navToggle.querySelector('i');
                if (navMenu.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        }
    }

    closeMobileMenu() {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        if (navMenu && navToggle) {
            navMenu.classList.remove('active');
            const icon = navToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }

    // Subject Card Interactions
    setupSubjectCards() {
        const subjectCards = document.querySelectorAll('.subject-card');
        
        subjectCards.forEach(card => {
            card.addEventListener('click', () => {
                const subjectId = card.getAttribute('data-subject');
                this.switchToSubject(subjectId);
            });

            // Add hover effects
            card.addEventListener('mouseenter', () => {
                this.animateCard(card, 'enter');
            });

            card.addEventListener('mouseleave', () => {
                this.animateCard(card, 'leave');
            });
        });

        // Setup topic cards with click interactions
        const topicCards = document.querySelectorAll('.topic-card');
        topicCards.forEach(card => {
            card.addEventListener('click', () => {
                this.handleTopicClick(card);
            });
        });
    }

    switchToSubject(subjectId) {
        // Switch to subjects section
        this.switchSection('subjects');
        
        // Update navigation
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));
        document.querySelector('a[href="#subjects"]').classList.add('active');
        
        // Scroll to specific subject
        setTimeout(() => {
            const subjectElement = document.getElementById(subjectId);
            if (subjectElement) {
                subjectElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Highlight the subject temporarily
                this.highlightSubject(subjectElement);
            }
        }, 300);
    }

    highlightSubject(element) {
        element.style.background = 'rgba(102, 126, 234, 0.1)';
        element.style.transform = 'scale(1.02)';
        element.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            element.style.background = '';
            element.style.transform = '';
        }, 2000);
    }

    animateCard(card, type) {
        const icon = card.querySelector('i');
        if (type === 'enter') {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
            icon.style.transition = 'transform 0.3s ease';
        } else {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }
    }

    handleTopicClick(card) {
        // Toggle completed state
        card.classList.toggle('completed');
        
        // Update progress
        this.updateTopicProgress(card);
        
        // Visual feedback
        this.showCompletionFeedback(card);
    }

    updateTopicProgress(card) {
        const subjectDetail = card.closest('.subject-detail');
        const subjectId = subjectDetail.id;
        
        if (!this.progress[subjectId]) {
            this.progress[subjectId] = { completed: [], total: 0 };
        }
        
        const topicTitle = card.querySelector('h4').textContent;
        const isCompleted = card.classList.contains('completed');
        
        if (isCompleted && !this.progress[subjectId].completed.includes(topicTitle)) {
            this.progress[subjectId].completed.push(topicTitle);
        } else if (!isCompleted) {
            this.progress[subjectId].completed = this.progress[subjectId].completed.filter(
                topic => topic !== topicTitle
            );
        }
        
        // Update total count
        const totalTopics = subjectDetail.querySelectorAll('.topic-card').length;
        this.progress[subjectId].total = totalTopics;
        
        // Save progress
        this.saveProgress();
        this.updateProgressDisplay();
    }

    // Progress Management
    setupProgressTracking() {
        // Initialize progress for all subjects
        const subjects = ['mathematics', 'math-literacy', 'life-science', 'accounting', 'business-studies', 'history', 'economics'];
        
        subjects.forEach(subjectId => {
            if (!this.progress[subjectId]) {
                const subjectElement = document.getElementById(subjectId);
                if (subjectElement) {
                    const totalTopics = subjectElement.querySelectorAll('.topic-card').length;
                    this.progress[subjectId] = { completed: [], total: totalTopics };
                }
            }
        });
        
        this.saveProgress();
    }

    updateProgressDisplay() {
        // Update overall progress
        let totalCompleted = 0;
        let totalTopics = 0;
        
        Object.values(this.progress).forEach(subject => {
            totalCompleted += subject.completed.length;
            totalTopics += subject.total;
        });
        
        const overallPercentage = totalTopics > 0 ? Math.round((totalCompleted / totalTopics) * 100) : 0;
        
        // Update dashboard stats
        const completionStat = document.querySelector('.stat-card:last-child h3');
        if (completionStat) {
            completionStat.textContent = `${overallPercentage}%`;
        }
        
        // Update overall progress bar
        const overallProgressFill = document.querySelector('.progress-card .progress-fill');
        const overallProgressText = document.querySelector('.progress-card p');
        if (overallProgressFill && overallProgressText) {
            overallProgressFill.style.width = `${overallPercentage}%`;
            overallProgressText.textContent = `${overallPercentage}% Complete`;
        }
        
        // Update individual subject progress
        Object.keys(this.progress).forEach(subjectId => {
            const subject = this.progress[subjectId];
            const percentage = subject.total > 0 ? Math.round((subject.completed.length / subject.total) * 100) : 0;
            
            // Find corresponding progress item
            const progressItems = document.querySelectorAll('.progress-item');
            progressItems.forEach(item => {
                const subjectName = item.querySelector('.subject-name').textContent.toLowerCase();
                const mappedName = this.mapSubjectName(subjectName);
                
                if (mappedName === subjectId) {
                    const progressFill = item.querySelector('.progress-fill');
                    const progressPercent = item.querySelector('.progress-percent');
                    
                    if (progressFill && progressPercent) {
                        progressFill.style.width = `${percentage}%`;
                        progressPercent.textContent = `${percentage}%`;
                    }
                }
            });
        });
    }

    mapSubjectName(name) {
        const mapping = {
            'mathematics': 'mathematics',
            'mathematics literacy': 'math-literacy',
            'life science': 'life-science',
            'accounting': 'accounting',
            'business studies': 'business-studies',
            'history': 'history',
            'economics': 'economics'
        };
        return mapping[name] || name;
    }

    showCompletionFeedback(card) {
        const feedback = document.createElement('div');
        feedback.className = 'completion-feedback';
        feedback.innerHTML = card.classList.contains('completed') ? 
            '<i class="fas fa-check-circle"></i> Topic Completed!' : 
            '<i class="fas fa-undo"></i> Topic Unmarked';
        
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 1rem 2rem;
            border-radius: 25px;
            z-index: 10000;
            font-weight: 500;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            animation: feedbackPop 0.5s ease;
        `;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.style.opacity = '0';
            feedback.style.transform = 'translate(-50%, -50%) scale(0.8)';
            setTimeout(() => feedback.remove(), 300);
        }, 1500);
    }

    // Resource Button Interactions
    setupResourceButtons() {
        const resourceButtons = document.querySelectorAll('.resource-card .btn');
        
        resourceButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const resourceType = button.textContent.trim();
                this.handleResourceClick(resourceType, button);
            });
        });
    }

    handleResourceClick(resourceType, button) {
        // Show loading state
        const originalText = button.textContent;
        button.innerHTML = '<span class="loading"></span> Loading...';
        button.disabled = true;
        
        // Simulate resource loading
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
            
            // Show success message
            this.showNotification(`${resourceType} feature coming soon!`, 'info');
        }, 1500);
    }

    // Scroll Effects
    addScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe cards and sections
        const animatedElements = document.querySelectorAll('.stat-card, .subject-card, .topic-card, .resource-card, .progress-item');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // Utility Methods
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
            ${message}
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            z-index: 10000;
            font-weight: 500;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    loadProgress() {
        const saved = localStorage.getItem('caps-grade12-progress');
        return saved ? JSON.parse(saved) : {};
    }

    saveProgress() {
        localStorage.setItem('caps-grade12-progress', JSON.stringify(this.progress));
    }

    // Search functionality (placeholder for future enhancement)
    setupSearch() {
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search topics...';
        searchInput.className = 'search-input';
        
        // Add to header (future enhancement)
    }
}

// CSS Animations (injected dynamically)
const style = document.createElement('style');
style.textContent = `
    @keyframes feedbackPop {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
    
    @keyframes slideInRight {
        0% { transform: translateX(100%); }
        100% { transform: translateX(0); }
    }
    
    @keyframes slideOutRight {
        0% { transform: translateX(0); }
        100% { transform: translateX(100%); }
    }
    
    .topic-card.completed {
        background: linear-gradient(135deg, #e8f5e8, #d4edda) !important;
        border-left-color: #28a745 !important;
    }
    
    .topic-card.completed h4::before {
        content: '✅';
    }
    
    .search-input {
        padding: 0.5rem 1rem;
        border: 2px solid #667eea;
        border-radius: 25px;
        outline: none;
        font-size: 0.9rem;
        transition: all 0.3s ease;
    }
    
    .search-input:focus {
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
    }
`;
document.head.appendChild(style);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new EducationalApp();
    
    // Add welcome message
    setTimeout(() => {
        const app = new EducationalApp();
        app.showNotification('Welcome to your CAPS Grade 12 Learning Hub! 🎓', 'success');
    }, 1000);
});

// Handle window resize for responsive adjustments
window.addEventListener('resize', () => {
    const navMenu = document.getElementById('nav-menu');
    if (window.innerWidth > 768 && navMenu) {
        navMenu.classList.remove('active');
        const navToggle = document.getElementById('nav-toggle');
        if (navToggle) {
            const icon = navToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
});

// Service Worker Registration (for future PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Future PWA implementation
    });
}
