declare global {

  interface Window {

    cast: {
      framework: {
        CastContext: {
          getInstance(): {
            setOptions(options: {
              receiverApplicationId: string;
              autoJoinPolicy: unknown;
            }): void;

            getCurrentSession():
              | {
                  loadMedia(request: unknown): Promise<void>;
                  endSession(stopCasting: boolean): void;
                }
              | null;
          };
        };
      };
    };

    chrome: {
      cast: {
        AutoJoinPolicy: {
          ORIGIN_SCOPED: unknown;
        };

        media: {
          MediaInfo: new (
            contentId: string,
            contentType: string
          ) => unknown;

          LoadRequest: new (
            mediaInfo: unknown
          ) => unknown;
        };
      };
    };

  }

}

export {};
