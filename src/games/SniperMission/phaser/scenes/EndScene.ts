import Phaser from 'phaser';

export class EndScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EndScene' });
  }

  create(data: { success: boolean, timeout?: boolean, scansUsed?: number }) {
    this.cameras.main.setBackgroundColor('#000000');
    const { width, height } = this.scale;

    const title = data.success ? 'CONTRACT FULFILLED' : (data.timeout ? 'TIME EXPIRED' : 'CIVILIAN CASUALTY');
    const color = data.success ? '#00ff41' : '#ff00aa';

    this.add.text(width / 2, height / 2 - 80, title, {
      fontFamily: '"Press Start 2P"',
      fontSize: '48px',
      color: color
    }).setOrigin(0.5);

    if (data.success) {
      let bonusName = 'TRIGGER HAPPY';
      let bonusVal = 0;
      let scans = data.scansUsed || 0;
      
      if (scans <= 3) { bonusName = 'GHOST OPERATIVE'; bonusVal = 300; }
      else if (scans <= 7) { bonusName = 'PROFESSIONAL'; bonusVal = 150; }
      else if (scans <= 12) { bonusName = 'STANDARD'; bonusVal = 50; }
      
      this.add.text(width / 2, height / 2, 'XP +500   CREDITS +1000', {
        fontFamily: 'VT323',
        fontSize: '32px',
        color: '#ffee00'
      }).setOrigin(0.5);

      this.add.text(width / 2, height / 2 + 40, `BONUS [${bonusName}]: +$${bonusVal}`, {
        fontFamily: 'VT323',
        fontSize: '28px',
        color: '#00e5ff'
      }).setOrigin(0.5);
    } else {
      this.add.text(width / 2, height / 2 + 30, 'CONTRACT FAILED', {
        fontFamily: 'VT323',
        fontSize: '32px',
        color: '#ff0000'
      }).setOrigin(0.5);
    }

    this.add.text(width / 2, height - 100, '[PRESS ENTER TO RETURN TO MENU]', {
      fontFamily: 'VT323',
      fontSize: '24px',
      color: '#aaaaaa'
    }).setOrigin(0.5);

    this.input.keyboard?.on('keydown-ENTER', () => {
      this.scene.start('MenuScene');
    });

    this.input.on('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
}
