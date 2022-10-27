import {
  AccessTokenProvider,
  AllowedHostsValidator,
  validateProtocol,
} from "@microsoft/kiota-abstractions";
import { AadTokenProvider } from "@microsoft/sp-http";

export class AzureAdSpfxAccessTokenProvider implements AccessTokenProvider {
  private readonly allowedHostsValidator: AllowedHostsValidator;

  /**
   *@constructor
   *@param tokenProvider The tokenProvider provided by the SharePoint framework
   *@param applicationIdUri The application ID URI of the Azure AD App that we want to Authenticate
   *@param allowedHosts The allowed hosts to use for authentication.
   *@param useCachedToken Allows the developer to specify if cached tokens should be returned.
   */
  public constructor(
    private readonly tokenProvider: AadTokenProvider,
    private readonly applicationIdUri: string,
    allowedHosts: Set<string> = new Set<string>([
      "graph.microsoft.com",
      "graph.microsoft.us",
      "dod-graph.microsoft.us",
      "graph.microsoft.de",
      "microsoftgraph.chinacloudapi.cn",
      "canary.graph.microsoft.com",
    ]),
    private readonly useCachedToken?: boolean
  ) {
    if (!tokenProvider) {
      throw new Error("parameter tokenProvider cannot be null");
    }
    if (!applicationIdUri) {
      throw new Error("applicationIdUri cannot be null or empty");
    }
    this.allowedHostsValidator = new AllowedHostsValidator(allowedHosts);
  }

  /**
   * @inheritdoc
   */
  public getAuthorizationToken = async (
    url?: string,
    additionalAuthenticationContext?: Record<string, unknown>): Promise<string> => {            
        if (!url || !this.allowedHostsValidator.isUrlHostValid(url)) {
          return "";
        }
        
        validateProtocol(url);

        const accessToken: string = await this.tokenProvider.getToken(
            this.applicationIdUri,
            this.useCachedToken
        );

        return accessToken ?? "";
  };

  /**
   * @inheritdoc
   */
  public getAllowedHostsValidator = () => this.allowedHostsValidator;
}
