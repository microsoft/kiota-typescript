import {
  AuthenticationResult,
  InteractionRequiredAuthError,
  InteractionType,
} from "@azure/msal-browser";
import {
  AccessTokenProvider,
  AllowedHostsValidator,
  validateProtocol,
} from "@microsoft/kiota-abstractions";

import { MSALBrowserAuthenticationConfig } from "./msalBrowserAuthenticationConfig";

/** Access token provider that leverages the MSALBrowser Identity library to retrieve an access token. */
export class MSALBrowserAccessTokenProvder implements AccessTokenProvider {
  /**
   *@param msalBrowserAuthenticationConfig The MSALBrowser public client application, scopes, account type and interaction type to use for authentication.
   *@param allowedHosts The allowed hosts to use for authentication.
   */
  public constructor(
    private msalBrowserAuthenticationConfig: MSALBrowserAuthenticationConfig,
    allowedHosts: Set<string>
  ) {
    if (!msalBrowserAuthenticationConfig) {
      throw new Error(
        "Please pass valid PublicClientApplication instance, AccountInfo, Scopes and InteractionType"
      );
    }
    this.allowedHostsValidator = new AllowedHostsValidator(allowedHosts);
  }
  private readonly allowedHostsValidator: AllowedHostsValidator;

  /**
   * @inheritdoc
   */
  public async getAuthorizationToken(url?: string): Promise<string> {
    if (!url || !this.allowedHostsValidator.isUrlHostValid(url)) {
      return "";
    }
    validateProtocol(url);

    const scopes =
      this.msalBrowserAuthenticationConfig &&
      this.msalBrowserAuthenticationConfig.scopes;
    const account =
      this.msalBrowserAuthenticationConfig &&
      this.msalBrowserAuthenticationConfig.account;
    const error = new Error();
    if (!scopes || scopes.length === 0) {
      error.name = "Empty Scopes";
      error.message = "Scopes cannot be empty, Please provide scopes";
      throw error;
    }
    try {
      const response: AuthenticationResult =
        await this.msalBrowserAuthenticationConfig.publicClientApplication.acquireTokenSilent(
          {
            scopes,
            account,
          }
        );
      if (!response || !response.accessToken) {
        error.name = "Access token is undefined";
        error.message =
          "Received empty access token from PublicClientApplication";
        throw error;
      }
      return response.accessToken;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        if (
          this.msalBrowserAuthenticationConfig.interactionType ===
          InteractionType.Redirect
        ) {
          this.msalBrowserAuthenticationConfig.publicClientApplication.acquireTokenRedirect(
            { scopes }
          );
        } else if (
          this.msalBrowserAuthenticationConfig.interactionType ===
          InteractionType.Popup
        ) {
          const response: AuthenticationResult =
            await this.msalBrowserAuthenticationConfig.publicClientApplication.acquireTokenPopup(
              { scopes }
            );
          return response.accessToken;
        }
      }
      throw error;
    }
  }
  /**
   * @inheritdoc
   */
  public getAllowedHostsValidator = () => this.allowedHostsValidator;
}
