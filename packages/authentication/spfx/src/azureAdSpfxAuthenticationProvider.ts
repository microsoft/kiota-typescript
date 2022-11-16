import { BaseBearerTokenAuthenticationProvider } from "@microsoft/kiota-abstractions";
import { AadTokenProvider } from "@microsoft/sp-http";
import { AzureAdSpfxAccessTokenProvider } from "./azureAdSpfxAccessTokenProvider";
import { ObservabilityOptions, ObservabilityOptionsImpl } from "./observabilityOptions";

export class AzureAdSpfxAuthenticationProvider extends BaseBearerTokenAuthenticationProvider {
  /**
   *@constructor
   *@param tokenProvider The tokenProvider provided by the SharePoint framework
   *@param applicationIdUri The application ID URI of the Azure AD App that we want to Authenticate
   *@param allowedHosts The allowed hosts to use for authentication.
   *@param useCachedToken Allows the developer to specify if cached tokens should be returned.
   */
  public constructor(
    tokenProvider: AadTokenProvider,
    applicationIdUri: string,
    allowedHosts: Set<string> = new Set<string>([
      "graph.microsoft.com",
      "graph.microsoft.us",
      "dod-graph.microsoft.us",
      "graph.microsoft.de",
      "microsoftgraph.chinacloudapi.cn",
      "canary.graph.microsoft.com",
    ]),
    useCachedToken?: boolean,
    observabilityOptions: ObservabilityOptions = new ObservabilityOptionsImpl()
  ) {
    super(
      new AzureAdSpfxAccessTokenProvider(
        tokenProvider,
        applicationIdUri,
        allowedHosts,
        useCachedToken,
        observabilityOptions
    ));
  }
}
