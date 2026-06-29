import Phaser from 'phaser';
import { CONSTANTS } from '../../constants';
import { NPCManager } from './NPCManager';
import { NPC } from '../entities/NPC';

export class BulletSystem {
  private scene: Phaser.Scene;
  private npcManager: NPCManager;

  constructor(scene: Phaser.Scene, npcManager: NPCManager) {
    this.scene = scene;
    this.npcManager = npcManager;
  }

  fire(startX: number, startY: number, windStrength: number, windDir: number, onHit: (success: boolean, hitNPC: NPC | null) => void) {
    // Calculate drift
    // Since the camera is looking at the scene, we just apply X drift based on wind.
    // Let's assume the target distance is roughly constant for simplicity, but we can simulate it over a short delay.
    
    // Wind drift = windStrength * driftFactor (this is usually applied to the reticle in real-time, 
    // but we can apply it to the final hit point).
    const drift = windStrength * 10 * CONSTANTS.DRIFT_FACTOR * 100 * windDir; // scaled for pixels
    const hitX = startX + drift;
    const hitY = startY;

    // Visual trail
    const graphics = this.scene.add.graphics();
    graphics.lineStyle(1, 0xffffff, 0.8);
    // Draw line from bottom center of screen to hit point to simulate 3D depth
    const { width, height } = this.scene.scale;
    const worldBottomCenter = this.scene.cameras.main.getWorldPoint(width / 2, height);
    
    graphics.moveTo(worldBottomCenter.x, worldBottomCenter.y);
    graphics.lineTo(hitX, hitY);
    graphics.strokePath();

    this.scene.tweens.add({
      targets: graphics,
      alpha: 0,
      duration: 200,
      onComplete: () => graphics.destroy()
    });

    // Check collision against all NPCs
    const npcs = this.scene.physics.overlapRect(hitX - 4, hitY - 8, 8, 16);
    
    if (npcs.length > 0) {
      // We hit something
      const hitObj = npcs[0].gameObject as NPC;
      
      // Animate hit
      this.scene.tweens.add({
        targets: hitObj,
        angle: 90,
        y: hitObj.y + 10,
        duration: 200
      });

      hitObj.config.routine = []; // Stop moving

      if (hitObj.config.isTarget) {
        onHit(true, hitObj);
      } else {
        onHit(false, hitObj);
      }
    } else {
      onHit(false, null);
    }
  }
}
