import Phaser from 'phaser';
import { CONSTANTS } from '../constants';

export class ScopeOverlay {
  private scene: Phaser.Scene;
  private graphics!: Phaser.GameObjects.Graphics;
  private timeText!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  create() {
    this.graphics = this.scene.add.graphics();
    this.graphics.setScrollFactor(0);
    this.graphics.setDepth(900); // Below HUD but above scene
    this.graphics.setVisible(false);

    this.timeText = this.scene.add.text(0, 0, '00:00', {
      fontFamily: 'VT323, monospace',
      fontSize: '24px',
      color: '#00e5ff',
      backgroundColor: '#000000aa',
      padding: { x: 4, y: 2 }
    }).setOrigin(0.5).setScrollFactor(0).setDepth(901).setVisible(false);
  }

  draw(breathRatio: number, windStrength: number, windDir: number, timeRemaining: number = 0) {
    const { width, height } = this.scene.scale;
    const cx = width / 2;
    const cy = height / 2;

    this.graphics.clear();
    
    const zoom = this.scene.cameras.main.zoom;
    
    // Scale down rendering by zoom factor so it looks normal-sized when the camera scales it up
    const radius = CONSTANTS.SCOPE_RADIUS / zoom;
    const thickness = Math.max(width, height) * 2 / zoom;
    
    // Outer mask (solid black outside scope)
    this.graphics.lineStyle(thickness, 0x000000, 1);
    this.graphics.strokeCircle(cx, cy, radius + thickness / 2);

    // Inner shadow/blur effect for the lens edge
    for (let i = 0; i < 15; i++) {
      this.graphics.lineStyle(3 / zoom, 0x000000, (15 - i) / 15 * 0.8);
      this.graphics.strokeCircle(cx, cy, radius - (i * 3) / zoom);
    }

    // Thin crosshair across the whole scope
    this.graphics.lineStyle(1 / zoom, 0x222222, 0.8);
    this.graphics.moveTo(cx - radius, cy);
    this.graphics.lineTo(cx + radius, cy);
    this.graphics.moveTo(cx, cy - radius);
    this.graphics.lineTo(cx, cy + radius);
    this.graphics.strokePath();

    // Thick crosshair pieces
    this.graphics.lineStyle(6 / zoom, 0x111111, 1);
    const gap = radius * 0.55; // The gap in the middle where it gets thin
    
    this.graphics.moveTo(cx - radius, cy);
    this.graphics.lineTo(cx - gap, cy);
    
    this.graphics.moveTo(cx + radius, cy);
    this.graphics.lineTo(cx + gap, cy);
    
    this.graphics.moveTo(cx, cy - radius);
    this.graphics.lineTo(cx, cy - gap);
    
    this.graphics.moveTo(cx, cy + radius);
    this.graphics.lineTo(cx, cy + gap);
    this.graphics.strokePath();

    // Center Dot
    this.graphics.fillStyle(0xff3333, 1);
    this.graphics.fillCircle(cx, cy, 3 / zoom);
    
    // Tiny black outline for the red dot
    this.graphics.lineStyle(1 / zoom, 0x000000, 1);
    this.graphics.strokeCircle(cx, cy, 3 / zoom);

    // Keep breath meter functional but make it stealthy grey
    this.graphics.lineStyle(2 / zoom, 0x444444, 0.5);
    this.graphics.strokeRect(cx + radius + 15 / zoom, cy - 50 / zoom, 6 / zoom, 100 / zoom);
    
    // Breath fill
    const breathColor = breathRatio > 0.3 ? 0x888888 : 0xff3333;
    this.graphics.fillStyle(breathColor, 0.8);
    this.graphics.fillRect(cx + radius + 15 / zoom, cy + 50 / zoom - (100 * breathRatio) / zoom, 6 / zoom, (100 * breathRatio) / zoom);

    // Update Time Text
    const m = Math.floor(timeRemaining / 60000);
    const s = Math.floor((timeRemaining % 60000) / 1000);
    this.timeText.setText(`T-${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    this.timeText.setPosition(cx, cy - radius - 20 / zoom);
    this.timeText.setScale(1 / zoom);
    if (timeRemaining < 30000) this.timeText.setColor('#ff3333');
    else this.timeText.setColor('#00e5ff');
  }

  setVisible(visible: boolean) {
    this.graphics.setVisible(visible);
    this.timeText.setVisible(visible);
  }
}
