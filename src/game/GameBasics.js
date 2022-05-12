// Utils
import Sounds from './Sounds';

// Positions
import OpeningPosition from './OpeningPosition';

class GameBasics {
    constructor(canvas) {
        this.ctx = canvas ? canvas.getContext('2d') : null;
        this.width = canvas.width;
        this.height = canvas.height;

        this.playBoundaries = {
            top: 150,
            bottom: 650,
            left: 100,
            right: 800
        };

        // initial values
        this.level = 1;
        this.score = 0;
        this.shields = 2;

        this.settings = {
            // FPS: 60 frames per second, this means 1 new frame each 0,01666667 seconds
            updateSeconds: (1/60),
            spaceshipSpeed: 200,
            bulletSpeed: 130,
            bulletMaxFrequency: 500, // how fast our spaceship can shoot one after another
            ufoLines: 4,
            ufoColumns: 8,
            ufoSpeed: 15,
            ufoSinkingValue: 30, // how much the UFO sinks
            bombSpeed: 75, // bomb falling speed
            bombFrequency: 0.05, // bomb dropping frequency
            pointsPerUFO: 25,
        };

        // collect different positions, states of the game
        this.positionContainer = [];

        // pressed keys store
        this.pressedKeys = {};
    }

    presentPosition() {
        return this.positionContainer.length > 0 ?
            this.positionContainer[this.positionContainer.length - 1] :
            null;
    }

    goToPosition(position) {
        if (this.presentPosition()) {
            this.positionContainer.length = 0;
        }

        if (position.entry) {
            position.entry(this);
        }

        this.positionContainer.push(position);
    }

    pushPosition(position) {
        this.positionContainer.push(position);
    }

    popPosition() {
        this.positionContainer.pop();
    }

    start() {
        this.sounds = new Sounds();
        this.sounds.init();

        setInterval(() => gameLoop(this), this.settings.updateSeconds * 1000);
        // go to the opening position
        this.goToPosition(new OpeningPosition());
    }

    keyDown(keyboardCode) {
        // store pressed key
        this.pressedKeys[keyboardCode] = true;

        // it calls the present position keyDown function
        if (this.presentPosition() && this.presentPosition().keyDown) {
            this.presentPosition().keyDown(this, keyboardCode);
        }
    }

    keyUp(keyboardCode) {
        // remover from pressed keys store
        delete this.pressedKeys[keyboardCode];
    }
}

function gameLoop(play) {
    let currentPosition = play.presentPosition();

    if (currentPosition) {
        // update
        if (currentPosition.update) {
            currentPosition.update(play);
        }
        // draw
        if (currentPosition.draw) {
            currentPosition.draw(play);
        }
    }
}

export default GameBasics;
