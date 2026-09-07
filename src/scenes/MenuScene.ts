import '../style.css';
import { StartGame } from '../components/ui.ts';

import {
  sendCastMessage
} from '../cast/CastManager.ts';


const app = document.querySelector<HTMLDivElement>('#app')!;

export const renderMenu = () => {
  app.innerHTML = `
    <section id="center">
      <h1>Move Game</h1>
      <p>Click the button below to start the game.</p>

      <div id="ui-options">
        <button id="ui-start" type="button" class="init-ui">
          Start
        </button>

        <button id="ui-loading" type="button" class="init-ui">
          Loading
        </button>

        <button id="ui-settings" type="button" class="init-ui">
          Settings
        </button>
      </div>

      <!-- GOOGLE CAST -->

      <div id="cast-container">

        <google-cast-launcher
          id="ui-cast"
        ></google-cast-launcher>

        <span>
          Transmitir para TV
        </span>

      </div>

    </section>

    <footer>
      <p>
        Made with 💜 by
        <a href="https://github.com/carolalves" target="_blank">
          Carol Alves
        </a>
      </p>
    </footer>
  `;

  document
  .querySelector<HTMLButtonElement>('#ui-cast-test')
  ?.addEventListener('click', () => {

    sendCastMessage({
      type: 'GAME_START'
    });

  });


  const startButton =
    document.querySelector<HTMLButtonElement>('#ui-start');

  if (startButton) {
    StartGame(startButton);
  }
};


