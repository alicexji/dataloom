export interface DataPoint {
  [key: string]: any;
}

export type ArtStyle = 
  | 'data-grid-composition'
  | 'radial-pathway'
  | 'shape-overlap'
  | 'connected-grid'
  | 'flow-field'
  | 'particle-system'
  | 'geometric-grid'
  | 'organic-blob'
  | 'noise-landscape'
  | 'translucent-discs'
  | 'structural-dots';

export interface ArtSettings {
  palette: string[];
  density: number;
  speed: number;
  randomness: number;
  mapping: {
    size?: string;
    color?: string;
    motion?: string;
  };
}

export interface Artwork {
  id: string;
  title: string;
  description: string;
  tags: string[];
  style: ArtStyle;
  settings: ArtSettings;
  dataSummary: string;
  timestamp: number;
  thumbnail?: string;
}
