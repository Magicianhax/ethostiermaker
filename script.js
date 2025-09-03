class TierMaker {
    constructor() {
        this.draggedElement = null;
        this.deleteMode = false;
        this.scoreColors = {
            'untrusted': '#b72b38',
            'questionable': '#C29010', 
            'neutral': '#c1c0b6',
            'known': '#7C8DA8',
            'established': '#4E86B9',
            'reputable': '#2E7BC3',
            'exemplary': '#427B56',
            'distinguished': '#127f31',
            'revered': '#836DA6',
            'renowned': '#7A5EA0'
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupDragAndDrop();
    }

    setupEventListeners() {
        // Add Ethos user button
        const addEthosUserBtn = document.getElementById('addEthosUserBtn');
        const ethosUsernameInput = document.getElementById('ethosUsername');
        
        addEthosUserBtn.addEventListener('click', () => this.addEthosUser());
        
        // Allow adding Ethos user with Enter key
        ethosUsernameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addEthosUser();
            }
        });

        // Control buttons
        const toggleDeleteBtn = document.getElementById('toggleDelete');
        const clearAllBtn = document.getElementById('clearAll');
        const resetAllBtn = document.getElementById('resetAll');
        const shareBtn = document.getElementById('shareBtn');
        
        toggleDeleteBtn.addEventListener('click', () => this.toggleDeleteMode());
        clearAllBtn.addEventListener('click', () => this.clearAllTiers());
        resetAllBtn.addEventListener('click', () => this.resetAll());
        shareBtn.addEventListener('click', () => this.openShareModal());

        // Share modal functionality
        this.setupShareModal();
    }

    setupDragAndDrop() {
        // Setup drag events for existing people
        this.updateDragEvents();

        // Setup drop zones (tier contents and pool)
        const tierContents = document.querySelectorAll('.tier-content');
        const poolContent = document.querySelector('.pool-content');

        // Add drop zone functionality to tier contents
        tierContents.forEach(tierContent => {
            this.setupDropZone(tierContent);
        });

        // Add drop zone functionality to pool
        this.setupDropZone(poolContent);
    }

    updateDragEvents() {
        const personItems = document.querySelectorAll('.person-item');
        
        personItems.forEach(item => {
            // Remove existing event listeners to avoid duplicates
            item.removeEventListener('dragstart', this.handleDragStart);
            item.removeEventListener('dragend', this.handleDragEnd);
            
            // Add new event listeners
            item.addEventListener('dragstart', (e) => this.handleDragStart(e));
            item.addEventListener('dragend', (e) => this.handleDragEnd(e));
        });
    }

    setupDropZone(dropZone) {
        dropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
        dropZone.addEventListener('dragenter', (e) => this.handleDragEnter(e));
        dropZone.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        dropZone.addEventListener('drop', (e) => this.handleDrop(e));
    }

    handleDragStart(e) {
        this.draggedElement = e.target;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    handleDragEnter(e) {
        e.preventDefault();
        if (e.target.classList.contains('tier-content') || e.target.classList.contains('pool-content')) {
            e.target.classList.add('drag-over');
        }
    }

    handleDragLeave(e) {
        if (e.target.classList.contains('tier-content') || e.target.classList.contains('pool-content')) {
            // Only remove drag-over if we're actually leaving the element
            if (!e.target.contains(e.relatedTarget)) {
                e.target.classList.remove('drag-over');
            }
        }
    }

    handleDrop(e) {
        e.preventDefault();
        
        const dropZone = e.target.closest('.tier-content') || e.target.closest('.pool-content');
        if (dropZone && this.draggedElement) {
            dropZone.classList.remove('drag-over');
            
            // Remove the dragged element from its current location
            this.draggedElement.remove();
            
            // Add the element to the new location
            dropZone.appendChild(this.draggedElement);
            
            // Update drag events for the moved element
            this.updateDragEvents();
        }
        
        this.draggedElement = null;
    }



    async addEthosUser() {
        const ethosUsernameInput = document.getElementById('ethosUsername');
        const username = ethosUsernameInput.value.trim();
        
        if (username === '') {
            alert('Please enter an Ethos username');
            return;
        }

        // Check if user already exists
        const existingUser = document.querySelector(`[data-person="${username}"]`);
        if (existingUser) {
            alert('This user already exists!');
            return;
        }

        // Show loading state
        const addEthosUserBtn = document.getElementById('addEthosUserBtn');
        const originalText = addEthosUserBtn.textContent;
        addEthosUserBtn.textContent = 'Loading...';
        addEthosUserBtn.disabled = true;

        try {
            // Fetch user data from Ethos API
            const response = await fetch(`https://api.ethos.network/api/v2/user/by/username/${encodeURIComponent(username)}`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('User not found');
                } else if (response.status === 429) {
                    throw new Error('Rate limit exceeded. Please try again later.');
                } else {
                    throw new Error(`API error: ${response.status}`);
                }
            }

            const userData = await response.json();
            const { displayName, avatarUrl, score } = userData;

            // Create new person element with Ethos data
            const personElement = this.createPersonElement(username, avatarUrl, score, true);

            // Add to pool
            const poolContent = document.querySelector('.pool-content');
            poolContent.appendChild(personElement);

            // Clear input
            ethosUsernameInput.value = '';

            // Update drag events
            this.updateDragEvents();

            // Focus back on input for quick adding
            ethosUsernameInput.focus();

        } catch (error) {
            console.error('Error adding Ethos user:', error);
            alert(`Failed to add user: ${error.message}`);
        } finally {
            // Restore button state
            addEthosUserBtn.textContent = originalText;
            addEthosUserBtn.disabled = false;
        }
    }

    getScoreCategory(score) {
        if (score < 800) return 'untrusted';
        if (score < 1200) return 'questionable';
        if (score < 1400) return 'neutral';
        if (score < 1600) return 'known';
        if (score < 1800) return 'established';
        if (score < 2000) return 'reputable';
        if (score < 2200) return 'exemplary';
        if (score < 2400) return 'distinguished';
        if (score < 2600) return 'revered';
        return 'renowned';
    }

    createPersonElement(identifier, avatarUrl, score, isEthosUser) {
        const personElement = document.createElement('div');
        personElement.className = `person-item${isEthosUser ? ' ethos-user' : ''}`;
        personElement.draggable = true;
        personElement.setAttribute('data-person', identifier);

        // Create delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '×';
        deleteBtn.title = 'Delete user';
        deleteBtn.style.display = 'none';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.deletePerson(identifier);
        });

        if (isEthosUser && avatarUrl && score !== null) {
            // Ethos user with avatar and score
            const scoreCategory = this.getScoreCategory(score);
            const scoreColor = this.scoreColors[scoreCategory];
            
            personElement.innerHTML = `
                <div class="avatar-container">
                    <img src="${avatarUrl}" alt="${identifier}'s avatar" class="avatar" style="border-color: ${scoreColor};" onerror="this.style.display='none'" draggable="false">
                    <div class="score-ring" style="border-color: ${scoreColor};"></div>
                    <div class="score-badge" style="border-color: ${scoreColor}; color: ${scoreColor};">${score}</div>
                </div>
                <div class="username">${identifier}</div>
            `;
        } else {
            // Regular person (just name)
            personElement.innerHTML = `<div class="username">${identifier}</div>`;
        }

        // Ensure the main element is draggable and child elements don't interfere
        personElement.setAttribute('draggable', 'true');
        
        // Prevent child elements from being draggable
        const childElements = personElement.querySelectorAll('*');
        childElements.forEach(child => {
            child.setAttribute('draggable', 'false');
            child.style.pointerEvents = 'none';
        });

        // Add delete button to the element
        personElement.appendChild(deleteBtn);
        
        // Make sure delete button can still be clicked when visible
        deleteBtn.style.pointerEvents = 'auto';

        return personElement;
    }

    toggleDeleteMode() {
        this.deleteMode = !this.deleteMode;
        const deleteButtons = document.querySelectorAll('.delete-btn');
        const toggleBtn = document.getElementById('toggleDelete');
        
        if (this.deleteMode) {
            deleteButtons.forEach(btn => btn.style.display = 'flex');
            toggleBtn.textContent = 'Exit Delete Mode';
            toggleBtn.style.backgroundColor = '#ff0000';
        } else {
            deleteButtons.forEach(btn => btn.style.display = 'none');
            toggleBtn.textContent = 'Toggle Delete Mode';
            toggleBtn.style.backgroundColor = '#000000';
        }
    }

    deletePerson(identifier) {
        if (!this.deleteMode) return;
        
        if (confirm(`Are you sure you want to delete "${identifier}"?`)) {
            const personElement = document.querySelector(`[data-person="${identifier}"]`);
            if (personElement) {
                personElement.remove();
            }
        }
    }

    clearAllTiers() {
        if (!confirm('Are you sure you want to clear all tiers? This will move everyone back to the pool.')) {
            return;
        }

        const tierContents = document.querySelectorAll('.tier-content');
        const poolContent = document.querySelector('.pool-content');

        tierContents.forEach(tierContent => {
            const people = tierContent.querySelectorAll('.person-item');
            people.forEach(person => {
                poolContent.appendChild(person);
            });
        });

        this.updateDragEvents();
    }

    resetAll() {
        if (!confirm('Are you sure you want to reset everything? This will remove all people from the tier maker.')) {
            return;
        }

        // Clear all tiers and pool
        const allContents = document.querySelectorAll('.tier-content, .pool-content');
        allContents.forEach(content => {
            content.innerHTML = '';
        });

        // Exit delete mode if active
        if (this.deleteMode) {
            this.toggleDeleteMode();
        }
    }

    setupShareModal() {
        const modal = document.getElementById('shareModal');
        const closeBtn = document.querySelector('.close');
        const downloadBtn = document.getElementById('downloadBtn');
        const copyImageBtn = document.getElementById('copyImageBtn');

        // Close modal events
        closeBtn.addEventListener('click', () => this.closeShareModal());
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeShareModal();
            }
        });

        // Share action events
        downloadBtn.addEventListener('click', () => this.downloadImage());
        copyImageBtn.addEventListener('click', () => this.copyImageToClipboard());
    }

    async openShareModal() {
        const shareBtn = document.getElementById('shareBtn');
        const modal = document.getElementById('shareModal');
        const imagePreview = document.getElementById('imagePreview');

        // Show loading state
        shareBtn.classList.add('generating');
        shareBtn.disabled = true;

        try {
            // Generate image of tier list
            const tierListElement = document.querySelector('.tier-list');
            const canvas = await html2canvas(tierListElement, {
                backgroundColor: '#ffffff',
                scale: 2,
                useCORS: true,
                allowTaint: true
            });

            // Convert to image
            const imageDataUrl = canvas.toDataURL('image/png');
            this.currentImageData = imageDataUrl;

            // Display in modal
            imagePreview.innerHTML = `<img src="${imageDataUrl}" alt="Tier List">`;
            
            // Show modal
            modal.style.display = 'block';

        } catch (error) {
            console.error('Error generating image:', error);
            alert('Failed to generate image. Please try again.');
        } finally {
            // Remove loading state
            shareBtn.classList.remove('generating');
            shareBtn.disabled = false;
        }
    }

    closeShareModal() {
        const modal = document.getElementById('shareModal');
        modal.style.display = 'none';
    }

    downloadImage() {
        if (!this.currentImageData) return;

        const link = document.createElement('a');
        link.download = `ethos-tier-list-${Date.now()}.png`;
        link.href = this.currentImageData;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    async copyImageToClipboard() {
        if (!this.currentImageData) return;

        try {
            // Convert data URL to blob
            const response = await fetch(this.currentImageData);
            const blob = await response.blob();
            
            // Copy to clipboard
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]);
            
            alert('Image copied to clipboard!');
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            alert('Failed to copy image. Try downloading instead.');
        }
    }
}

// Initialize the tier maker when the page loads
let tierMaker;
document.addEventListener('DOMContentLoaded', () => {
    tierMaker = new TierMaker();
});
