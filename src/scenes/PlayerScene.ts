import '../style.css';

import { startCamera } from '../camera/Camera.ts';
import { PoseTracker } from '../tracking/PoseTracker.ts';
import { HandTracker, isThumbsUp } from '../tracking/HandTracker.ts';

import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

let thumbsUpStartTime: number | null = null;
const THUMBS_UP_DURATION = 3000;

const app = document.querySelector<HTMLDivElement>('#app')!;

export const renderGame = async () => {
  app.innerHTML = `
    <main id="player-identification">

      <!-- Título -->
      <header id="identification-header">
        <h1>Move Game</h1>

        <p id="identification-status">
          Posicione seu corpo inteiro na câmera
        </p>
      </header>


      <!-- Área da câmera -->
      <section id="identification-camera-area">

        <div id="identification-camera-container">

          <video
            id="player-camera"
            autoplay
            muted
            playsinline
          ></video>

          <!-- Overlay para orientação -->
          <div id="camera-overlay">

            <div id="body-frame"></div>

          </div>

        </div>

      </section>


      <!-- Instrução do joinha -->
      <section id="thumb-instruction">

        <div id="thumb-icon">
          👍
        </div>

        <div>
          <strong>Faça um joinha</strong>

          <p>
            Mantenha o gesto por 3 segundos
          </p>
        </div>

      </section>


      <!-- Progresso do joinha -->
      <div id="thumb-progress">

        <div id="thumb-progress-bar"></div>

      </div>


      <footer id="identification-footer">

        <span id="thumb-countdown">
          0s
        </span>

      </footer>

    </main>
  `;

  const video =
    document.querySelector<HTMLVideoElement>('#player-camera');

  if (!video) return;

  try {
    await startCamera(video);

    const poseTracker = new PoseTracker(video);
    const handTracker = new HandTracker(video);

    await poseTracker.initialize();
    await handTracker.initialize();

    startTracking(
      poseTracker,
      handTracker

      
    );

  } catch (error) {
    console.error(error);

    const message =
      document.querySelector<HTMLParagraphElement>(
        '#camera-instruction'
      );

    if (message) {
      message.textContent =
        'Não foi possível iniciar a câmera.';
    }
  }
};

//function startPoseDetection(poseTracker: PoseTracker) {
//  const detect = () => {
//    const result = poseTracker.detect();
//
//    if (result?.landmarks?.length) {
//      const landmarks = result.landmarks[0];
//
//      checkFullBody(landmarks);
//    }
//
//    requestAnimationFrame(detect);
//  };
//
//  detect();
//}

function isBodyInsideCamera(
  landmarks: NormalizedLandmark[]
) {
  const importantPoints = [
    0,  // nariz
    11, // ombro esquerdo
    12, // ombro direito
    23, // quadril esquerdo
    24, // quadril direito
    27, // tornozelo esquerdo
    28, // tornozelo direito
  ];

  const MIN_X = 0.10;
  const MAX_X = 0.90;

  const MIN_Y = 0.05;
  const MAX_Y = 0.95;

  return importantPoints.every(index => {
    const point = landmarks[index];

    if (!point || point.visibility === undefined) {
      return false;
    }

    if (point.visibility < 0.5) {
      return false;
    }

    return (
      point.x >= MIN_X &&
      point.x <= MAX_X &&
      point.y >= MIN_Y &&
      point.y <= MAX_Y
    );
  });
}

function checkFullBody(landmarks: NormalizedLandmark[]) {
  const bodyInside = isBodyInsideCamera(landmarks);

  updateBodyStatus(bodyInside);
}

function updateBodyStatus(isReady: boolean) {
  const frame =
    document.querySelector<HTMLDivElement>('.body-frame');

  const title =
    document.querySelector<HTMLHeadingElement>('#camera-title');

  const instruction =
    document.querySelector<HTMLParagraphElement>(
      '#camera-instruction'
    );

  if (!frame || !title || !instruction) {
    return;
  }

  if (isReady) {
    frame.classList.add('body-ready');

    title.textContent = 'Perfeito!';

    instruction.textContent =
      'Agora faça um 👍 e mantenha por 3 segundos.';
  } else {
    frame.classList.remove('body-ready');

    title.textContent = 'Prepare-se!';

    instruction.textContent =
      'Fique de corpo inteiro dentro da área.';
  }
}

function startTracking(
  poseTracker: PoseTracker,
  handTracker: HandTracker
) {
  const detect = () => {

    const poseResult = poseTracker.detect();
    const handResult = handTracker.detect();

    if (poseResult?.landmarks?.length) {
      const bodyLandmarks =
        poseResult.landmarks[0];

      checkFullBody(bodyLandmarks);
    }

    if (handResult?.landmarks?.length) {
      const handLandmarks =
        handResult.landmarks[0];

      const thumbsUp =
        isThumbsUp(handLandmarks);

      updateThumbStatus(thumbsUp);
    }

    requestAnimationFrame(detect);
  };

  detect();
}

function updateThumbStatus(isThumbsUpDetected: boolean) {

  const progressBar =
    document.querySelector<HTMLDivElement>(
      '#thumb-progress-bar'
    );

  const countdown =
    document.querySelector<HTMLSpanElement>(
      '#thumb-countdown'
    );

  if (!progressBar || !countdown) {
    return;
  }

  if (!isThumbsUpDetected) {

    thumbsUpStartTime = null;

    progressBar.style.width = '0%';

    countdown.textContent = '0s';

    return;
  }

  if (thumbsUpStartTime === null) {
    thumbsUpStartTime = performance.now();
  }

  const elapsed =
    performance.now() - thumbsUpStartTime;

  const progress =
    Math.min(
      elapsed / THUMBS_UP_DURATION,
      1
    );

  progressBar.style.width =
    `${progress * 100}%`;

  const seconds =
    Math.min(
      Math.floor(elapsed / 1000) + 1,
      3
    );

  countdown.textContent =
    `${seconds}s`;

  if (elapsed >= THUMBS_UP_DURATION) {
    startGame();
  }
}

function startGame() {
  console.log('👍 Confirmado! Começando o jogo!');

  window.history.pushState(
    {},
    '',
    '/game/play'
  );

  window.dispatchEvent(
    new PopStateEvent('popstate')
  );
}


