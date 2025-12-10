// Mobile Menu Toggle
function toggleMenu() {
    const navMenu = document.getElementById('navMenu');
    navMenu.classList.toggle('active');
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const navMenu = document.getElementById('navMenu');
    if (navMenu && !event.target.closest('.navbar')) {
        navMenu.classList.remove('active');
    }
});

// Quiz functionality
function checkAnswer(element, isCorrect, explanationId) {
    // Remove previous selections in this question
    const options = element.parentElement.querySelectorAll('.quiz-option');
    options.forEach(opt => {
        opt.classList.remove('selected', 'correct', 'incorrect');
    });

    // Mark the selected option
    element.classList.add('selected');
    if (isCorrect) {
        element.classList.add('correct');
        // Show explanation
        const explanation = document.getElementById(explanationId);
        if (explanation) {
            explanation.classList.add('show');
        }
    } else {
        element.classList.add('incorrect');
    }
}

// Toggle answer visibility
function toggleAnswer(answerId) {
    const answer = document.getElementById(answerId);
    if (answer) {
        answer.classList.toggle('revealed');
    }
}

// Toggle section collapse
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const content = section.querySelector('.topic-content');
        const icon = section.querySelector('.toggle-icon');

        if (content) content.classList.toggle('collapsed');
        if (icon) icon.classList.toggle('collapsed');
    }
}

// Progress tracking
function updateProgress() {
    const allCheckboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
    const checkedBoxes = document.querySelectorAll('.checklist input[type="checkbox"]:checked');

    if (allCheckboxes.length > 0) {
        const progress = (checkedBoxes.length / allCheckboxes.length) * 100;
        const progressBar = document.getElementById('progressBar');

        if (progressBar) {
            progressBar.style.width = progress + '%';
            progressBar.textContent = Math.round(progress) + '%';
        }
    }

    // Update checkbox parent styling
    allCheckboxes.forEach(checkbox => {
        const li = checkbox.closest('li');
        if (li) {
            if (checkbox.checked) {
                li.classList.add('checked');
            } else {
                li.classList.remove('checked');
            }
        }
    });

    // Save progress to localStorage
    saveProgress();
}

// Save progress to localStorage
function saveProgress() {
    const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
    const progress = {};
    const pageName = window.location.pathname.split('/').pop() || 'index.html';

    checkboxes.forEach((checkbox, index) => {
        progress[index] = checkbox.checked;
    });

    localStorage.setItem('studyProgress_' + pageName, JSON.stringify(progress));
}

// Load progress from localStorage
function loadProgress() {
    const pageName = window.location.pathname.split('/').pop() || 'index.html';
    const saved = localStorage.getItem('studyProgress_' + pageName);

    if (saved) {
        const progress = JSON.parse(saved);
        const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');

        checkboxes.forEach((checkbox, index) => {
            if (progress[index]) {
                checkbox.checked = true;
            }
        });

        updateProgress();
    }
}

// Reset progress
function resetProgress() {
    if (confirm('Are you sure you want to reset all progress on this page?')) {
        const pageName = window.location.pathname.split('/').pop() || 'index.html';
        localStorage.removeItem('studyProgress_' + pageName);

        const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        updateProgress();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadProgress();

    // Add change listeners to all checkboxes
    const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateProgress);
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Press 'r' to reset (when not in input field)
    if (e.key === 'r' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        resetProgress();
    }
});
