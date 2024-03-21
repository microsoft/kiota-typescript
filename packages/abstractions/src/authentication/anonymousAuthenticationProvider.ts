/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */
import { type RequestInformation } from "../requestInformation";
import { type AuthenticationProvider } from "./authenticationProvider";

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
