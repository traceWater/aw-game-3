import React, { useEffect } from 'react';

// Game
import GameBasics from './game/GameBasics';
import Sounds from './game/Sounds';

// Utils
import throttle from 'lodash/throttle';
import keyCodes from './utils/keys';

// Styles
import './App.css';

const resize = (canvas) => {
    if (!canvas) {
        return;
    }

    const height = window.innerHeight - 20;

    const ratio = canvas.width / canvas.height;
    const width = height * ratio;

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
};

function App() {
    useEffect(() => {
        if (document) {
            const canvas = document.getElementById('ufoCanvas');
            canvas.width = 900;
            canvas.height = 750;

            const play = new GameBasics(canvas);
            play.start();

            const handleResize = () => resize(canvas);
            const throttledHandleResize = throttle(() => resize(canvas), 100);
            const handleKeyDown = (e) => {
                const keyboardCode = e.which || e.keyCode;

                if (Object.values(keyCodes).includes(keyboardCode)) {
                    e.preventDefault();
                }

                play.keyDown(keyboardCode);
            } ;
            const handleKeyUp = (e) => {
                const keyboardCode = e.which || e.keyCode;

                play.keyUp(keyboardCode);
            } ;

            window.addEventListener('load', handleResize, false);
            window.addEventListener('resize', throttledHandleResize, true);
            window.addEventListener('keydown', handleKeyDown);
            window.addEventListener('keyup', handleKeyUp);

            return () => {
                window.removeEventListener('load', handleResize);
                window.removeEventListener('resize', throttledHandleResize);
                window.removeEventListener('keydown', handleKeyDown);
                window.removeEventListener('keyup', handleKeyUp);
            }
        }

    });

  return (
    <div className="App">
      <canvas id={ 'ufoCanvas'}></canvas>
    </div>
  );
}

export default App;
