// Minecraft Inventory System
class MinecraftInventory {
    constructor() {
        this.inventory = new Array(37).fill(null); // 27 main slots + 9 hotbar + 1 cursor
        this.selectedSlot = 0;
        this.items = [
            { id: 'stone', name: 'Stone', color: '#808080' },
            { id: 'dirt', name: 'Dirt', color: '#8B7355' },
            { id: 'grass', name: 'Grass Block', color: '#2d5016' },
            { id: 'wood', name: 'Oak Log', color: '#6B4423' },
            { id: 'planks', name: 'Oak Planks', color: '#C19A6B' },
            { id: 'sand', name: 'Sand', color: '#E0D896' },
            { id: 'cobblestone', name: 'Cobblestone', color: '#707070' },
            { id: 'oak_leaves', name: 'Oak Leaves', color: '#2d5016' },
            { id: 'iron_ore', name: 'Iron Ore', color: '#8B6914' },
            { id: 'coal_ore', name: 'Coal Ore', color: '#1a1a1a' },
            { id: 'gold_ore', name: 'Gold Ore', color: '#E6AD00' },
            { id: 'diamond_ore', name: 'Diamond Ore', color: '#117a9c' },
            { id: 'bookshelf', name: 'Bookshelf', color: '#8B4513' }
        ];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderInventory();
        this.addSampleItems();
    }

    setupEventListeners() {
        // Slot clicks
        document.querySelectorAll('.inventory-slot').forEach(slot => {
            slot.addEventListener('click', (e) => this.handleSlotClick(e));
            slot.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.handleSlotRightClick(e);
            });
        });

        // Button clicks
        document.getElementById('saveBtn').addEventListener('click', () => this.saveInventory());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearInventory());
        document.getElementById('closeBtn').addEventListener('click', () => this.closeInventory());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    handleSlotClick(e) {
        const slotElement = e.target.closest('.inventory-slot');
        if (!slotElement) return;

        const slotIndex = parseInt(slotElement.dataset.slot);
        
        if (this.inventory[slotIndex]) {
            this.selectSlot(slotIndex);
            this.showNotification(`Selected: ${this.inventory[slotIndex].name}`);
        }
    }

    handleSlotRightClick(e) {
        const slotElement = e.target.closest('.inventory-slot');
        if (!slotElement) return;

        const slotIndex = parseInt(slotElement.dataset.slot);
        const randomItem = this.items[Math.floor(Math.random() * this.items.length)];
        
        this.inventory[slotIndex] = { ...randomItem, count: Math.floor(Math.random() * 64) + 1 };
        this.renderInventory();
        this.showNotification(`Added: ${randomItem.name}`);
    }

    selectSlot(slotIndex) {
        this.selectedSlot = slotIndex;
        this.renderInventory();
    }

    addSampleItems() {
        // Add some random items to the inventory
        const sampleItems = [
            { slot: 0, item: this.items[0], count: 64 },  // Stone
            { slot: 1, item: this.items[1], count: 64 },  // Dirt
            { slot: 3, item: this.items[3], count: 32 },  // Wood
            { slot: 4, item: this.items[4], count: 48 },  // Planks
            { slot: 28, item: this.items[8], count: 1 },  // Iron Ore
            { slot: 29, item: this.items[9], count: 12 }, // Coal Ore
        ];

        sampleItems.forEach(({ slot, item, count }) => {
            this.inventory[slot] = { ...item, count };
        });

        this.renderInventory();
    }

    renderInventory() {
        document.querySelectorAll('.inventory-slot').forEach(slot => {
            const slotIndex = parseInt(slot.dataset.slot);
            const item = this.inventory[slotIndex];

            // Clear previous content
            slot.textContent = '';
            slot.removeAttribute('data-item');
            slot.style.background = '';
            slot.style.borderColor = '';

            if (item) {
                slot.setAttribute('data-item', item.id);
                slot.textContent = item.count;
                
                // Highlight selected slot
                if (slotIndex === this.selectedSlot) {
                    slot.style.boxShadow = '0 0 0 2px #ffff00, inset 0 0 4px rgba(255, 255, 0, 0.5)';
                }
            } else if (slotIndex === this.selectedSlot) {
                slot.style.boxShadow = '0 0 0 2px #ffff00';
            }
        });
    }

    handleKeyboard(e) {
        // Number keys 1-9 for hotbar
        if (e.key >= '1' && e.key <= '9') {
            const slotIndex = 27 + (parseInt(e.key) - 1); // Hotbar starts at slot 27
            this.selectSlot(slotIndex);
        }

        // E to close
        if (e.key.toLowerCase() === 'e') {
            this.closeInventory();
        }
    }

    saveInventory() {
        const data = JSON.stringify(this.inventory);
        localStorage.setItem('minecraftInventory', data);
        this.showNotification('Inventory saved!');
    }

    clearInventory() {
        if (confirm('Are you sure you want to clear your inventory?')) {
            this.inventory = new Array(37).fill(null);
            this.selectedSlot = 0;
            this.renderInventory();
            this.showNotification('Inventory cleared!');
        }
    }

    closeInventory() {
        this.showNotification('Inventory closed (E to open)');
        console.log('Closing inventory...');
    }

    showNotification(message) {
        // Create a temporary notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: #fff;
            padding: 10px 20px;
            border-radius: 4px;
            font-family: 'Minecraft', Arial, sans-serif;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}

// Add slide animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(style);

// Initialize inventory when page loads
document.addEventListener('DOMContentLoaded', () => {
    const inventory = new MinecraftInventory();
    window.minecraftInventory = inventory;
});
