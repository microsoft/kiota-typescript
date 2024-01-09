const localhostStrings: Set<string> = new Set<string>(["localhost", "[::1]", "::1", "127.0.0.1"]);

export function validateProtocol(url: string): void {
    if(!isLocalhostUrl(url) && !url.toLocaleLowerCase().startsWith("https://") && !windowUrlStartsWithHttps()) {
        throw new Error("Authentication scheme can only be used with https requests");
    }
}
function windowUrlStartsWithHttps(): boolean {
    // @ts-ignore
    return typeof window !== "undefined" && typeof window.location !== "undefined" && (window.location.protocol as string).toLowerCase() !== "https:";
}

export function isLocalhostUrl(urlString: string) {
    try {
        const url = new URL(urlString);
        return localhostStrings.has(url.hostname);
    } catch (e) {
        console.error(e);
        return false;
    }
}