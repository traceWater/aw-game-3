import ship from '../images/ship.png';
import ufo from '../images/ufo.png';

class Objects {
    spaceship(x, y, spaceshipImage) {
        spaceshipImage.src = ship;

        return {
            x,
            y,
            width: 28,
            height: 36,
            spaceshipImage,
        }
    }

    bullet(x, y) {
        return {
            x,
            y,
        };
    }

    bomb(x, y) {
        return {
            x,
            y,
        };
    }

    ufo(x, y, line, column, ufoImage) {
        ufoImage.src = ufo;

        return {
            x,
            y,
            line,
            column,
            width: 32,
            height: 24,
            ufoImage,
        };
    }
}

export default Objects;
