// Types
import { SolidColor, TransparentColor } from '@/UI/components/Color/Color';

export const SOLID_COLORS: SolidColor[] = [
  { name: 'Body', hex: '#0b0e15' },
  { name: 'White', hex: '#ffffff' },
  { name: 'White 60', hex: '#9d9daa' },
  { name: 'White 30', hex: '#54565b' },
  { name: 'White 20', hex: '#394050' },
  { name: 'White 10', hex: '#35333e' },
  { name: 'White 5', hex: '#212027' },
  { name: 'Green 40', hex: '#68f4a0' },
  { name: 'Green 30', hex: '#5ee192' },
  { name: 'Green 20', hex: '#4bb475' },
  { name: 'Green 10', hex: '#132422' },
  { name: 'Purple 30', hex: '#561198' },
  { name: 'Purple 20', hex: '#220f3d' },
  { name: 'Purple 10', hex: '#1a0e2f' },
  { name: 'Red 20', hex: '#ff3f57' },
  { name: 'Red 10', hex: '#3c181e' },
];

export const TRANSPARENT_COLORS: TransparentColor[] = [
  { name: 'White 20%', hex: '#FFFFFF', opacity: 20 },
  { name: 'White 10%', hex: '#FFFFFF', opacity: 10 },
  { name: 'White 5%', hex: '#FFFFFF', opacity: 5 },
  { name: 'Gray 40%', hex: '#000000', opacity: 40 },
  { name: 'Green 70%', hex: '#5ee192', opacity: 70 },
  { name: 'Green 60%', hex: '#5ee192', opacity: 60 },
  { name: 'Green 40%', hex: '#5ee192', opacity: 40 },
  { name: 'Green 20%', hex: '#5ee192', opacity: 20 },
  { name: 'Green 10%', hex: '#5ee192', opacity: 10 },
  { name: 'Purple 80%', hex: '#561198', opacity: 80 },
  { name: 'Purple 70%', hex: '#481080', opacity: 70 },
  { name: 'Purple 30%', hex: '#561198', opacity: 30 },
  { name: 'Red 20%', hex: '#ff3f57', opacity: 20 },
];

export const COMBINED_COLORS = [
  ...SOLID_COLORS.map(color => ({ ...color, type: 'solid' })),
  ...TRANSPARENT_COLORS.map(color => ({ ...color, type: 'transparent' })),
];
