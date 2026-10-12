export function extractHtml(text: string): string | null {
  const fenced = text.match(/```html\s*([\s\S]*?)(?:```|$)/i);
  if (fenced?.[1]?.includes('<')) return fenced[1].trim();
  const start = text.search(/<!doctype html|<html[\s>]/i);
  return start >= 0 ? text.slice(start).replace(/```\s*$/, '').trim() : null;
}

export function assistantSummary(text: string): string {
  const start = text.search(/```html|<!doctype html|<html[\s>]/i);
  return start >= 0 ? text.slice(0, start).trim() || 'Your creation is taking shape in the preview.' : text;
}