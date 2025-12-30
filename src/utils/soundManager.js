class SoundManager {
    constructor() {
        this.sounds = {
            gunshot: null,
            horseGallop: null,
        };
        this.isEnabled = true;
        this.gallopInterval = null;
    }

    init() {
        try {
            this.sounds.gunshot = new Audio('/sounds/gunshot.wav');
            this.sounds.gunshot.volume = 0.7;
            this.sounds.gunshot.preload = 'auto';

            this.sounds.horseGallop = new Audio('/sounds/horse-gallop.wav');
            this.sounds.horseGallop.volume = 0.5;
            this.sounds.horseGallop.loop = true;
            this.sounds.horseGallop.preload = 'auto';
        } catch (error) {
            console.log(error);
            this.isEnabled = false;
        }
    }

    playGunshot() {
        if (!this.isEnabled || !this.sounds.gunshot) return;

        try {
            this.sounds.gunshot.currentTime = 0;
            this.sounds.gunshot.play()
        } catch (error) {
            console.log(error);
        }
    }

    startGallop() {
        if (!this.isEnabled || !this.sounds.horseGallop) return;

        try {
            this.sounds.horseGallop.currentTime = 0;
            this.sounds.horseGallop.play()
        } catch (error) {
            console.log(error);
        }
    }

    stopGallop() {
        if (!this.sounds.horseGallop) return;

        try {
            this.sounds.horseGallop.pause();
            this.sounds.horseGallop.currentTime = 0;
        } catch (error) {
            console.log(error);
        }
    }

    stopAll() {
        this.stopGallop();
    }

    setEnabled(enabled) {
        this.isEnabled = enabled;
        if (!enabled) {
            this.stopAll();
        }
    }
}

const soundManager = new SoundManager();

export default soundManager;

