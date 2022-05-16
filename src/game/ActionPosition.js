// Utils
import Objects from './Objects';
import keyCodes from '../utils/keys';
import styles from '../utils/styles';

// Positions
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

        // Values that change with levels (1.UFO speed, 2.Bomb falling speed, 3.Bomb dropping frequency)
        // 1. UFO speed
        this.ufoSpeed = ufoSpeed * (this.level * 7);
        // 2. Bomb falling speed
        this.bombSpeed = bombSpeed + (this.level * 10);
        // 3. Bomb droping frequency
        this.bombFrequency = bombFrequency + (this.level * 0.05);

        // creating ufos
        for(let line = 0; line < ufoLines; line++) {
            for(let column = 0; column < ufoColumns; column++) {
                const x = (play.width/2) + (column * 50) - ((ufoColumns - 1) * 25);
                const y = (play.playBoundaries.top + 30) + (line * 30);
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
            // if bullet flies out from the canvas, it will be cleared
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
                this.horizontalMoving = 0;
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

        // Ufos bombing
        // Sorting ufos - which are at the bottom of each column
        const frontLineUfos = [];

        this.ufos.forEach((ufo) => {
            if (!frontLineUfos[ufo.column] || frontLineUfos[ufo.column].line < ufo.line) {
                frontLineUfos[ufo.column] = ufo;
            }
        });

        // Give a chance for bombing
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

            // if a bomb fall out of canvas will be deleted
            if (bomb.y > play.height) {
                this.bombs.splice(index, 1);
            }
        });

        // Ufos bullets collision
        this.ufos.forEach((ufo, indexUfo) => {
            let collision = false;

            this.bullets.forEach((bullet, indexBullet) => {
                // collision check
                if (bullet.x >= (ufo.x - ufo.width / 2) &&
                    bullet.x <= (ufo.x + ufo.width / 2) &&
                    bullet.y >= (ufo.y - ufo.height / 2) &&
                    bullet.y <= (ufo.y + ufo.height / 2)) {
                    // if there is a collision we delete the bullet and set collision true
                    this.bullets.splice(indexBullet, 1);
                    collision = true;
                    play.score += pointsPerUFO;
                }
            });

            // if there is a collision we delete the UFO
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
                // if there is collision we delete the bomb
                this.bombs.splice(index, 1);
                // effect on the spaceship
                play.audio.playAudio('explode');
                play.shields--;
            }
        });

        // Spaceship and ufos collision
        this.ufos.forEach((ufo) => {
            if ((ufo.x + ufo.width / 2) >= (this.spaceship.x - this.spaceship.width / 2) &&
                (ufo.x - ufo.width / 2 ) <= (this.spaceship.x + this.spaceship.width / 2) &&
                (ufo.y + ufo.height / 2) >= (this.spaceship.y - this.spaceship.height / 2) &&
                (ufo.y - ufo.height / 2) >= (this.spaceship.y + this.spaceship.height / 2)) {
                // if there is a collision the spaceship explodes
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
        ctx.fillStyle = play.audio.muted ? '#ff0000' : '#0b6121';
        ctx.fillText(audioStatus, play.playBoundaries.left + 375, play.playBoundaries.bottom + 70);

        ctx.fillStyle = 'red';
        ctx.textAlign = 'right';
        ctx.fillText('Press P to Pause:', play.playBoundaries.right, play.playBoundaries.bottom + 70);

        // show level and score
        ctx.textAlign = 'center';
        ctx.fillStyle = '#bdbdbd';
        ctx.font = `bold 24px ${styles.font}`;
        ctx.fillText('Score', play.playBoundaries.right, play.playBoundaries.top - 75);
        ctx.font = `bold 30px ${styles.font}`;
        ctx.fillText(play.score, play.playBoundaries.right, play.playBoundaries.top - 25);

        ctx.font = `bold 24px ${styles.font}`;
        ctx.fillText('Level', play.playBoundaries.left, play.playBoundaries.top - 75);
        ctx.font = `bold 30px ${styles.font}`;
        ctx.fillText(play.level, play.playBoundaries.left, play.playBoundaries.top - 25);

        // Draw shields
        ctx.textAlign = 'center';

        if (play.shields) {
            ctx.fillStyle = '#bdbdbd';
            ctx.font = `bold 24px ${styles.font}`;
            ctx.fillText('Shields', play.width / 2, play.playBoundaries.top - 75);
            ctx.font = `bold 30px ${styles.font}`;
            ctx.fillText(play.shields, play.width / 2, play.playBoundaries.top - 25);
        } else {
            ctx.fillStyle = '#ff4d4d';
            ctx.font = `bold 24px ${styles.font}`;
            ctx.fillText('WARNING', play.width / 2, play.playBoundaries.top - 75);
            ctx.fillStyle = '#bdbdbd';
            ctx.fillText('No shields left!', play.width / 2, play.playBoundaries.top - 25);
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
