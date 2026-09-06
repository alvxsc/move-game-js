const app = document.querySelector<HTMLDivElement>('#app')!;

export function StartGame(element: HTMLButtonElement) {
  element.addEventListener('click', () => {
    console.log('Starting game...');

    window.history.pushState({}, '', '/loading');

    const navEvent = new PopStateEvent('popstate');
    window.dispatchEvent(navEvent);
  });
}

export function renderLoading() {
  app.innerHTML = `
    <section id="center">
      <h1>Move Game</h1>
      <p>Loading...</p>

      <div class="loading-container">
        <div class="loading-bar">
          <div id="loading-progress"></div>
        </div>

        <span id="loading-text">0%</span>
      </div>
    </section>
  `;

  return {
    progress: document.querySelector<HTMLDivElement>('#loading-progress')!,
    text: document.querySelector<HTMLSpanElement>('#loading-text')!,
  };
}
