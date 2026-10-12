import { describe, expect, it } from 'vitest';
import { extractHtml } from './generated-site';
describe('Generated preview', () => {
  it('extracts complete generated HTML', () => {
    expect(extractHtml('Done\n```html\n<html><body>Hello</body></html>\n```')).toBe('<html><body>Hello</body></html>');
  });
  it('extracts partial HTML while streaming', () => {
    expect(extractHtml('```html\n<!doctype html><html><body>')).toBe('<!doctype html><html><body>');
  });
  it('does not treat normal answers as sites', () => {
    expect(extractHtml('Hello there')).toBeNull();
  });
});