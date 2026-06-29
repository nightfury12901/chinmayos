import Phaser from 'phaser';
import { CONSTANTS } from '../constants';

export class NeonDistrict {
  static draw(scene: Phaser.Scene) {
    const { WORLD_WIDTH, WORLD_HEIGHT, COLORS } = CONSTANTS;
    
    // Sky
    const sky = scene.add.graphics();
    sky.fillGradientStyle(0x050510, 0x050510, 0x2a0a2a, 0x2a0a2a, 1);
    sky.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    sky.setScrollFactor(0); // Sky doesn't move

    // Background Layer (Parallax 0.3)
    const bg = scene.add.graphics();
    bg.fillStyle(0x0d0d1a);
    bg.fillRect(100, 300, 200, 420);
    bg.fillRect(400, 200, 300, 520);
    bg.fillRect(900, 100, 250, 620);
    bg.fillRect(1500, 250, 400, 470);
    bg.setScrollFactor(0.3);

    // Midground Layer (Parallax 0.6)
    const mg = scene.add.graphics();
    mg.fillStyle(0x16213e);
    mg.fillRect(0, 400, 300, 320); // Bldg 1
    mg.fillRect(500, 350, 400, 370); // Bldg 2
    mg.fillRect(1100, 450, 500, 270); // Bldg 3
    mg.fillRect(1800, 300, 300, 420); // Bldg 4
    
    // Windows on midground
    mg.fillStyle(COLORS.WINDOW_COLD);
    for (let i = 0; i < 5; i++) mg.fillRect(550, 380 + i * 40, 20, 20);
    for (let i = 0; i < 5; i++) mg.fillRect(600, 380 + i * 40, 20, 20);
    
    mg.fillStyle(COLORS.WINDOW_WARM);
    for (let i = 0; i < 3; i++) mg.fillRect(1200, 480 + i * 50, 30, 20);

    mg.setScrollFactor(0.6);

    // Neon Signs (Midground)
    const signText1 = scene.add.text(550, 350, 'RAMEN', { fontFamily: 'VT323', fontSize: '32px', color: '#ff00aa' }).setScrollFactor(0.6);
    const signText2 = scene.add.text(1200, 430, 'CYBERNETICS', { fontFamily: 'VT323', fontSize: '24px', color: '#00ffff' }).setScrollFactor(0.6);

    // Foreground Layer (Parallax 1.0)
    const fg = scene.add.graphics();
    // Street
    fg.fillStyle(0x111111);
    fg.fillRect(0, WORLD_HEIGHT - 50, WORLD_WIDTH, 50);
    
    // Sidewalk
    fg.fillStyle(0x222222);
    fg.fillRect(0, WORLD_HEIGHT - 70, WORLD_WIDTH, 20);

    // Streetlights
    fg.fillStyle(0x333333);
    for (let x = 200; x < WORLD_WIDTH; x += 600) {
      fg.fillRect(x, WORLD_HEIGHT - 250, 10, 180); // Pole
      fg.fillStyle(0xffee00);
      fg.fillRect(x - 20, WORLD_HEIGHT - 250, 50, 10); // Light fixture
      
      // Light cone
      fg.fillStyle(0xffee00, 0.2);
      fg.beginPath();
      fg.moveTo(x + 5, WORLD_HEIGHT - 240);
      fg.lineTo(x - 100, WORLD_HEIGHT - 70);
      fg.lineTo(x + 110, WORLD_HEIGHT - 70);
      fg.fillPath();
      fg.fillStyle(0x333333); // reset
    }

    fg.setScrollFactor(1.0);
  }

  static getWaypoints() {
    return [
      // Street level
      { x: 300, y: 650 }, { x: 600, y: 650 }, { x: 900, y: 650 }, 
      { x: 1200, y: 650 }, { x: 1500, y: 650 }, { x: 1800, y: 650 },
      // Elevated / Rooftops
      { x: 600, y: 350 }, { x: 700, y: 350 }, { x: 800, y: 350 }
    ];
  }
}
