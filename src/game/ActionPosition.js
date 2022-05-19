import Objects from './Objects';
import keyCodes from '../input/keys';
import styles from '../input/styles';
import PausePosition from './PausePosition';
import TransferPosition from './TransferPosition';
import LevelUpPosition from './LevelUpPosition';


class ActionPosition {
    constructor(settings, level) { 
        this.settings = settings; 
        this.level = level; 
        this.spaceship = null;
        this.bullets = []; 
        this.lastBulletTime = null; 
        this.ufos = []; 
        this.bombs = [];
    }

    entry(play) {
        const {
            ufoLines,
            ufoColumns,
            ufoSpeed,
            bombSpeed,
            bombFrequency,
        } = this.settings;

        this.horizontalMoving = 1;
        this.verticalMoving = 0;
        this.ufosAreSinking = false;
        this.ufoCurrentSinkingValue = 0;
        this.turnAround = 1;
        this.spaceshipImage = new Image();
        this.ufoImage = new Image();

        this.objects = new Objects();
        this.spaceship = this.objects.spaceship(
        play.width/2, play.playBoundaries.bottom,
        this.spaceshipImage);
        // 1. UFO speed
        this.ufoSpeed = ufoSpeed * (this.level * 7);
        // 2. Bomb falling speed
        this.bombSpeed = bombSpeed + (this.level * 1);
        // 3. Bomb droping frequency
        this.bombFrequency = bombFrequency + (this.level * 0.08);

        // creating ufos
        for(let line = 0; line < ufoLines; line++) {
            for(let column = 0; column < ufoColumns; column++) {
                const x = (play.width/2) + (column * 70) - ((ufoColumns - 1) * 20); 
                const y = (play.playBoundaries.top + 10) + (line * 60);
                const ufo = this.objects.ufo(x, y, line, column, this.ufoImage);
 
                this.ufos.push(ufo);
            }
        }
    }

    update(play) {
        const {
            updateSeconds,
            spaceshipSpeed,
            bulletSpeed,
            ufoColumns,
            pointsPerUFO,
        } = this.settings;

        if (play.pressedKeys[keyCodes.LEFT_ARROW]) {
            this.spaceship.x -= spaceshipSpeed * updateSeconds;
        }

        if (play.pressedKeys[keyCodes.RIGHT_ARROW]) {
            this.spaceship.x += spaceshipSpeed * updateSeconds;
        }

        if (this.spaceship.x < play.playBoundaries.left) {
            this.spaceship.x = play.playBoundaries.left;
        }

        if (this.spaceship.x > play.playBoundaries.right) {
            this.spaceship.x = play.playBoundaries.right;
        }

        // Moving bullets
        this.bullets.forEach((bullet, index) => {
            bullet.y -= updateSeconds * bulletSpeed;
            // clear bullets exceededing canvas
            if (bullet.y < 0) {
                this.bullets.splice(index, 1);
            }
        });

        this.ufos.forEach((ufo) => {
            const freshX = ufo.x + this.ufoSpeed * updateSeconds * this.turnAround * this.horizontalMoving;
            const freshY = ufo.y + this.ufoSpeed * updateSeconds * this.verticalMoving;
            const reachRight = freshX > play.playBoundaries.right;
            const reachLeft = freshX < play.playBoundaries.left;

            if (reachRight || reachLeft) {
                this.turnAround *= -1;
                // zig 2 was 0
                this.horizontalMoving = 2;
                this.verticalMoving = 1;
                this.ufosAreSinking = true;
            } else {
                ufo.x = freshX;
                ufo.y = freshY;
            }
        });

        if (this.ufosAreSinking) {
            this.ufoCurrentSinkingValue += this.ufoSpeed * updateSeconds;

            if (this.ufoCurrentSinkingValue >= this.settings.ufoSinkingValue) {
                this.ufosAreSinking = false;
                this.verticalMoving = 0;
                this.horizontalMoving = 1;
                this.ufoCurrentSinkingValue = 0;
            }
        }

        // bombing
        // what ufo at column floor
        const frontLineUfos = [];

        this.ufos.forEach((ufo) => {
            if (!frontLineUfos[ufo.column] || frontLineUfos[ufo.column].line < ufo.line) {
                frontLineUfos[ufo.column] = ufo;
            }
        });

        // chance bombing
        for(let i = 0; i < ufoColumns; i ++) {
            const ufo = frontLineUfos[i];

            if (!ufo) {
                continue;
            }

            const chance = this.bombFrequency * updateSeconds;

            if(chance > Math.random()) {
                this.bombs.push(this.objects.bomb(ufo.x, ufo.y + ufo.height/2));
            }
        }

        // Moving bombs
        this.bombs.forEach((bomb, index) => {
            bomb.y += updateSeconds * this.bombSpeed;

            // bomb exceediing canvas deleted
            if (bomb.y > play.height) {
                this.bombs.splice(index, 1);
            }
        });

        // Ufos bullet collision
        this.ufos.forEach((ufo, indexUfo) => {
            let collision = false;

            this.bullets.forEach((bullet, indexBullet) => {
                // collision check
                if (bullet.x >= (ufo.x - ufo.width / 2) &&
                    bullet.x <= (ufo.x + ufo.width / 2) &&
                    bullet.y >= (ufo.y - ufo.height / 2) &&
                    bullet.y <= (ufo.y + ufo.height / 2)) {
                    // no collision set collision true
                    this.bullets.splice(indexBullet, 1);
                    collision = true;
                    play.score += pointsPerUFO;
                }
            });

            // collision ufo deleted
            if (collision) {
                this.ufos.splice(indexUfo, 1);
                play.audio.playAudio('ufoDeath');
            }
        });

        // Spaceship bomb collision
        this.bombs.forEach((bomb, index) => {
            if(bomb.x + 2 >= (this.spaceship.x - this.spaceship.width / 2) &&
            bomb.x -2 <= (this.spaceship.x + this.spaceship.width / 2) &&
            bomb.y + 6 >= (this.spaceship.y - this.spaceship.height / 2) &&
            bomb.y <= (this.spaceship.y + this.spaceship.height / 2)) {
                // no collision deletes bomb
                this.bombs.splice(index, 1);
                // effect on the spaceship
                play.audio.playAudio('explode');
                play.shields--;
            }
        });

        
        this.ufos.forEach((ufo) => {
            if ((ufo.x + ufo.width / 2) >= (this.spaceship.x - this.spaceship.width / 2) &&
                (ufo.x - ufo.width / 2 ) <= (this.spaceship.x + this.spaceship.width / 2) &&
                (ufo.y + ufo.height / 2) >= (this.spaceship.y - this.spaceship.height / 2) &&
                (ufo.y - ufo.height / 2) >= (this.spaceship.y + this.spaceship.height / 2)) {
                // ship explodes
                play.audio.playAudio('explode');
                play.shields--;
            }
        });


        if (play.shields < 0) {
            play.goToPosition(new LevelUpPosition());
        }

        // Level completed
        if (!this.ufos.length) {
            play.level += 1;
            play.goToPosition(new TransferPosition(play.level));
        }
    }

    keyDown(play, keyboardCode) {
        if (keyboardCode === keyCodes.SPACE) {
            this.shoot(play);
        }

        if (keyboardCode === keyCodes.S) {
            play.audio.mute();
        }

        if (keyboardCode === keyCodes.P) {
            play.pushPosition(new PausePosition());
        }
    }

    draw(play) {
        const ctx = play.ctx;

        ctx.clearRect(0, 0, play.width, play.height);
        ctx.drawImage(this.spaceship.spaceshipImage, this.spaceship.x - (this.spaceship.width/2), this.spaceship.y - (this.spaceship.height/2));

        // Draw bullets
        ctx.fillStyle = '#ff0000';
        this.bullets.forEach((bullet) => ctx.fillRect(bullet.x-1, bullet.y-6, 2, 6));

        // Draw ufos
        this.ufos.forEach((ufo) => ctx.drawImage(this.ufoImage, ufo.x - (ufo.width/2), ufo.y - (ufo.height/2)));

        // Draw bombs
        ctx.fillStyle = '#00ff00';
        this.bombs.forEach((bomb) => ctx.fillRect(bomb.x-2, bomb.y, 4, 6));

        // Draw audio/mute
        ctx.font = `16px ${styles.font}`;

        ctx.fillStyle = 'red';
        ctx.textAlign = 'left';
        ctx.fillText('S = audio. Audio:', play.playBoundaries.left, play.playBoundaries.bottom + 70);

        const audioStatus = play.audio.muted ? 'OFF' : 'ON';
        ctx.fillStyle = play.audio.muted ? '#ff0000' : 'red';
        ctx.fillText(audioStatus, play.playBoundaries.left + 375, play.playBoundaries.bottom + 70);

        ctx.fillStyle = 'red';
        ctx.textAlign = 'right';
        ctx.fillText('Press P to Pause:', play.playBoundaries.right, play.playBoundaries.bottom + 70);

        // show level and score
        ctx.textAlign = 'center';
        ctx.fillStyle = '#red';
        ctx.font = `bold 24px ${styles.font}`;
        ctx.fillText('Score', play.playBoundaries.right, play.playBoundaries.top - 95);
        ctx.font = `bold 30px ${styles.font}`;
        ctx.fillText(play.score, play.playBoundaries.right, play.playBoundaries.top - 25);

        ctx.font = `bold 24px ${styles.font}`;
        ctx.fillText('Level', play.playBoundaries.left, play.playBoundaries.top - 95);
        ctx.font = `bold 30px ${styles.font}`;
        ctx.fillText(play.level, play.playBoundaries.left, play.playBoundaries.top - 25);

        // Draw shields
        ctx.textAlign = 'center';

        if (play.shields) {
            ctx.fillStyle = '#red';
            ctx.font = `bold 22px ${styles.font}`;
            ctx.fillText('Shields', play.width / 2, play.playBoundaries.top - 95);
            ctx.font = `bold 25px ${styles.font}`;
            ctx.fillText(play.shields, play.width / 2, play.playBoundaries.top - 55);
        } else {
            ctx.fillStyle = '#ff4d4d';
            ctx.font = `bold 24px ${styles.font}`;
            ctx.fillText('WARNING', play.width / 2, play.playBoundaries.top - 95);
            ctx.fillStyle = 'red';
            ctx.fillText('No shields left!', play.width / 2, play.playBoundaries.top - 55);
        }
    }

    shoot(play) {
        const currentTime = (new Date()).getTime();

        if (this.lastBulletTime == null || (currentTime - this.lastBulletTime) > this.settings.bulletMaxFrequency) {
            this.bullets.push(this.objects.bullet(this.spaceship.x, this.spaceship.y - this.spaceship.height/2, this.settings.bulletSpeed));
            this.lastBulletTime = currentTime;
            play.audio.playAudio('shot')
        }
    }
}

export default ActionPosition;
