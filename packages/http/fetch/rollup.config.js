/**
 * -------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.
 * See License in the project root for license information.
 * -------------------------------------------------------------------------------------------
 */

import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";

const config = [
	{
		input: ["dist/es/test/browser/index.js"],
		output: {
			file: "dist/es/test/index.js",
			format: "esm",
			name: "BrowserTest",
		},
		plugins: [
			commonjs(),
			resolve({
				browser: true,
				preferBuiltins: false,
			}),
		],
	},
];

export default config;
