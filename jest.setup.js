import '@testing-library/jest-dom';
import dotenv from 'dotenv';

// ✅ Load test environment variables
dotenv.config({ path: '.env.test' });

// ✅ Mock browser-only APIs. Only run these if we're in jsdom
if (typeof window !== 'undefined') {
  window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };

  window.gtag = jest.fn();
}

// ✅ Basic Next.js API mocks
class HeadersMock {
  constructor(init = {}) {
    this.map = new Map(Object.entries(init));
  }
  append(name, value) {
    this.map.set(name, value);
  }
  get(name) {
    return this.map.get(name);
  }
  set(name, value) {
    this.map.set(name, value);
  }
  has(name) {
    return this.map.has(name);
  }
  delete(name) {
    this.map.delete(name);
  }
  forEach(callback) {
    this.map.forEach((value, name) => callback(value, name, this));
  }
}

class RequestMock {
  constructor(input, init = {}) {
    this.url = input;
    this.method = init.method || 'GET';
    this.headers = new HeadersMock(init.headers);
    this._body = init.body;
  }
  async json() {
    return JSON.parse(this._body || '{}');
  }
  async text() {
    return this._body || '';
  }
}

class ResponseMock {
  constructor(body, init = {}) {
    this._body = body;
    this.status = init.status || 200;
    this.ok = this.status >= 200 && this.status < 300;
    this.headers = new HeadersMock(init.headers);
  }
  async json() {
    return JSON.parse(this._body);
  }
  async text() {
    return this._body;
  }
}

globalThis.Request = RequestMock;
globalThis.Response = ResponseMock;
globalThis.Headers = HeadersMock;

// ✅ Global fetch mock (safe default)
if (!global.fetch) {
  global.fetch = jest.fn();
}
