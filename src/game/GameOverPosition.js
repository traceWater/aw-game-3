// Utils
import styles from '../utils/styles';
import keys from '../utils/keys';

// Positions
import OpeningPosition from './OpeningPosition';

class GameOverPosition {
    draw(play) {
        const ctx = play.ctx;

        ctx.clearRect(0, 0, play.width, play.height);
        ctx.font = `40px ${styles.font}`;
        ctx.textAlign = 'center';
        ctx.fillStyle = 'red';
        ctx.fillText('Game Over!', play.width / 2, play.height / 2 - 120);

        ctx.font = `36px ${styles.font}`;
        ctx.fillStyle = 'red';
        ctx.fillText('Level ' + play.level + ' score is ' + play.score + '.', play.width / 2, play.height / 2 - 80);
        ctx.fillText('SpaceBar Resumes', play.width / 2, play.height / 2 + 40);
    }

    keyDown(play, keyboardCode) {
        if (keyboardCode === keys.SPACE) {
            play.goToPosition(new OpeningPosition());
        }
    }
}

export default GameOverPosition;
