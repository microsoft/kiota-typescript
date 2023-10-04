import { assert } from "chai";
import { BackingStore, isBackingStoreEnabled } from "../../../src/store";
import { Model } from "./backedModelProxyTest";

describe('isBackingStoreEnabled', () => {
  it('should return true for a BackedModel', () => {
    // Arrange
    const fakeBackingStore = {} as BackingStore;
    const model: Model = { backingStore: fakeBackingStore};

    // Act
    const result = isBackingStoreEnabled(model);

    // Assert
    assert.equal(result, true);
  });

  it('should return false for an object without a backingStore property', () => {
    // Arrange
    const obj = { name: 'Bob' };

    // Act
    const result = isBackingStoreEnabled(obj);

    // Assert
    assert.equal(result, false);
  });

  it('should return false for a string', () => {
    // Arrange
    const obj = 'test';

    // Act
    const result = isBackingStoreEnabled(obj);

    // Assert
    assert.equal(result, false);
  });

  it('should return false for a number', () => {
    // Arrange
    const obj = 123;

    // Act
    const result = isBackingStoreEnabled(obj);

    // Assert
    assert.equal(result, false);
  });

  it('should return false for a boolean', () => {
    // Arrange
    const obj = true;

    // Act
    const result = isBackingStoreEnabled(obj);

    // Assert
    assert.equal(result, false);
  });

  it('should return false for an array', () => {
    // Arrange
    const obj = [1, 2, 3];

    // Act
    const result = isBackingStoreEnabled(obj);

    // Assert
    assert.equal(result, false);
  });

  it('should return false for a function', () => {
    // Arrange
    const obj = () => {};

    // Act
    const result = isBackingStoreEnabled(obj);

    // Assert
    assert.equal(result, false);
  });
});