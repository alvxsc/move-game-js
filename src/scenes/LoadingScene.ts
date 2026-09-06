import '../style.css';
import { renderLoading } from '../components/ui.ts';

export const renderLoadingScene = async () => {
  const { progress, text } = renderLoading();

  // Simulação de carregamento
  for (let i = 0; i <= 100; i += 10) {
    progress.style.width = `${i}%`;
    text.textContent = `${i}%`;

    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Quando terminar o carregamento, vai para o jogo
  window.history.pushState({}, '', '/game');

  const navEvent = new PopStateEvent('popstate');
  window.dispatchEvent(navEvent);
};

