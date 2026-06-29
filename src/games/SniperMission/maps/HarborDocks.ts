import Phaser from 'phaser';
import { CONSTANTS } from '../constants';

export class HarborDocks {
  static draw(scene: Phaser.Scene) {
    const { WORLD_WIDTH, WORLD_HEIGHT, COLORS } = CONSTANTS;
    
    // Sky
    const sky = scene.add.graphics();
    sky.fillStyle(0x0a1a1a);
    sky.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    sky.setScrollFactor(0);

    // Midground
    const mg = scene.add.graphics();
    mg.fillStyle(0x16213e);
    mg.fillRect(200, 300, 600, 400); // Warehouse
    
    // Crane
    mg.fillStyle(0x333333);
    mg.fillRect(1400, 200, 20, 500); // Crane pillar
    mg.fillRect(1200, 200, 400, 20); // Crane arm
    mg.fillRect(1300, 220, 5, 300); // Cable
    mg.setScrollFactor(0.6);

    // Foreground
    const fg = scene.add.graphics();
    fg.fillStyle(0x3e2723); // Wood dock
    fg.fillRect(0, WORLD_HEIGHT - 60, WORLD_WIDTH, 60);

    // Containers
    const colors = [0xaa0000, 0x0000aa, 0x00aa00, 0xdd8800];
    for(let i=0; i<8; i++) {
      fg.fillStyle(colors[i % 4]);
      fg.fillRect(100 + i * 160, WORLD_HEIGHT - 160, 150, 100);
    }
    
    // 2nd row containers
    fg.fillStyle(0xaa0000);
    fg.fillRect(260, WORLD_HEIGHT - 260, 150, 100);
    fg.fillStyle(0x00aa00);
    fg.fillRect(420, WORLD_HEIGHT - 260, 150, 100);

    fg.setScrollFactor(1.0);
  }

  static getWaypoints() {
    return [
      { x: 200, y: 660 }, { x: 500, y: 660 }, { x: 800, y: 660 }, { x: 1200, y: 660 },
      { x: 300, y: 460 }, { x: 500, y: 460 }, // Top of container
      { x: 1400, y: 200 }, { x: 1300, y: 520 } // Crane
    ];
  }
}
