// Utils
import keys from '../utils/keys';
import styles from '../utils/styles';

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
        // play.ctx.fillText( 'ESC: game', play.width/2, play.height/2 - 210);


        play.ctx.font = `40px ${styles.font}`;
        play.ctx.fillStyle = '#ffffff';
        // play.ctx.fillText( 'Game controls reminder', play.width/2, play.height/2 - 120);
        play.ctx.fillStyle = '#D7DF01';
        play.ctx.font = `36px ${styles.font}`;
        play.ctx.fillText( '< left right > SpaceBar: Fire', play.width/2, play.height/2 - 70);
        // play.ctx.fillText( 'right arrow: Move right', play.width/2, play.height/2 - 30);
        // play.ctx.fillText( 'Space: Fire', play.width/2, play.height/2 - 10);

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
