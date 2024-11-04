/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

/**
 * Maintains a list of valid hosts and allows authentication providers to
 * check whether a host is valid before authenticating a request
 */
export class AllowedHostsValidator {
	private allowedHosts: Set<string>;
	/**
	 * Creates a new AllowedHostsValidator object with provided values.
	 * @param allowedHosts A list of valid hosts.  If the list is empty, all hosts are valid.
	 */
	public constructor(allowedHosts: Set<string> = new Set<string>()) {
		this.validateHosts(allowedHosts);
		this.allowedHosts = allowedHosts ?? new Set<string>();
	}
	/**
	 * Gets the list of valid hosts.  If the list is empty, all hosts are valid.
	 * @returns A list of valid hosts.  If the list is empty, all hosts are valid.
	 */
	public getAllowedHosts(): string[] {
		return Array.from(this.allowedHosts);
	}
	/**
	 * Sets the list of valid hosts.  If the list is empty, all hosts are valid.
	 * @param allowedHosts A list of valid hosts.  If the list is empty, all hosts are valid.
	 */
	public setAllowedHosts(allowedHosts: Set<string>): void {
		this.validateHosts(allowedHosts);
		this.allowedHosts = allowedHosts;
	}
	/**
	 * Checks whether the provided host is valid.
	 * @param url The url to check.
	 * @returns True if the host is valid, false otherwise.
	 */
	public isUrlHostValid(url: string): boolean {
		if (!url) return false;
		if (this.allowedHosts.size === 0) return true;
		const schemeAndRest = url.split("://");
		if (schemeAndRest.length >= 2) {
			const rest = schemeAndRest[1];
			if (rest) {
				return this.isHostAndPathValid(rest);
			}
		} else if (!url.startsWith("http")) {
			// protocol relative URL domain.tld/path
			return this.isHostAndPathValid(url);
		}
		if (window?.location?.host) {
			return this.allowedHosts.has(window.location.host?.toLowerCase());
		}
		return false;
	}
	private isHostAndPathValid(rest: string): boolean {
		const hostAndRest = rest.split("/");
		if (hostAndRest.length >= 2) {
			const host = hostAndRest[0];
			if (host) {
				return this.allowedHosts.has(host.toLowerCase());
			}
		}
		return false;
	}

	private validateHosts(hostsToValidate: Set<string>) {
		if (!hostsToValidate) {
			throw new Error("hostsToValidate cannot be null");
		}
		hostsToValidate.forEach((host) => {
			if (host.toLowerCase().startsWith("http://") || host.toLowerCase().startsWith("https://")) {
				throw new Error("host should not contain http or https prefix");
			}
		});
	}
}
