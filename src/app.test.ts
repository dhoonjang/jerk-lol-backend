import app from './app';

describe('app', () => {
  test('hello world', () => {
    expect(app()).toBe('Hello World!');
  });
});
