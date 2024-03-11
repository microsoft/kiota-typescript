import {describe, expect, test} from 'vitest';
import { inBrowserEnv } from '../src/utils';

describe('Utility functions', ()=>{
    test.runIf(inBrowserEnv())('inBrowserEnv - should return true in browser environment', ()=>{
        expect(inBrowserEnv()).to.be.true
    })

    test.runIf(!inBrowserEnv())('inBrowserEnv - should return false in node environment', ()=>{
        expect(inBrowserEnv()).to.be.false
        expect(typeof window).not.toBe(undefined)
    })
})