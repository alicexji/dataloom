export const PALETTES = [
  { name: 'Swiss Modern', colors: ['#FF3E00', '#000000', '#FFFFFF', '#0047AB', '#FFD700'] },
  { name: 'Neo-Bauhaus', colors: ['#E63946', '#F1FAEE', '#A8DADC', '#457B9D', '#1D3557'] },
  { name: 'Cyberpunk', colors: ['#00FF41', '#001F3F', '#FF00FF', '#00FFFF', '#FFD700'] },
  { name: 'Pastel Brutalist', colors: ['#FADADD', '#B0E0E6', '#98FB98', '#DDA0DD', '#2F4F4F'] },
  { name: 'High Contrast', colors: ['#000000', '#FFFFFF', '#FF0000', '#FFFF00', '#0000FF'] },
  { name: 'Structural Dots', colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE'] },
];

export const MOCK_PORTFOLIO: any[] = [
  {
    id: '1',
    title: 'Structural Dots #01',
    description: 'A dense grid of circles and connections inspired by Seohyo, mapping data to circle size and line thickness.',
    tags: ['structure', 'grid', 'structural-dots'],
    style: 'structural-dots',
    dataSummary: '200 data points',
    timestamp: Date.now() - 86400000 * 1,
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: '2',
    title: 'Grid Composition #01',
    description: 'A structural grid mapping demographic data to line directions and cell colors.',
    tags: ['urban', 'demographics', 'data-grid-composition'],
    style: 'data-grid-composition',
    dataSummary: '100 data points',
    timestamp: Date.now() - 86400000 * 2,
    thumbnail: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: '3',
    title: 'Radial Expansion',
    description: 'Growth patterns visualized as circles leaving colored pathways from a central origin.',
    tags: ['growth', 'nature', 'radial-pathway'],
    style: 'radial-pathway',
    dataSummary: '50 growth metrics',
    timestamp: Date.now() - 86400000 * 5,
    thumbnail: 'https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: '4',
    title: 'Shape Overlap #04',
    description: 'A dense composition of overlapping geometric shapes fading in and out based on activity levels.',
    tags: ['activity', 'abstract', 'shape-overlap'],
    style: 'shape-overlap',
    dataSummary: 'Real-time activity stream',
    timestamp: Date.now() - 86400000 * 10,
    thumbnail: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: '5',
    title: 'Network Synapse',
    description: 'A connected grid representing global server communication nodes.',
    tags: ['tech', 'network', 'connected-grid'],
    style: 'connected-grid',
    dataSummary: 'Node connectivity matrix',
    timestamp: Date.now() - 86400000 * 12,
    thumbnail: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: '6',
    title: 'Circadian Rhythms',
    description: 'A visualization of 30 days of sleep data, mapping deep sleep cycles to flow field turbulence.',
    tags: ['sleep', 'biometric', 'flow-field'],
    style: 'flow-field',
    dataSummary: '30 entries, 4 variables',
    timestamp: Date.now() - 86400000 * 15,
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop'
  },
];
