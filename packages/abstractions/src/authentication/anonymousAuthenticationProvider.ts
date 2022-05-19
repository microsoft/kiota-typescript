import { RequestInformation } from "../requestInformation";
import { AuthenticationProvider } from "./authenticationProvider";

/** This authentication provider does not perform any authentication.   */
export class AnonymousAuthenticationProvider implements AuthenticationProvider {
  public authenticateRequest = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _: RequestInformation,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _2?: Record<string, unknown>
  ): Promise<void> => {
    return Promise.resolve();
  };
}
