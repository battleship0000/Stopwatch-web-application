class LiquidStopwatch {
    constructor() {
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerInterval = null;
        this.isRunning = false;
        this.laps = [];
        
        this.initializeElements();
        this.bindEvents();
        this.addLiquidEffects();
    }
    
    initializeElements() {
        this.timeDisplay = document.getElementById('timeDisplay');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.lapBtn = document.getElementById('lapBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.lapsSection = document.getElementById('lapsSection');
        this.lapsList = document.getElementById('lapsList');
        this.statusIndicator = document.getElementById('statusIndicator');
    }
    
    bindEvents() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.lapBtn.addEventListener('click', () => this.lap());
        this.resetBtn.addEventListener('click', () => this.reset());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            switch(e.code) {
                case 'Space':
                    e.preventDefault();
                    if (!this.startBtn.disabled) {
                        this.start();
                    } else if (!this.pauseBtn.disabled) {
                        this.pause();
                    }
                    break;
                case 'KeyL':
                    e.preventDefault();
                    if (!this.lapBtn.disabled) {
                        this.lap();
                    }
                    break;
                case 'KeyR':
                    e.preventDefault();
                    this.reset();
                    break;
            }
        });
    }
    
    addLiquidEffects() {
        // Add liquid ripple effect on button clicks
        document.querySelectorAll('.liquid-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = btn.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: liquidRipple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                btn.appendChild(ripple);
                
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes liquidRipple {
                        to {
                            transform: scale(2);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
                
                setTimeout(() => {
                    ripple.remove();
                    style.remove();
                }, 600);
            });
        });
    }
    
    start() {
        if (!this.isRunning) {
            this.startTime = Date.now() - this.elapsedTime;
            this.timerInterval = setInterval(() => this.updateDisplay(), 10);
            this.isRunning = true;
            
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            this.lapBtn.disabled = false;
            
            this.statusIndicator.className = 'status-indicator running';
        }
    }
    
    pause() {
        if (this.isRunning) {
            clearInterval(this.timerInterval);
            this.isRunning = false;
            
            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;
            this.lapBtn.disabled = true;
            
            this.statusIndicator.className = 'status-indicator paused';
        }
    }
    
    // FIXED RESET FUNCTION
    reset() {
        // Clear the timer interval
        clearInterval(this.timerInterval);
        this.isRunning = false;
        
        // Reset all time values
        this.elapsedTime = 0;
        this.startTime = 0;
        this.laps = [];
        
        // Manually set display to show 00:00:00.000
        this.timeDisplay.innerHTML = '00:00:00<span class="milliseconds">.000</span>';
        
        // Update lap display (will hide the section)
        this.updateLapDisplay();
        
        // Reset button states
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.lapBtn.disabled = true;
        
        // Reset status indicator
        this.statusIndicator.className = 'status-indicator';
        this.lapsSection.style.display = 'none';
    }
    
    lap() {
        if (this.isRunning) {
            const lapTime = this.elapsedTime;
            this.laps.push(lapTime);
            this.updateLapDisplay();
            this.lapsSection.style.display = 'block';
        }
    }
    
    updateDisplay() {
        this.elapsedTime = Date.now() - this.startTime;
        const time = this.formatTime(this.elapsedTime);
        this.timeDisplay.innerHTML = `${time.main}<span class="milliseconds">.${time.ms}</span>`;
    }
    
    formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = Math.floor((ms % 1000));
        
        return {
            main: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
            ms: milliseconds.toString().padStart(3, '0')
        };
    }
    
    updateLapDisplay() {
        this.lapsList.innerHTML = '';
        
        if (this.laps.length === 0) {
            this.lapsSection.style.display = 'none';
            return;
        }
        
        const fastestLap = Math.min(...this.laps);
        const slowestLap = Math.max(...this.laps);
        
        this.laps.forEach((lapTime, index) => {
            const lapItem = document.createElement('div');
            lapItem.className = 'lap-item';
            
            if (this.laps.length > 1) {
                if (lapTime === fastestLap && lapTime !== slowestLap) {
                    lapItem.classList.add('fastest');
                } else if (lapTime === slowestLap && lapTime !== fastestLap) {
                    lapItem.classList.add('slowest');
                }
            }
            
            const time = this.formatTime(lapTime);
            lapItem.innerHTML = `
                <span class="lap-number">Lap ${index + 1}</span>
                <span class="lap-time">${time.main}.${time.ms}</span>
            `;
            
            this.lapsList.appendChild(lapItem);
        });
    }
}

// Initialize the liquid stopwatch when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new LiquidStopwatch();
});
