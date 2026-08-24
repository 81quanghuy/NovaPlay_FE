/**
 * Test Framework Primitives & Expect Matcher Engine
 * High-performance, zero-dependency, requirement-driven testing harness.
 */

type TestFn = () => void | Promise<void>;
type HookFn = () => void | Promise<void>;

export interface TestCase {
  name: string;
  fn: TestFn;
}

export interface TestSuite {
  name: string;
  tests: TestCase[];
  beforeEachHooks: HookFn[];
  afterEachHooks: HookFn[];
  beforeAllHooks: HookFn[];
  afterAllHooks: HookFn[];
}

if (!(globalThis as any).__TEST_SUITES__) {
  (globalThis as any).__TEST_SUITES__ = [];
}

export const activeSuites: TestSuite[] = (globalThis as any).__TEST_SUITES__;
let currentSuite: TestSuite | null = null;

export function describe(name: string, fn: () => void) {
  const suite: TestSuite = {
    name,
    tests: [],
    beforeEachHooks: [],
    afterEachHooks: [],
    beforeAllHooks: [],
    afterAllHooks: [],
  };
  const prevSuite = currentSuite;
  currentSuite = suite;
  activeSuites.push(suite);
  fn();
  currentSuite = prevSuite;
}

export function it(name: string, fn: TestFn) {
  if (!currentSuite) {
    describe('Default Suite', () => {
      it(name, fn);
    });
    return;
  }
  currentSuite.tests.push({ name, fn });
}

export const test = it;

export function beforeEach(fn: HookFn) {
  if (currentSuite) {
    currentSuite.beforeEachHooks.push(fn);
  }
}

export function afterEach(fn: HookFn) {
  if (currentSuite) {
    currentSuite.afterEachHooks.push(fn);
  }
}

export function beforeAll(fn: HookFn) {
  if (currentSuite) {
    currentSuite.beforeAllHooks.push(fn);
  }
}

export function afterAll(fn: HookFn) {
  if (currentSuite) {
    currentSuite.afterAllHooks.push(fn);
  }
}

export interface MockFn {
  (...args: any[]): any;
  calls: any[][];
  results: { type: 'return' | 'throw'; value: any }[];
  mockReturnValue: (val: any) => MockFn;
  mockResolvedValue: (val: any) => MockFn;
  mockRejectedValue: (err: any) => MockFn;
  mockImplementation: (fn: (...args: any[]) => any) => MockFn;
  mockClear: () => void;
  mockReset: () => void;
}

export function fn(impl?: (...args: any[]) => any): MockFn {
  let currentImpl = impl || (() => undefined);
  const mock: any = function (...args: any[]) {
    mock.calls.push(args);
    try {
      const result = currentImpl(...args);
      mock.results.push({ type: 'return', value: result });
      return result;
    } catch (e) {
      mock.results.push({ type: 'throw', value: e });
      throw e;
    }
  };

  mock.calls = [] as any[][];
  mock.results = [] as { type: 'return' | 'throw'; value: any }[];

  mock.mockReturnValue = (val: any) => {
    currentImpl = () => val;
    return mock;
  };
  mock.mockResolvedValue = (val: any) => {
    currentImpl = () => Promise.resolve(val);
    return mock;
  };
  mock.mockRejectedValue = (err: any) => {
    currentImpl = () => Promise.reject(err);
    return mock;
  };
  mock.mockImplementation = (newImpl: (...args: any[]) => any) => {
    currentImpl = newImpl;
    return mock;
  };
  mock.mockClear = () => {
    mock.calls = [];
    mock.results = [];
  };
  mock.mockReset = () => {
    mock.calls = [];
    mock.results = [];
    currentImpl = () => undefined;
  };

  return mock as MockFn;
}

export function spyOn<T extends object, K extends keyof T>(obj: T, method: K): MockFn {
  const original = obj[method];
  const mock = fn(
    typeof original === 'function' ? (original as unknown as (...args: any[]) => any).bind(obj) : undefined
  );
  obj[method] = mock as unknown as T[K];
  return mock;
}

function deepEqual(a: any, b: any): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null || typeof a !== 'object') return false;

  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (a instanceof RegExp && b instanceof RegExp) return a.toString() === b.toString();
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }
  return true;
}

class MatcherContext {
  constructor(
    private actual: any,
    private isNot: boolean = false
  ) {}

  get not(): MatcherContext {
    return new MatcherContext(this.actual, !this.isNot);
  }

  private assert(condition: boolean, message: string, expectedVal?: any) {
    const passed = this.isNot ? !condition : condition;
    if (!passed) {
      const prefix = this.isNot ? 'Expected value NOT to' : 'Expected value to';
      throw new Error(
        `${prefix} ${message}. Actual: ${JSON.stringify(this.actual)}${
          expectedVal !== undefined ? `, Expected: ${JSON.stringify(expectedVal)}` : ''
        }`
      );
    }
  }

  toBe(expected: any) {
    this.assert(Object.is(this.actual, expected), `strictly equal (Object.is)`, expected);
  }

  toEqual(expected: any) {
    this.assert(deepEqual(this.actual, expected), `deeply equal`, expected);
  }

  toBeTruthy() {
    this.assert(Boolean(this.actual), `be truthy`);
  }

  toBeFalsy() {
    this.assert(!this.actual, `be falsy`);
  }

  toBeNull() {
    this.assert(this.actual === null, `be null`);
  }

  toBeUndefined() {
    this.assert(this.actual === undefined, `be undefined`);
  }

  toBeDefined() {
    this.assert(this.actual !== undefined, `be defined`);
  }

  toContain(item: any) {
    if (typeof this.actual === 'string') {
      this.assert(this.actual.includes(item), `contain substring "${item}"`);
    } else if (Array.isArray(this.actual)) {
      this.assert(
        this.actual.some((el) => deepEqual(el, item)),
        `contain item`,
        item
      );
    } else if (this.actual && typeof this.actual === 'object') {
      this.assert(item in this.actual, `contain key "${item}"`);
    } else {
      this.assert(false, `be iterable/container for`, item);
    }
  }

  toHaveLength(expectedLen: number) {
    const len = this.actual?.length;
    this.assert(len === expectedLen, `have length ${expectedLen} (got ${len})`);
  }

  toBeGreaterThan(expected: number) {
    this.assert(this.actual > expected, `be greater than ${expected}`);
  }

  toBeGreaterThanOrEqual(expected: number) {
    this.assert(this.actual >= expected, `be greater than or equal to ${expected}`);
  }

  toBeLessThan(expected: number) {
    this.assert(this.actual < expected, `be less than ${expected}`);
  }

  toBeLessThanOrEqual(expected: number) {
    this.assert(this.actual <= expected, `be less than or equal to ${expected}`);
  }

  toMatch(regex: RegExp | string) {
    const re = typeof regex === 'string' ? new RegExp(regex) : regex;
    this.assert(re.test(String(this.actual)), `match pattern ${re}`);
  }

  toThrow(expectedError?: string | RegExp | Error) {
    let threw = false;
    let thrownError: any = null;

    if (typeof this.actual !== 'function') {
      throw new Error('actual must be a function to test toThrow');
    }

    try {
      this.actual();
    } catch (e) {
      threw = true;
      thrownError = e;
    }

    if (expectedError) {
      if (typeof expectedError === 'string') {
        this.assert(
          threw && String(thrownError?.message || thrownError).includes(expectedError),
          `throw error containing "${expectedError}"`,
          thrownError?.message
        );
      } else if (expectedError instanceof RegExp) {
        this.assert(
          threw && expectedError.test(String(thrownError?.message || thrownError)),
          `throw error matching ${expectedError}`,
          thrownError?.message
        );
      } else {
        this.assert(threw, `throw an error`);
      }
    } else {
      this.assert(threw, `throw an error`);
    }
  }

  toHaveBeenCalled() {
    const isMock = this.actual && typeof this.actual.mockClear === 'function';
    if (!isMock) {
      throw new Error('actual must be a mock function from fn() or spyOn()');
    }
    this.assert(this.actual.calls.length > 0, `have been called at least once`);
  }

  toHaveBeenCalledTimes(expectedTimes: number) {
    const isMock = this.actual && typeof this.actual.mockClear === 'function';
    if (!isMock) {
      throw new Error('actual must be a mock function from fn() or spyOn()');
    }
    const calls = this.actual.calls.length;
    this.assert(calls === expectedTimes, `have been called ${expectedTimes} times (got ${calls})`);
  }

  toHaveBeenCalledWith(...expectedArgs: any[]) {
    const isMock = this.actual && typeof this.actual.mockClear === 'function';
    if (!isMock) {
      throw new Error('actual must be a mock function from fn() or spyOn()');
    }
    const matched = this.actual.calls.some((callArgs: any[]) => deepEqual(callArgs, expectedArgs));
    this.assert(matched, `have been called with args`, expectedArgs);
  }
}

export function expect(actual: any): MatcherContext {
  return new MatcherContext(actual);
}
