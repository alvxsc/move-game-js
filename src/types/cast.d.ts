declare global {

  interface Window {

    cast: {

      framework: {

        CastContext: {

          getInstance(): {

            setOptions(
              options: {
                receiverApplicationId: string;
                autoJoinPolicy: unknown;
              }
            ): void;


            requestSession(): Promise<void>;


            getCurrentSession():
              | {

                  sendMessage(
                    namespace: string,
                    message: unknown
                  ): Promise<void>;


                  endSession(
                    stopCasting: boolean
                  ): void;

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

      };

    };

  }

}


export {};