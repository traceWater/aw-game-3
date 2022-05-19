
import Audio from './Audio';
import StartPosition from './StartPosition';

class GameModel {
    constructor(canvas) {
        this.ctx = canvas ? canvas.getContext('2d') : null;
        this.width = canvas.width;
        this.height = canvas.height;
        this.playBoundaries = { 
            top: 115,
            bottom: 600, 
            left: 100, 
            right: 800};
            // init val
            this.level = 1; 
            this.score = 0; 
            this.shields = 2;
        // fps
        this.settings = { 
            updateSeconds: (1/60), 
            spaceshipSpeed: 150,
            bulletSpeed: 130,
            bulletMaxFrequency: 250,
            ufoLines: 3, 
            ufoColumns: 8, 
            ufoSpeed: 15, 
            ufoSinkingValue: 40,
            bombSpeed: 75, 
            bombFrequency: 0.05,
            pointsPerUFO: 25,
        };
        
            // states:                    store:
            this.positionContainer = [];
            this.pressedKeys = {};
    }

    presentPosition() {
        return this.positionContainer.length > 0 ? this.positionContainer[this.positionContainer.length - 1] : null;
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
        this.audio = new Audio(); 
        this.audio.init();

    setInterval(() => gameLoop(this), 
        this.settings.updateSeconds * 1000);
        this.goToPosition(new StartPosition());
    }

    keyDown(keyboardCode) { 
        this.pressedKeys[keyboardCode] = true;

        // keyDown function
        if (this.presentPosition() && this.presentPosition().keyDown) { 
            this.presentPosition().keyDown(
            this, keyboardCode);
        }
    }
    // remove keys
    keyUp(keyboardCode) { delete this.pressedKeys[keyboardCode]; }
}

let gameLoop = (play) => {
    let currentPosition = play.presentPosition();

    if (currentPosition) {
        if (currentPosition.update) { currentPosition.update(play); }
    
        if (currentPosition.draw) { currentPosition.draw(play); }
    }
}

export default GameModel;
