let castReady = false;

const RECEIVER_APP_ID = 'F37D7BA1';


// ==========================================
// NAMESPACE DA NOSSA APLICAÇÃO
// ==========================================

export const CAST_NAMESPACE =
  'urn:x-cast:com.movegame.game';


// ==========================================
// INICIALIZA GOOGLE CAST
// ==========================================

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
        RECEIVER_APP_ID,

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


// ==========================================
// VERIFICAR SE CAST ESTÁ DISPONÍVEL
// ==========================================

export function isCastAvailable(): boolean {

  return castReady;

}


// ==========================================
// OBTER SESSÃO ATUAL
// ==========================================

export function getCastSession() {

  if (!castReady) {
    return null;
  }

  const context =
    window.cast.framework.CastContext.getInstance();

  return context.getCurrentSession();

}


// ==========================================
// CONECTAR AO RECEIVER
// ==========================================

export async function startCastSession() {

  if (!castReady) {

    console.warn(
      '⚠️ Google Cast ainda não foi inicializado.'
    );

    return null;
  }


  try {

    const context =
      window.cast.framework.CastContext.getInstance();


    await context.requestSession();


    const session =
      context.getCurrentSession();


    if (!session) {

      console.warn(
        '⚠️ Sessão Cast não foi criada.'
      );

      return null;
    }


    console.log(
      '📺 Conectado ao Move Game Receiver!'
    );


    return session;


  } catch (error) {

    console.error(
      '❌ Erro ao conectar ao Chromecast:',
      error
    );

    return null;

  }

}


// ==========================================
// ENVIAR MENSAGEM PARA A TV
// ==========================================

export async function sendCastMessage(
  message: unknown
) {

  const session =
    getCastSession();


  if (!session) {

    console.warn(
      '⚠️ Nenhuma sessão Cast ativa.'
    );

    return;

  }


  try {

    await session.sendMessage(
      CAST_NAMESPACE,
      message
    );


    console.log(
      '📤 Mensagem enviada para a TV:',
      message
    );


  } catch (error) {

    console.error(
      '❌ Erro ao enviar mensagem para a TV:',
      error
    );

  }

}


// ==========================================
// ENCERRAR CAST
// ==========================================

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
