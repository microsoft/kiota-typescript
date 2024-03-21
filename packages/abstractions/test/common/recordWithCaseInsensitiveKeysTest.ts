import { assert, describe, it } from "vitest";

import { createRecordWithCaseInsensitiveKeys } from "../../src/recordWithCaseInsensitiveKeys";

describe("RecordWithCaseInsensitiveKeys", () => {
	it("should create a record with case insensitive keys", () => {
		const record = createRecordWithCaseInsensitiveKeys<number | undefined>();
		assert.isUndefined(record["test"]);
		record["test"] = 47;
		assert.isDefined(record["test"]);
		assert.equal(record["test"], record["TEST"]);
		assert.equal(record["tEst"], record["TeSt"]);

		const record2 = createRecordWithCaseInsensitiveKeys<string>();
		record2["Test-Header-Key"] = "test header value";
		assert.isDefined(record2["Test-Header-Key"]);
		assert.equal(record2["Test-Header-Key"], record2["TEST-HEADER-KEY"]);

		const record3 = createRecordWithCaseInsensitiveKeys<string>();
		record3.Authorization = "bearer token";
		assert.isDefined(record3.Authorization);
		assert.equal(record3.Authorization, record3.AUTHORIZATION);
	});

	it("should delete case insensitive keys", () => {
		const record = createRecordWithCaseInsensitiveKeys<number | undefined>();
		assert.isUndefined(record["test"]);
		record["test"] = 47;
		assert.isDefined(record["test"]);
		delete record["TEST"];
		assert.isUndefined(record["test"]);

		const record2 = createRecordWithCaseInsensitiveKeys<string>();
		record2.Authorization = "bearer token";
		assert.isDefined(record2.Authorization);
		delete record2.AUTHORIZATION;
		assert.isUndefined(record2.Authorization);
	});
});
