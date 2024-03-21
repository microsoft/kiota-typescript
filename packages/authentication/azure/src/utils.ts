export const inBrowserEnv = (): boolean => {
	try {
		return !!!Buffer && !!!process;
	} catch (err) {
		return err instanceof ReferenceError;
	}
};
