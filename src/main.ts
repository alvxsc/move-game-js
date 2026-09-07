import './style.css';

import { renderMenu } from './scenes/MenuScene.ts';
import { renderLoadingScene } from './scenes/LoadingScene.ts';
import { renderGame } from './scenes/PlayerScene.ts';
import { renderGamePlay } from './scenes/GameScene.ts';

import { initializeCast } from './cast/CastManager.ts';

// ==========================================
// GOOGLE CAST
// ==========================================

window.addEventListener(
  'google-cast-available',
  () => {

    initializeCast();

  }
);

function router() {
  const path = window.location.pathname;

  if (path === '/loading') {
    renderLoadingScene();

  } else if (path === '/game') {
    renderGame();

  } else if (path === '/game/play') {
    renderGamePlay();

  } else {
    renderMenu();
  }
}

window.addEventListener('popstate', router);

router();
