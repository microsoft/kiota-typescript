import {
  AccountInfo,
  InteractionType,
  PublicClientApplication,
} from "@azure/msal-browser";

export interface MSALBrowserAuthenticationConfig {
  publicClientApplication: PublicClientApplication;
  account: AccountInfo;
  interactionType: InteractionType;
  readonly scopes: string[];
}
