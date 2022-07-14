import { BaseBearerTokenAuthenticationProvider } from "@microsoft/kiota-abstractions";

import { MSALBrowserAccessTokenProvder } from "./msalBrowserAccessTokenProvider";
import { MSALBrowserAuthenticationConfig } from "./msalBrowserAuthenticationConfig";

export class MSALBrowserAuthenticationProvider extends BaseBearerTokenAuthenticationProvider {
  /**
   *@constructor
   *@param msalBrowserAuthenticationConfig The MSALBrowser public client application, scopes, account type and interaction type to use for authentication.
   *@param allowedHosts The allowed hosts to use for authentication.
   */
  public constructor(
    msalBrowserAuthenticationConfig: MSALBrowserAuthenticationConfig,
    allowedHosts: Set<string>
  ) {
    super(
      new MSALBrowserAccessTokenProvder(
        msalBrowserAuthenticationConfig,
        allowedHosts
      )
    );
  }
}
