import Phaser from 'phaser';
import { CONSTANTS } from '../constants';

export class RooftopGardens {
  static draw(scene: Phaser.Scene) {
    const { WORLD_WIDTH, WORLD_HEIGHT, COLORS } = CONSTANTS;
    
    // Sky
    const sky = scene.add.graphics();
    sky.fillStyle(0x050510);
    sky.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    
    // Stars
    sky.fillStyle(0xffffff, 0.8);
    for(let i=0; i<100; i++) {
      sky.fillCircle(Phaser.Math.Between(0, WORLD_WIDTH), Phaser.Math.Between(0, 400), Math.random() > 0.8 ? 2 : 1);
    }
    sky.setScrollFactor(0);

    // Midground (City far below)
    const mg = scene.add.graphics();
    mg.fillStyle(0x222233, 0.5);
    for(let i=0; i<20; i++) {
      mg.fillRect(Phaser.Math.Between(0, WORLD_WIDTH), Phaser.Math.Between(500, WORLD_HEIGHT), Phaser.Math.Between(30, 80), Phaser.Math.Between(50, 200));
    }
    mg.setScrollFactor(0.3);

    // Foreground Rooftop
    const fg = scene.add.graphics();
    
    // Main roof floor
    fg.fillStyle(0x333333);
    fg.fillRect(100, WORLD_HEIGHT - 100, WORLD_WIDTH - 200, 100);
    
    // Glass railing
    fg.fillStyle(0x88ccff, 0.2);
    fg.fillRect(100, WORLD_HEIGHT - 150, WORLD_WIDTH - 200, 50);
    fg.lineStyle(2, 0xaaaaaa);
    fg.strokeRect(100, WORLD_HEIGHT - 150, WORLD_WIDTH - 200, 50);

    // Garden Planters
    fg.fillStyle(0x442211);
    fg.fillRect(300, WORLD_HEIGHT - 130, 200, 30);
    fg.fillStyle(0x00aa44);
    fg.fillCircle(350, WORLD_HEIGHT - 140, 25);
    fg.fillCircle(400, WORLD_HEIGHT - 140, 30);
    fg.fillCircle(450, WORLD_HEIGHT - 140, 25);

    // Pergola
    fg.fillStyle(0x553322);
    fg.fillRect(900, WORLD_HEIGHT - 300, 10, 200); // left post
    fg.fillRect(1300, WORLD_HEIGHT - 300, 10, 200); // right post
    fg.fillRect(850, WORLD_HEIGHT - 300, 500, 10); // roof

    // Bar
    fg.fillStyle(0x111111);
    fg.fillRect(1600, WORLD_HEIGHT - 150, 300, 50);

    fg.setScrollFactor(1.0);
  }

  static getWaypoints() {
    return [
      { x: 200, y: 620 }, { x: 400, y: 620 }, { x: 700, y: 620 }, 
      { x: 1000, y: 620 }, { x: 1200, y: 620 }, // under pergola
      { x: 1700, y: 620 }, { x: 1800, y: 620 } // at bar
    ];
  }
}
