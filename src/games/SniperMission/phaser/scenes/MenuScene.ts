import Phaser from 'phaser';
import { MissionSystem } from '../systems/MissionSystem';

export class MenuScene extends Phaser.Scene {
  private options = ['NEW CONTRACT', 'ARMORY', 'MAP SELECT', 'QUIT'];
  private selectedIndex = 0;
  private optionTexts: Phaser.GameObjects.Text[] = [];

  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    this.optionTexts = []; // Clear array to prevent accumulation of destroyed texts on restart
    this.input.keyboard?.removeAllListeners(); // Prevent duplicate listeners
    
    this.cameras.main.setBackgroundColor('#0a0a0f');

    const { width, height } = this.scale;

    // Title
    const title = this.add.text(width / 2, height / 3, 'SNIPER.EXE', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '64px',
      color: '#00ff41'
    }).setOrigin(0.5);

    // Title flicker effect
    this.time.addEvent({
      delay: 100,
      loop: true,
      callback: () => {
        title.alpha = Math.random() > 0.1 ? 1 : 0.5;
      }
    });

    // Menu options
    this.options.forEach((opt, index) => {
      const text = this.add.text(width / 2, height / 2 + index * 40, opt, {
        fontFamily: 'VT323, monospace',
        fontSize: '32px',
        color: '#00cc33'
      }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
          this.selectedIndex = index;
          this.updateSelection();
          this.selectOption();
        })
        .on('pointerover', () => {
          this.selectedIndex = index;
          this.updateSelection();
        });
      this.optionTexts.push(text);
    });

    this.updateSelection();

    // Input
    this.input.keyboard?.on('keydown-UP', () => this.moveSelection(-1));
    this.input.keyboard?.on('keydown-DOWN', () => this.moveSelection(1));
    this.input.keyboard?.on('keydown-W', () => this.moveSelection(-1));
    this.input.keyboard?.on('keydown-S', () => this.moveSelection(1));
    this.input.keyboard?.on('keydown-ENTER', () => this.selectOption());
  }

  moveSelection(dir: number) {
    this.selectedIndex = (this.selectedIndex + dir + this.options.length) % this.options.length;
    this.updateSelection();
  }

  updateSelection() {
    this.optionTexts.forEach((text, i) => {
      if (i === this.selectedIndex) {
        text.setText(`> ${this.options[i]}`);
        text.setTint(0x00ff41);
        text.setAlpha(1);
      } else {
        text.setText(this.options[i]);
        text.setTint(0x00cc33);
        text.setAlpha(0.6);
      }
    });
  }

  selectOption() {
    const selected = this.options[this.selectedIndex];
    switch (selected) {
      case 'NEW CONTRACT':
        const missionSystem = new MissionSystem();
        const mission = missionSystem.generateMission();
        this.scene.start('BriefingScene', { mapId: 'NeonDistrict', mission });
        break;
      case 'ARMORY':
        this.scene.start('ArmoryScene');
        break;
      case 'MAP SELECT':
        this.scene.start('MapSelectScene');
        break;
      case 'QUIT':
        // in browser, we can't really quit, maybe just go to a blank state or OS
        break;
    }
  }
}
