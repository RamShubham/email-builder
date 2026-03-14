import OuteServicesTrackSDK from 'oute-services-track-sdk';

type GetCreditsPayload = {
  access_token: string;
  workspace_id: string;
};

type DeductCreditsPayload = {
  access_token: string;
  workspace_id: string;
};

export class CreditService {
  private static getCreditsInstance({ access_token }: { access_token: string }) {
    const url = process.env.OUTE_SERVER;

    if (!url) {
      throw new Error('OUTE_SERVER environment variable is not set');
    }

    const params = {
      url,
      token: access_token,
    };

    const creditsInstance = new OuteServicesTrackSDK(params);
    return creditsInstance;
  }

  static async getCredits({ access_token, workspace_id }: GetCreditsPayload) {
    try {
      console.log("access_token", access_token)
      const creditsInstance = this.getCreditsInstance({ access_token });

      const query = {
        externalId: workspace_id,
        summaryOnly: true,
      };

      const { result } = await creditsInstance.getCredits(query);
      return result;
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.log('Could not get credits: ', error);
      const message = error?.message || String(error);
      throw new Error(`Could not get credits: ${message}`);
    }
  }

  static async deductCredits({ access_token, workspace_id }: DeductCreditsPayload) {
    try {
      const creditsInstance = this.getCreditsInstance({ access_token });

      const payload = {
        type: 'api_calls',
        externalId: workspace_id,
        amount: 1,
      };

      const response = await creditsInstance.useCredits(payload);
      return response;
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('Credit deduction failed:', error);
      const message = error?.message || String(error);
      throw new Error(`Credit deduction failed: ${message}`);
    }
  }
}

