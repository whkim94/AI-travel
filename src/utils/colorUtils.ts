export function getLuminance(hexColor: string): number {
  const rgb = parseInt(hexColor.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

export function getContrastColor(hexColor: string): string {
  return getLuminance(hexColor) > 186 ? '#000000' : '#FFFFFF';
}
