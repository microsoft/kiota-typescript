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
		this.allowedHosts = this.normalizeHosts(allowedHosts);
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
		this.allowedHosts = this.normalizeHosts(allowedHosts);
	}
	/**
	 * Checks whether the provided host is valid.
	 * @param url The url to check.
	 * @returns True if the host is valid, false otherwise.
	 */
	public isUrlHostValid(url: string): boolean {
		if (!url) return false;
		// Strip leading and trailing C0 controls (0x00-0x1F) and ASCII space (0x20) per WHATWG URL parsing.
		// Preserves Unicode whitespace (e.g. \u00a0 NBSP) so it is not stripped before validation.
		const trimmedUrl = this.trimC0AndAsciiWhitespace(url);
		if (!trimmedUrl) return false;
		// WHATWG URL parsing removes these characters anywhere in the input. Reject them
		// before parsing so validation sees the same destination that fetch would use.
		if (/[\t\r\n]/.test(trimmedUrl)) return false;

		if (/^https?:(?!\/\/)/i.test(trimmedUrl)) {
			return false;
		}

		const hasDocument = typeof document !== "undefined";
		const hasWindow = typeof window !== "undefined";
		const browserBase = (hasDocument && document.baseURI) || (hasWindow && window.location ? window.location.href || (window.location.protocol && window.location.host ? `${window.location.protocol}//${window.location.host}` : undefined) : undefined);

		let defaultProtocol = "https:";
		if (browserBase) {
			try {
				defaultProtocol = new URL(browserBase).protocol || "https:";
			} catch {
				defaultProtocol = hasWindow && window.location?.protocol ? window.location.protocol : "https:";
			}
		} else if (hasWindow && window.location?.protocol) {
			defaultProtocol = window.location.protocol;
		}

		let parsed: URL;
		try {
			const isBrowserRelative = Boolean(browserBase) && ((trimmedUrl.startsWith("/") && !trimmedUrl.startsWith("//")) || trimmedUrl.startsWith("?") || trimmedUrl.startsWith("#") || trimmedUrl.startsWith("./") || trimmedUrl.startsWith("../"));

			if (isBrowserRelative) {
				parsed = new URL(trimmedUrl, browserBase);
			} else {
				const hasScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//i.test(trimmedUrl);
				const candidate = hasScheme ? trimmedUrl : trimmedUrl.startsWith("//") ? `${defaultProtocol}${trimmedUrl}` : `${defaultProtocol}//${trimmedUrl}`;

				parsed = new URL(candidate);
			}
		} catch {
			return false;
		}

		// reject userinfo outright, it can be used to spoof the host
		if (!parsed.hostname || parsed.username || parsed.password) {
			return false;
		}
		if (this.allowedHosts.size === 0) {
			return true;
		}
		return this.isHostValid(parsed.hostname);
	}
	private isHostValid(host: string): boolean {
		const normalizedHost = host.toLowerCase();
		if (this.allowedHosts.has(normalizedHost)) {
			return true;
		}
		return Array.from(this.allowedHosts).some((allowedHost) => allowedHost.startsWith(".") && normalizedHost.endsWith(allowedHost));
	}
	private normalizeHosts(hostsToNormalize: Set<string>): Set<string> {
		return new Set(Array.from(hostsToNormalize, (host) => host.trim().toLowerCase()).filter((host) => host.length > 0));
	}

	private validateHosts(hostsToValidate: Set<string>) {
		if (!hostsToValidate) {
			throw new Error("hostsToValidate cannot be null");
		}
		if (hostsToValidate.size > 0 && this.normalizeHosts(hostsToValidate).size === 0) {
			throw new Error("hostsToValidate cannot normalize to an empty set from a non-empty allowlist");
		}
		hostsToValidate.forEach((host) => {
			const trimmedHost = host?.trim().toLowerCase();
			if (trimmedHost.startsWith("http://") || trimmedHost.startsWith("https://")) {
				throw new Error("host should not contain http or https prefix");
			}
		});
	}

	private trimC0AndAsciiWhitespace(value: string): string {
		let start = 0;
		let end = value.length;
		while (start < end && value.charCodeAt(start) <= 0x20) {
			start++;
		}
		while (end > start && value.charCodeAt(end - 1) <= 0x20) {
			end--;
		}
		return start > 0 || end < value.length ? value.slice(start, end) : value;
	}
}
