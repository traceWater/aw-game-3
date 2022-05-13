
import Sounds from './Sounds';


import OpeningPosition from './OpeningPosition';

class GameFrame {
    constructor(canvas) {
        this.ctx = canvas ? canvas.getContext('2d') : null;
        this.width = canvas.width;
        this.height = canvas.height;

        this.playBoundaries = { top: 150, bottom: 650, left: 100, right: 800
        };

        // init val
        this.level = 1;
        this.score = 0;
        this.shields = 2;

        // fps: 1/60
        this.settings = { updateSeconds: (1/60), spaceshipSpeed: 200, bulletSpeed: 130, bulletMaxFrequency: 500,
             ufoLines: 4, ufoColumns: 8, ufoSpeed: 15, ufoSinkingValue: 30, bombSpeed: 75, bombFrequency: 0.05,
             pointsPerUFO: 25,
        };

        // states
        this.positionContainer = [];

        // keys store
        this.pressedKeys = {};
    }

    presentPosition() {
        return this.positionContainer.length > 0 ? this.positionContainer[this.positionContainer.length - 1] : null;
    }

    goToPosition(position) {
        if (this.presentPosition()) { this.positionContainer.length = 0;
        }

        if (position.entry) { position.entry(this);
        }

        this.positionContainer.push(position);
    }

    pushPosition(position) { this.positionContainer.push(position);
    }

    popPosition() { this.positionContainer.pop();
    }

    start() { this.sounds = new Sounds(); this.sounds.init();

        setInterval(() => gameLoop(this), this.settings.updateSeconds * 1000);
        // to opening position
        this.goToPosition(new OpeningPosition());
    }

    keyDown(keyboardCode) { this.pressedKeys[keyboardCode] = true;

        // keyDown function
        if (this.presentPosition() && this.presentPosition().keyDown) { this.presentPosition().keyDown(
            this, keyboardCode);
        }
    }

    // remove keys
    keyUp(keyboardCode) { delete this.pressedKeys[keyboardCode]; }
}

function gameLoop(play) {
    let currentPosition = play.presentPosition();

    if (currentPosition) {
        if (currentPosition.update) { currentPosition.update(play); }
    
        if (currentPosition.draw) { currentPosition.draw(play); }
    }
}

export default GameFrame;
