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

		// Reject leading or trailing Unicode whitespace (e.g. '\u00a0' NBSP) not stripped by C0/ASCII whitespace trim.
		if (/^\s|\s$/.test(trimmedUrl)) {
			return false;
		}

		// Check authority / bare host for malformed percent-encoding sequences (e.g. 'http%').
		// Literal percent signs in paths and queries (e.g. '/items/100%?q=50%') are valid and handled by WHATWG URL parser.
		const schemeMatch = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\/(.*)$/.exec(trimmedUrl);
		const authorityCandidate = schemeMatch ? schemeMatch[1].split(/[/?#]/)[0] : trimmedUrl.startsWith("//") ? trimmedUrl.slice(2).split(/[/?#]/)[0] : !trimmedUrl.startsWith("/") && !trimmedUrl.startsWith("?") && !trimmedUrl.startsWith("#") ? trimmedUrl.split(/[/?#]/)[0] : undefined;

		if (authorityCandidate && /%(?![0-9a-fA-F]{2})/.test(authorityCandidate)) {
			return false;
		}

		const hasDocument = typeof document !== "undefined";
		const hasWindow = typeof window !== "undefined";
		const docBase = hasDocument && document.baseURI && document.baseURI !== "about:blank" ? document.baseURI : undefined;
		const winBase = hasWindow && window.location ? window.location.href || (window.location.protocol && window.location.host ? `${window.location.protocol}//${window.location.host}` : undefined) : undefined;
		const browserBase = docBase || winBase;

		let parsed: URL;
		try {
			if (browserBase) {
				// In browser environments, WHATWG fetch resolves relative URLs (including root-relative '/api',
				// path-relative 'api/users', and bare scheme-less paths like 'httpbin.org/path') against the document
				// base URL. We resolve against browserBase so validation checks the exact destination fetch will use.
				// Absolute URLs with a scheme and protocol-relative references (e.g. '//example.com') are also
				// handled according to WHATWG URL resolution against the base.
				parsed = new URL(trimmedUrl, browserBase);
			} else {
				// In non-browser environments (Node.js), relative paths without a base cannot be resolved.
				if ((trimmedUrl.startsWith("/") && !trimmedUrl.startsWith("//")) || trimmedUrl.startsWith("./") || trimmedUrl.startsWith("../") || trimmedUrl.startsWith("?") || trimmedUrl.startsWith("#")) {
					return false;
				}
				// Preserve existing supported scheme-less host behavior in Node.js.
				const hasScheme = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//i.test(trimmedUrl);
				const candidate = hasScheme ? trimmedUrl : trimmedUrl.startsWith("//") ? `https:${trimmedUrl}` : `https://${trimmedUrl}`;

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
