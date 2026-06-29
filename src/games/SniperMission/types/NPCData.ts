export type BehaviorType = 
  | 'WALKER' 
  | 'SMOKER' 
  | 'GUARD' 
  | 'SITTER' 
  | 'PHONE_USER' 
  | 'TALKER';

export interface RoutineAction {
  action: 'walk' | 'idle' | 'smoke' | 'sit' | 'phone' | 'talk' | 'look_around';
  duration: number; // in ms
  waypointIndex: number;
}

export interface NPCConfig {
  id: string;
  behavior: BehaviorType;
  jacketColor: string; // kept for legacy if needed, but not used visually
  hasBriefcase: boolean;
  hasHat?: boolean;
  hasGlasses?: boolean;
  hasSmoking?: boolean;
  isTarget: boolean;
  moveSpeed: number;
  routine: RoutineAction[];
  height: 'short' | 'average' | 'tall';
  build: 'slim' | 'average' | 'heavy';
  movement: 'normal' | 'fast' | 'irregular';
}
