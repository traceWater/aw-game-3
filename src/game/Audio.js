import { Howl } from 'howler';
import shot from '../audio/shot.mp3';
import explosion from '../audio/explosion.mp3';
import ufoDeath from '../audio/shot.mp3';

class Audio {
    constructor() {
        this.muted = false;
    }
    init() {
        this.shotAudio = new Howl({
            src: shot
        });
        this.explosionAudio = new Howl({
            src: explosion
        });
        this.ufoDeathAudio = new Howl({
            src: ufoDeath
        });
    }
    playAudio(audioName) {
        if (this.muted) {
            return;
        }

        switch (audioName) {
            case 'shot':
                this.shotAudio.play();
                this.shotAudio.currentTime = 0;
                break;
            case 'ufoDeath':
                this.ufoDeathAudio.play();
                this.ufoDeathAudio.currentTime = 0;
                break;
            default:
                this.explosionAudio.play();
                this.explosionAudio.currentTime = 0;
                return;
        }
    }

    mute() {
        this.muted = !this.muted;
    }
}

export default Audio;
