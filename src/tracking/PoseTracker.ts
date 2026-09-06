import {
  FilesetResolver,
  PoseLandmarker,
} from '@mediapipe/tasks-vision';

export class PoseTracker {
  private poseLandmarker: PoseLandmarker | null = null;

  private video: HTMLVideoElement;

  constructor(video: HTMLVideoElement) {
    this.video = video;
  }

  async initialize() {
    console.log('Initializing Pose Landmarker...');

    // 1. Runtime do MediaPipe
    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm'
    );

    console.log('Vision WASM loaded');

    // 2. Modelo de detecção de corpo
    this.poseLandmarker =
      await PoseLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
          },

          runningMode: 'VIDEO',

          numPoses: 1,

          minPoseDetectionConfidence: 0.5,

          minPosePresenceConfidence: 0.5,

          minTrackingConfidence: 0.5,
        }
      );

    console.log('Pose Landmarker initialized');
  }

  detect() {
    if (!this.poseLandmarker) {
      return null;
    }

    return this.poseLandmarker.detectForVideo(
      this.video,
      performance.now()
    );
  }
}
