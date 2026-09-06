import {
  FilesetResolver,
  HandLandmarker,
} from '@mediapipe/tasks-vision';

export class HandTracker {
  private handLandmarker: HandLandmarker | null = null;

  private video: HTMLVideoElement;

  constructor(video: HTMLVideoElement) {
    this.video = video;
  }

  async initialize() {
    console.log('Initializing Hand Landmarker...');

    const vision = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm'
    );

    this.handLandmarker =
      await HandLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
          },

          runningMode: 'VIDEO',

          numHands: 2,

          minHandDetectionConfidence: 0.5,

          minHandPresenceConfidence: 0.5,

          minTrackingConfidence: 0.5,
        }
      );

    console.log('Hand Landmarker initialized');
  }

  detect() {
    if (!this.handLandmarker) {
      return null;
    }

    return this.handLandmarker.detectForVideo(
      this.video,
      performance.now()
    );
  }
}

import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

export function isThumbsUp(
  landmarks: NormalizedLandmark[]
): boolean {

  if (landmarks.length < 21) {
    return false;
  }

  const thumbTip = landmarks[4];

  const indexTip = landmarks[8];
  const middleTip = landmarks[12];
  const ringTip = landmarks[16];
  const pinkyTip = landmarks[20];

  const wrist = landmarks[0];

  /*
   * O polegar precisa estar acima do pulso.
   */
  const thumbIsUp =
    thumbTip.y < wrist.y;

  /*
   * Os outros dedos precisam estar
   * relativamente abaixo da ponta do polegar.
   */
  const fingersAreDown =
    indexTip.y > thumbTip.y &&
    middleTip.y > thumbTip.y &&
    ringTip.y > thumbTip.y &&
    pinkyTip.y > thumbTip.y;

  return thumbIsUp && fingersAreDown;
}