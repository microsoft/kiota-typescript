export class MockAadTokenProvider {
	constructor(private readonly mockAccessToken: string) {}

	public getToken(resourceEndpoint: string, useCachedToken?: boolean | undefined): Promise<string> {
		return Promise.resolve(this.mockAccessToken);
	}
}
