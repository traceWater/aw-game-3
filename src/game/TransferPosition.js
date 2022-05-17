import styles from '../input/styles';
import ActionPosition from './ActionPosition';

class TransferPosition {
    constructor(level) {
        this.level = level;
        this.fontSize = 10;
        this.fontColor = 255;
    }

    update(play) {
        this.fontSize -= 1;
        this.fontColor -= 1.1;

        if (this.fontSize < 1) {
            play.goToPosition(new ActionPosition(play.settings, this.level));
        }
    }

    draw(play) {
        const ctx = play.ctx;

        ctx.clearRect(0,0, play.width, play.height);
        ctx.font = `${this.fontSize}px ${styles.font}`;
        ctx.textAlign = 'center';
        ctx.fillStyle = `rgba(255, ${this.fontColor}, ${this.fontColor}, 1)`;
        ctx.fillText(`enter the void ${this.level}`, play.width/2, play.height/2);
    }
}

export default TransferPosition;


