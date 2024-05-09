/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import { describe, expect, test } from "vitest";
import { inNodeEnv } from "../../src/utils/inNodeEnv";

describe("Utility functions", () => {
	test.runIf(inNodeEnv())("inNodeEnv - should return true in node environment", () => {
		expect(inNodeEnv()).to.be.true;
	});

	test.runIf(!inNodeEnv())("inNodeEnv - should return false in node environment", () => {
		expect(inNodeEnv()).to.be.false;
		expect(typeof window).not.toBe(undefined);
	});
});
