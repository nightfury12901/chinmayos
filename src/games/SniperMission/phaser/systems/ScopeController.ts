import Phaser from 'phaser';
import { CONSTANTS } from '../../constants';
import { AudioManager } from './AudioManager';

export class ScopeController {
  private scene: Phaser.Scene;
  public isScoped = false;
  private zoomIndex = 0;
  
  public swayAmount: number;
  private swayFreqX = CONSTANTS.SWAY_FREQUENCY_X;
  private swayFreqY = CONSTANTS.SWAY_FREQUENCY_Y;
  private timeElapsed = 0;
  
  public breathMeter = 100;
  public isHoldingBreath = false;
  private breathEmptyPenaltyTimer = 0;

  constructor(scene: Phaser.Scene, weaponSwayMultiplier: number) {
    this.scene = scene;
    this.swayAmount = CONSTANTS.SWAY_BASE * weaponSwayMultiplier;
  }

  toggleScope() {
    this.isScoped = !this.isScoped;
    
    if (this.isScoped) {
      AudioManager.playScopeIn();
      this.zoomIndex = 0;
      this.applyZoom();
    } else {
      AudioManager.playScopeOut();
      this.scene.cameras.main.setZoom(1);
      // Reset center
      this.scene.cameras.main.centerOn(CONSTANTS.WORLD_WIDTH / 2, CONSTANTS.WORLD_HEIGHT / 2);
    }
    return this.isScoped;
  }

  cycleZoom() {
    if (!this.isScoped) return;
    this.zoomIndex = (this.zoomIndex + 1) % CONSTANTS.ZOOM_LEVELS.length;
    this.applyZoom();
  }

  private applyZoom() {
    this.scene.cameras.main.setZoom(CONSTANTS.ZOOM_LEVELS[this.zoomIndex]);
  }

  getZoomIndex(): number {
    return this.zoomIndex;
  }

  setHoldingBreath(holding: boolean) {
    if (!this.isScoped) return;
    
    // Can only start holding if we have breath
    if (holding && this.breathMeter > 0 && this.breathEmptyPenaltyTimer <= 0) {
      this.isHoldingBreath = true;
    } else {
      this.isHoldingBreath = false;
    }
  }

  update(delta: number, mouseX: number, mouseY: number) {
    if (!this.isScoped) {
      this.isHoldingBreath = false;
      this.breathEmptyPenaltyTimer = 0;
      this.breathMeter = Math.min(100, this.breathMeter + (100 / (CONSTANTS.BREATH_RECHARGE_DURATION / delta)));
      return;
    }

    this.timeElapsed += delta * 0.001;

    // Breath logic
    let currentSway = this.swayAmount;
    
    if (this.breathEmptyPenaltyTimer > 0) {
      this.breathEmptyPenaltyTimer -= delta;
      currentSway *= 2.0; // 200% sway penalty
    } else if (this.isHoldingBreath) {
      currentSway *= 0.1; // 10% sway
      this.breathMeter -= (100 / (CONSTANTS.BREATH_HOLD_DURATION / delta));
      if (this.breathMeter <= 0) {
        this.isHoldingBreath = false;
        this.breathEmptyPenaltyTimer = 1500; // 1.5s penalty
      }
    } else {
      this.breathMeter = Math.min(100, this.breathMeter + (100 / (CONSTANTS.BREATH_RECHARGE_DURATION / delta)));
    }

    // Camera follow mouse with sway
    const targetX = CONSTANTS.WORLD_WIDTH / 2 + (mouseX - this.scene.scale.width / 2) * 2.5;
    const targetY = CONSTANTS.WORLD_HEIGHT / 2 + (mouseY - this.scene.scale.height / 2) * 2.5;

    const swayX = Math.sin(this.timeElapsed * this.swayFreqX) * currentSway;
    const swayY = Math.cos(this.timeElapsed * this.swayFreqY) * currentSway;

    // Smooth camera pan
    this.scene.cameras.main.scrollX += (targetX - this.scene.cameras.main.scrollX - this.scene.scale.width / 2) * 0.1 + swayX;
    this.scene.cameras.main.scrollY += (targetY - this.scene.cameras.main.scrollY - this.scene.scale.height / 2) * 0.1 + swayY;
  }
}
