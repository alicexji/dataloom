export const PALETTES = [
  { name: 'Monochrome', colors: ['#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#FFFFFF'] },
  { name: 'Avant-Garde', colors: ['#FF3E00', '#000000', '#FFFFFF', '#FFD700', '#0000FF'] },
  { name: 'Ethereal', colors: ['#E0C3FC', '#8EC5FC', '#F093FB', '#F5576C', '#4FACFE'] },
  { name: 'Brutalist', colors: ['#1A1A1A', '#F0F0F0', '#FF0000', '#00FF00', '#0000FF'] },
  { name: 'Organic', colors: ['#2D5A27', '#4A7C44', '#76A36F', '#A3C9A8', '#D1E8D5'] },
];

export const MOCK_PORTFOLIO: any[] = [
  {
    id: '1',
    title: 'Circadian Rhythms',
    description: 'A visualization of 30 days of sleep data, mapping deep sleep cycles to flow field turbulence.',
    tags: ['sleep', 'biometric', 'flow-field'],
    style: 'flow-field',
    dataSummary: '30 entries, 4 variables',
    timestamp: Date.now() - 86400000 * 2,
  },
  {
    id: '2',
    title: 'Market Volatility',
    description: 'Real-time stock market fluctuations transformed into a chaotic particle system.',
    tags: ['finance', 'market', 'particles'],
    style: 'particle-system',
    dataSummary: '500 data points',
    timestamp: Date.now() - 86400000 * 5,
  },
  {
    id: '3',
    title: 'Urban Density',
    description: 'Population data across 10 major cities represented as a geometric grid of varying intensities.',
    tags: ['demographics', 'urban', 'grid'],
    style: 'geometric-grid',
    dataSummary: '10 cities, 12 metrics',
    timestamp: Date.now() - 86400000 * 10,
  }
];
