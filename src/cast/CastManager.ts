let castReady = false;

const DEFAULT_RECEIVER_APP_ID =
  'CC1AD845';

export function initializeCast() {

  if (castReady) {
    return;
  }

  if (
    typeof window === 'undefined' ||
    !window.cast
  ) {
    console.warn(
      '⚠️ Google Cast SDK ainda não está disponível.'
    );

    return;
  }

  try {

    const context =
      window.cast.framework.CastContext.getInstance();

    context.setOptions({
      receiverApplicationId:
        DEFAULT_RECEIVER_APP_ID,

      autoJoinPolicy:
        window.chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
    });

    castReady = true;

    console.log(
      '📺 Google Cast inicializado'
    );

  } catch (error) {

    console.error(
      '❌ Erro ao inicializar Google Cast:',
      error
    );

  }
}


export function isCastAvailable(): boolean {
  return castReady;
}


export async function startCasting(
  videoUrl: string
) {

  if (!castReady) {

    console.warn(
      '⚠️ Google Cast ainda não foi inicializado.'
    );

    return;
  }

  try {

    const context =
      window.cast.framework.CastContext.getInstance();

    const session =
      context.getCurrentSession();

    if (!session) {

      console.warn(
        '⚠️ Nenhuma sessão Cast ativa.'
      );

      return;
    }

    const mediaInfo =
      new window.chrome.cast.media.MediaInfo(
        videoUrl,
        'video/mp4'
      );

    const request =
      new window.chrome.cast.media.LoadRequest(
        mediaInfo
      );

    await session.loadMedia(request);

    console.log(
      '📺 Vídeo enviado para a TV'
    );

  } catch (error) {

    console.error(
      '❌ Erro ao enviar vídeo para o Chromecast:',
      error
    );

  }
}


export function stopCasting() {

  if (!castReady) {
    return;
  }

  const context =
    window.cast.framework.CastContext.getInstance();

  const session =
    context.getCurrentSession();

  if (session) {
    session.endSession(true);

    console.log(
      '📺 Transmissão encerrada'
    );
  }
}
