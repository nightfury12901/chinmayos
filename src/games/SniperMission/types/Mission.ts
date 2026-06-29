export interface Mission {
  id: string;
  name: string;
  type: 'SILENT' | 'HIGH_VALUE' | 'TIMED';
  timeLimit: number; // in seconds
  targetId: string;
  clues: string[];
  scansUsed: number;
}

export interface Target {
  id: string;
  traits: string[];
}
