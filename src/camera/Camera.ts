let cameraStream: MediaStream | null = null;

export async function startCamera(
  video: HTMLVideoElement
): Promise<MediaStream> {

  if (!cameraStream) {
    cameraStream =
      await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
        },
        audio: false,
      });
  }

  video.srcObject = cameraStream;

  await video.play();

  return cameraStream;
}

export function getCameraStream(): MediaStream | null {
  return cameraStream;
}


