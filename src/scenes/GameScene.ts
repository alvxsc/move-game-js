import '../style.css';

import { getCameraStream } from '../camera/Camera.ts';
import { MovementPlayer } from '../game/MovimentPlayer.ts';

const app =
  document.querySelector<HTMLDivElement>('#app')!;

export const renderGamePlay = async () => {

  // ==========================================
  // INTERFACE
  // ==========================================

  app.innerHTML = `
    <main id="game-play">

      <!-- Área principal do movimento -->
      <section id="movement-area">

        <div id="movement-video-container">

          <video
            id="movement-video"
            muted
            playsinline
            preload="auto"
          ></video>

          <!-- Barra de progresso -->
          <div id="movement-progress">
            <div id="movement-progress-bar"></div>
          </div>

        </div>

      </section>


      <!-- Câmera do jogador -->
      <div id="player-camera-small">

        <video
          id="player-camera-preview"
          autoplay
          muted
          playsinline
        ></video>

        <div class="camera-label">
          VOCÊ
        </div>

      </div>

    </main>
  `;


  // ==========================================
  // CÂMERA DO JOGADOR
  // ==========================================

  const cameraVideo =
    document.querySelector<HTMLVideoElement>(
      '#player-camera-preview'
    );

  const stream = getCameraStream();

  if (cameraVideo && stream) {

    cameraVideo.srcObject = stream;

    try {
      await cameraVideo.play();
    } catch (error) {
      console.error(
        '❌ Não foi possível reproduzir a câmera:',
        error
      );
    }
  }


  // ==========================================
  // VÍDEO DO MOVIMENTO
  // ==========================================

  const movementVideo =
    document.querySelector<HTMLVideoElement>(
      '#movement-video'
    );

  if (!movementVideo) {
    console.error(
      '❌ Elemento #movement-video não encontrado.'
    );

    return;
  }


  // ==========================================
  // MOVEMENT PLAYER
  // ==========================================

  const movementPlayer =
    new MovementPlayer(movementVideo);


  // ==========================================
  // BARRA DE PROGRESSO
  // ==========================================

  const progressBar =
    document.querySelector<HTMLDivElement>(
      '#movement-progress-bar'
    );


  // ==========================================
  // ATUALIZAÇÃO DO PROGRESSO
  // ==========================================

  if (progressBar) {

    movementPlayer.onTimeUpdate(
      (_, progress) => {

        const percentage =
          Math.min(
            Math.max(progress, 0),
            1
          ) * 100;

        progressBar.style.width =
          `${percentage}%`;
      }
    );
  }


  // ==========================================
  // CARREGAMENTO DO VÍDEO
  // ==========================================

  try {

    await movementPlayer.load(
      '/videos/moviment-01.mp4'
    );

    console.log(
      '🎬 Vídeo carregado com sucesso'
    );

  } catch (error) {

    console.error(
      '❌ Não foi possível carregar o vídeo:',
      error
    );

    return;
  }


  // ==========================================
  // REPRODUÇÃO
  // ==========================================

  await movementPlayer.play();
};
