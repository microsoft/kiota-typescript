/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

export class MockAadTokenProvider {
	constructor(private readonly mockAccessToken: string) {}

	public getToken(resourceEndpoint: string, useCachedToken?: boolean | undefined): Promise<string> {
		return Promise.resolve(this.mockAccessToken);
	}
}
