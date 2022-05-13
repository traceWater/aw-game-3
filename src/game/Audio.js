import { Howl } from 'howler';

// Audio
import shot from '../audio/shot.mp3';
import explosion from '../audio/explosion.mp3';
import ufoDeath from '../audio/shot.mp3';

class Audio {
    constructor() {
        this.muted = false;
    }
    init() {
        this.shotSound = new Howl({
            src: shot
        });
        this.explosionSound = new Howl({
            src: explosion
        });
        this.ufoDeathSound = new Howl({
            src: ufoDeath
        });
    }
    playSound(soundName) {
        if (this.muted) {
            return;
        }

        switch (soundName) {
            case 'shot':
                this.shotSound.play();
                this.shotSound.currentTime = 0;
                break;
            case 'ufoDeath':
                this.ufoDeathSound.play();
                this.ufoDeathSound.currentTime = 0;
                break;
            default:
                this.explosionSound.play();
                this.explosionSound.currentTime = 0;
                return;
        }
    }

    mute() {
        this.muted = !this.muted;
    }
}

export default Audio;
