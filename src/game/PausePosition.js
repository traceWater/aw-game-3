import keys from '../input/keys';
import styles from '../input/styles';

// Positions
import LevelUpPosition from './LevelUpPosition';

class PausePosition {
    draw(play) {
        play.ctx.clearRect(0,0, play.width, play.height);
        play.ctx.font = `40px ${styles.font}`;
        play.ctx.fillStyle = '#ffffff';
        play.ctx.textAlign = 'center';
        play.ctx.fillText( 'PAUSED', play.width/2, play.height/2 - 300);

        play.ctx.font = `36px ${styles.font}`;
        play.ctx.fillStyle = '#D7DF01';
        play.ctx.fillText( 'P: resume ESC: Leave Game', play.width/2, play.height/2 - 250);

        play.ctx.font = `40px ${styles.font}`;
        play.ctx.fillStyle = '#ffffff';
        play.ctx.fillStyle = '#D7DF01';
        play.ctx.font = `36px ${styles.font}`;
        play.ctx.fillText( '< left right > SpaceBar: Fire', play.width/2, play.height/2 - 70);
        
    }

    keyDown(play, keyboardCode) {
        if (keyboardCode === keys.P) {
            play.popPosition();
        }
        if (keyboardCode === keys.ESC) {
            play.goToPosition(new LevelUpPosition());
        }
    }
}

export default PausePosition;
