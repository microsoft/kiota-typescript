import type { AllowedHostsValidator } from "./allowedHostsValidator";

/**
 * @interface
 * An AccessTokenProvider implementation retrieves an access token
 * to be used by an AuthenticationProvider implementation.
 */
export interface AccessTokenProvider {
  /**
   * Retrieves an access token for the given target URL.
   * @param {string} url - The target URL.
   * @param {Record<string, unknown>} - The additional authentication context to pass to the authentication library.
   * @returns {Promise<string>} The access token.
   */
  getAuthorizationToken: (
    url?: string,
    additionalAuthenticationContext?: Record<string, unknown>
  ) => Promise<string>;
  /**
   * Retrieves the allowed hosts validator.
   * @returns {AllowedHostsValidator} The allowed hosts validator.
   */
  getAllowedHostsValidator: () => AllowedHostsValidator;
}
