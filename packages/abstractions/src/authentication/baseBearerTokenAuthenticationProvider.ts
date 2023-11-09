import { RequestHeaders } from "../requestHeaders";
import { type RequestInformation } from "../requestInformation";
import type { AccessTokenProvider } from "./accessTokenProvider";
import type { AuthenticationProvider } from "./authenticationProvider";

/** Provides a base class for implementing AuthenticationProvider for Bearer token scheme. */
export class BaseBearerTokenAuthenticationProvider
  implements AuthenticationProvider {
  private static readonly authorizationHeaderKey = "Authorization";

  /**
   *
   * @param accessTokenProvider
   */
  public constructor(
    public readonly accessTokenProvider: AccessTokenProvider
  ) {}

  public authenticateRequest = async (
    request: RequestInformation,
    additionalAuthenticationContext?: Record<string, unknown>
  ): Promise<void> => {
    if (!request) {
      throw new Error("request info cannot be null");
    }
    if (
      additionalAuthenticationContext &&
      additionalAuthenticationContext["claims"] &&
      request.headers.has(
        BaseBearerTokenAuthenticationProvider.authorizationHeaderKey
      )
    ) {
      request.headers.delete(
        BaseBearerTokenAuthenticationProvider.authorizationHeaderKey
      );
    }
    if (
      !request.headers ||
      !request.headers.has(
        BaseBearerTokenAuthenticationProvider.authorizationHeaderKey
      )
    ) {
      const token = await this.accessTokenProvider.getAuthorizationToken(
        request.URL,
        additionalAuthenticationContext
      );
      if (!request.headers) {
        request.headers = new RequestHeaders();
      }
      if (token) {
        request.headers.tryAdd(
          BaseBearerTokenAuthenticationProvider.authorizationHeaderKey,
          `Bearer ${token}`);
      }
    }
  };
}
