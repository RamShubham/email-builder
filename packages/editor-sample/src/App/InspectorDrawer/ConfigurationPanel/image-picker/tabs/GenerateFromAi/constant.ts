export type AspectRatio = 'landscape' | 'square' | 'portrait';

export const STAGE_MESSAGES = [
  'Analyzing your prompt...',
  'Creating composition...',
  'Generating details...',
  'Adding final touches...',
  'Almost there...',
];

export const HELPFUL_TIPS = [
  'Tip: Add art style keywords like \'watercolor\' or \'photorealistic\' for better results',
  'Tip: Describe lighting and mood for more atmospheric images',
  'Tip: Mention specific colors to guide the palette of your image',
  'Tip: Include perspective details like "bird\'s eye view" or "close-up" for composition',
  'Tip: Reference a time of day like "golden hour" or "midnight" for lighting effects',
  'Tip: Add texture descriptions like "glossy", "matte", or "textured" for more detail',
];

export const ASPECT_RATIOS: { value: AspectRatio; label: string; w: number; h: number }[] = [
  { value: 'landscape', label: 'Landscape', w: 24, h: 16 },
  { value: 'square', label: 'Square', w: 18, h: 18 },
  { value: 'portrait', label: 'Portrait', w: 16, h: 24 },
];
