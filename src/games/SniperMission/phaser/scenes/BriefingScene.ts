import Phaser from 'phaser';
import { MissionSystem } from '../systems/MissionSystem';

export class BriefingScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BriefingScene' });
  }

  create(data: { mapId: string, mission: any }) {
    this.cameras.main.setBackgroundColor('#0a0a0f');
    const { width, height } = this.scale;

    const clues = data.mission?.clues || ['■ TRAITS UNKNOWN', '■ EXPECT HEAVY RESISTANCE'];
    const clueLines = clues.map((c: string) => `│  ■ ${c.padEnd(31, ' ')} │`);

    const text = [
      '┌─────────────────────────────────────┐',
      `│  CONTRACT #00${Phaser.Math.Between(10,99)} — CLASSIFIED`.padEnd(38, ' ') + '│',
      '│  OPERATIVE: USER                    │',
      `│  LOCATION: ${data.mapId || 'NEON DISTRICT'}`.padEnd(38, ' ') + '│',
      '├─────────────────────────────────────┤',
      '│  TARGET PROFILE                     │',
      '│                                     │',
      ...clueLines,
      '│                                     │',
      '│  WARNING: CIVILIAN CASUALTIES       │',
      '│  WILL RESULT IN CONTRACT FAILURE.   │',
      '├─────────────────────────────────────┤',
      `│  [TIP] HOLD RIGHT-CLICK TO SCOPE IN`.padEnd(38, ' ') + '│',
      `│  AND HOVER OVER TARGET FOR 0.5`.padEnd(38, ' ') + '│',
      `│  SECONDS TO INITIATE A BIO-SCAN.`.padEnd(38, ' ') + '│',
      '└─────────────────────────────────────┘',
      '',
      '[PRESS ENTER TO DEPLOY]'
    ];

    let y = 100;
    text.forEach(line => {
      this.add.text(width / 2 - 300, y, line, { fontFamily: 'VT323, monospace', fontSize: '24px', color: '#00cc33' });
      y += 28;
    });

    this.input.keyboard?.on('keydown-ENTER', () => {
      this.scene.start('GameScene', { mapId: data.mapId, mission: data.mission });
    });

    this.input.on('pointerdown', () => {
      this.scene.start('GameScene', { mapId: data.mapId, mission: data.mission });
    });
  }
}
