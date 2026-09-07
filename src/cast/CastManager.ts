let castReady = false;

const RECEIVER_APP_ID = 'F37D7BA1';

export const CAST_NAMESPACE =
  'urn:x-cast:com.movegame.game';


// ==========================================
// TIPOS
// ==========================================

interface CastSession {
  sendMessage(
    namespace: string,
    message: unknown
  ): Promise<void>;

  endSession(
    stopCasting: boolean
  ): void;
}


interface CastContext {
  setOptions(
    options: CastOptions
  ): void;

  getCurrentSession():
    CastSession | null;

  endCurrentSession(
    stopCasting: boolean
  ): void;
}


interface CastOptions {
  receiverApplicationId: string;

  autoJoinPolicy?: unknown;
}


interface CastFramework {

  CastContext: {
    getInstance(): CastContext;
  };

  CastOptions: new () => CastOptions;

}


function getCastFramework():
  CastFramework | null {

  const cast =
    (window as unknown as {
      cast?: {
        framework?: CastFramework;
      };
    }).cast;


  if (!cast?.framework) {

    console.warn(
      '⚠️ Google Cast Framework ainda não está disponível.'
    );

    return null;

  }


  return cast.framework;

}


// ==========================================
// INICIALIZAR CAST
// ==========================================

export function initializeCast() {

  if (castReady) {
    return;
  }


  console.log(
    '📺 Inicializando Google Cast...'
  );


  const framework =
    getCastFramework();


  if (!framework) {
    return;
  }


  try {

    const context =
      framework.CastContext.getInstance();


    const options =
      new framework.CastOptions();


    options.receiverApplicationId =
      RECEIVER_APP_ID;


    context.setOptions(
      options
    );


    castReady = true;


    console.log(
      '✅ Google Cast inicializado'
    );


    console.log(
      '📺 Receiver:',
      RECEIVER_APP_ID
    );


  } catch (error) {

    console.error(
      '❌ Erro ao inicializar Google Cast:',
      error
    );

  }

}


// ==========================================
// VERIFICAR DISPONIBILIDADE
// ==========================================

export function isCastAvailable(): boolean {

  return castReady;

}


// ==========================================
// SESSÃO ATUAL
// ==========================================

export function getCastSession():
  CastSession | null {

  const framework =
    getCastFramework();


  if (!framework || !castReady) {
    return null;
  }


  const context =
    framework.CastContext.getInstance();


  return context.getCurrentSession();

}


// ==========================================
// ENVIAR MENSAGEM
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
      '📤 Mensagem enviada para TV:',
      message
    );


  } catch (error) {

    console.error(
      '❌ Erro ao enviar mensagem para TV:',
      error
    );

  }

}


// ==========================================
// ENCERRAR CAST
// ==========================================

export function stopCasting() {

  const framework =
    getCastFramework();


  if (!framework || !castReady) {
    return;
  }


  const context =
    framework.CastContext.getInstance();


  context.endCurrentSession(
    true
  );


  console.log(
    '📺 Cast encerrado'
  );

}
