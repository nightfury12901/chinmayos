import Phaser from 'phaser';
import { NPCManager } from './NPCManager';
import { NPC } from '../entities/NPC';

export class MissionManager {
  private scene: Phaser.Scene;
  private npcManager: NPCManager;
  public target!: NPC;
  private missionActive: boolean = false;

  constructor(scene: Phaser.Scene, npcManager: NPCManager) {
    this.scene = scene;
    this.npcManager = npcManager;
  }

  generateMission() {
    // Pick a random NPC to be the target
    const targetIndex = Phaser.Math.Between(0, 29);
    this.target = this.npcManager.setTarget(targetIndex) as NPC;
    this.missionActive = true;
    
    // In a full implementation, we would extract clues from this specific NPC
    // (e.g., shirt color, specific routine) to give to the player.
    console.log("Mission Generated. Target acquired.");
  }

  evaluateShot(hitObjects: Phaser.GameObjects.GameObject[], callbacks: any) {
    if (!this.missionActive) return;

    if (hitObjects.length > 0) {
      const hit = hitObjects[0] as any;
      if (hit.isTarget) {
        // Successful hit
        hit.fillColor = 0x00ff00;
        this.missionActive = false;
        
        // Trigger win condition
        if (callbacks?.onScore) callbacks.onScore(5000);
        if (callbacks?.onLevelComplete) callbacks.onLevelComplete();
      } else if (hit instanceof NPC) {
        // Civilian casualty
        hit.fillColor = 0xff0000;
        this.missionActive = false;
        
        // Trigger loss / penalty condition
        if (callbacks?.onDamage) callbacks.onDamage(100);
      }
    }
  }
}
