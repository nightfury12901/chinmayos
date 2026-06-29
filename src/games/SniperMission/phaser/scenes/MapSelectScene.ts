import Phaser from 'phaser';
import { CONSTANTS } from '../../constants';
import { SaveSystem } from '../systems/SaveSystem';

export class MapSelectScene extends Phaser.Scene {
  private maps = [
    { id: 'NeonDistrict', name: 'NEON DISTRICT', difficulty: '★☆☆' },
    { id: 'HarborDocks', name: 'HARBOR DOCKS', difficulty: '★★☆' },
    { id: 'RooftopGardens', name: 'ROOFTOP GARDENS', difficulty: '★★★' }
  ];
  private selectedIndex = 0;
  private optionTexts: Phaser.GameObjects.Text[] = [];

  constructor() {
    super({ key: 'MapSelectScene' });
  }

  create() {
    this.cameras.main.setBackgroundColor('#0a0a0f');
    const { width, height } = this.scale;

    this.add.text(width / 2, 100, 'SELECT LOCATION', {
      fontFamily: '"Press Start 2P"',
      fontSize: '40px',
      color: '#00ff41'
    }).setOrigin(0.5);

    const saveData = SaveSystem.load();

    this.maps.forEach((m, index) => {
      const isUnlocked = saveData.unlockedMaps.includes(m.id);
      const reqXP = (CONSTANTS.MAP_XP_REQUIREMENTS as any)[m.id] || 0;
      const statusText = isUnlocked ? `DIFFICULTY: ${m.difficulty}` : `REQUIRES: ${reqXP} XP`;
      
      const yPos = 250 + index * 100;
      
      // Draw card
      const card = this.add.graphics();
      card.lineStyle(2, 0x00ff41, 0.5);
      card.strokeRect(width / 2 - 300, yPos - 30, 600, 80);

      const text = this.add.text(width / 2, yPos, `${m.name} \n${statusText}`, {
        fontFamily: 'VT323',
        fontSize: '28px',
        color: isUnlocked ? '#00cc33' : '#ff00aa',
        align: 'center'
      }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
          this.selectedIndex = index;
          this.updateSelection();
          this.selectMap();
        })
        .on('pointerover', () => {
          this.selectedIndex = index;
          this.updateSelection();
        });

      this.optionTexts.push(text);
    });

    this.updateSelection();

    this.input.keyboard?.on('keydown-UP', () => this.moveSelection(-1));
    this.input.keyboard?.on('keydown-DOWN', () => this.moveSelection(1));
    this.input.keyboard?.on('keydown-W', () => this.moveSelection(-1));
    this.input.keyboard?.on('keydown-S', () => this.moveSelection(1));
    this.input.keyboard?.on('keydown-ENTER', () => this.selectMap());
    this.input.keyboard?.on('keydown-ESC', () => this.scene.start('MenuScene'));
  }

  moveSelection(dir: number) {
    this.selectedIndex = (this.selectedIndex + dir + this.maps.length) % this.maps.length;
    this.updateSelection();
  }

  updateSelection() {
    this.optionTexts.forEach((text, i) => {
      if (i === this.selectedIndex) {
        text.setTint(0x00ff41);
        text.setAlpha(1);
      } else {
        const isUnlocked = SaveSystem.load().unlockedMaps.includes(this.maps[i].id);
        text.setTint(isUnlocked ? 0x00cc33 : 0xff00aa);
        text.setAlpha(0.4);
      }
    });
  }

  selectMap() {
    const selected = this.maps[this.selectedIndex];
    const isUnlocked = SaveSystem.load().unlockedMaps.includes(selected.id);
    
    if (isUnlocked) {
      const missionSystem = new (require('../systems/MissionSystem').MissionSystem)();
      const mission = missionSystem.generateMission();
      this.scene.start('BriefingScene', { mapId: selected.id, mission });
    }
  }
}
