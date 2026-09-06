export class MovementPlayer {
  private video: HTMLVideoElement;

  constructor(video: HTMLVideoElement) {
    this.video = video;
  }

  load(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const onLoaded = () => {
        cleanup();

        console.log('✅ Movimento carregado');

        resolve();
      };

      const onError = () => {
        cleanup();

        console.error(
          '❌ Erro ao carregar o movimento',
          this.video.error
        );

        reject(this.video.error);
      };

      const cleanup = () => {
        this.video.removeEventListener(
          'loadedmetadata',
          onLoaded
        );

        this.video.removeEventListener(
          'error',
          onError
        );
      };

      this.video.addEventListener(
        'loadedmetadata',
        onLoaded
      );

      this.video.addEventListener(
        'error',
        onError
      );

      this.video.src = src;
      this.video.load();
    });
  }

  async play() {
    try {
      await this.video.play();

      console.log('▶️ Movimento iniciado');
    } catch (error) {
      console.error(
        '❌ Não foi possível iniciar o vídeo:',
        error
      );
    }
  }

  pause() {
    this.video.pause();
  }

  restart() {
    this.video.currentTime = 0;
  }

  get currentTime() {
    return this.video.currentTime;
  }

  get duration() {
    return this.video.duration;
  }

  get progress() {
    if (!this.video.duration) {
      return 0;
    }

    return this.video.duration > 0
      ? this.video.currentTime / this.video.duration
      : 0;
  }

  onTimeUpdate(
    callback: (
      currentTime: number,
      progress: number
    ) => void
  ) {
    this.video.addEventListener(
      'timeupdate',
      () => {
        callback(
          this.currentTime,
          this.progress
        );
      }
    );
  }
}

