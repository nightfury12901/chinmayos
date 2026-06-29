import Phaser from 'phaser';
import { CONSTANTS } from '../../constants';
import { SaveSystem } from '../systems/SaveSystem';
import { SaveData } from '../../types/SaveData';

export class ArmoryScene extends Phaser.Scene {
  private weapons = Object.values(CONSTANTS.WEAPONS);
  private selectedIndex = 0;
  private saveData!: SaveData;

  private leftPanelText: Phaser.GameObjects.Text[] = [];
  private rightPanelContainer!: Phaser.GameObjects.Container;

  constructor() {
    super({ key: 'ArmoryScene' });
  }

  create() {
    this.saveData = SaveSystem.load();
    this.cameras.main.setBackgroundColor('#0a0a0f');

    const { width, height } = this.scale;

    this.add.text(50, 30, 'ARMORY', { fontFamily: '"Press Start 2P"', fontSize: '24px', color: '#00ff41' });
    this.add.text(width - 250, 30, `CREDITS: ${this.saveData.credits}`, { fontFamily: '"Press Start 2P"', fontSize: '24px', color: '#00ff41' });

    this.rightPanelContainer = this.add.container(width / 2, 100);

    this.drawLeftPanel();
    this.drawRightPanel();

    this.input.keyboard?.on('keydown-UP', () => this.moveSelection(-1));
    this.input.keyboard?.on('keydown-DOWN', () => this.moveSelection(1));
    this.input.keyboard?.on('keydown-ENTER', () => this.equipOrUnlock());
    this.input.keyboard?.on('keydown-ESC', () => this.scene.start('MenuScene'));
  }

  drawLeftPanel() {
    this.leftPanelText.forEach(t => t.destroy());
    this.leftPanelText = [];

    this.weapons.forEach((w, index) => {
      const isSelected = index === this.selectedIndex;
      const isUnlocked = this.saveData.unlockedWeapons.includes(w.id);
      
      const prefix = isSelected ? '> ' : '  ';
      const lockStr = isUnlocked ? '' : ' [LOCKED]';
      
      const text = this.add.text(50, 150 + index * 50, `${prefix}${w.name}${lockStr}`, {
        fontFamily: 'VT323',
        fontSize: '32px',
        color: isSelected ? '#00ff41' : '#00cc33'
      })
      .setAlpha(isSelected ? 1 : 0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.selectedIndex = index;
        this.drawLeftPanel();
        this.drawRightPanel();
        this.equipOrUnlock();
      })
      .on('pointerover', () => {
        this.selectedIndex = index;
        this.drawLeftPanel();
        this.drawRightPanel();
      });
      this.leftPanelText.push(text);
    });
  }

  drawRightPanel() {
    this.rightPanelContainer.removeAll(true);
    
    const weapon = this.weapons[this.selectedIndex];
    const isUnlocked = this.saveData.unlockedWeapons.includes(weapon.id);
    const isEquipped = this.saveData.equippedWeapon === weapon.id;

    // Draw Title
    this.rightPanelContainer.add(this.add.text(0, 0, weapon.name, { fontFamily: '"Press Start 2P"', fontSize: '32px', color: '#00ff41' }));

    // Weapon Image
    let imgKey = weapon.id.toLowerCase();
    const img = this.add.image(0, 100, imgKey).setOrigin(0, 0.5);
    
    // Scale image to fit reasonably (assuming generated images are large)
    const scale = 300 / Math.max(img.width, 1);
    img.setScale(scale);
    
    // Silhouette if locked
    if (!isUnlocked) {
      img.setTint(0x000000);
      if (typeof (img as any).setTintMode === 'function') {
        (img as any).setTintMode(1); // Phaser.TintModes.FILL
      }
      img.setAlpha(0.5);
    }
    
    this.rightPanelContainer.add(img);

    // Draw Stats
    const stats = [
      { label: 'DAMAGE', value: weapon.damage },
      { label: 'STABILITY', value: weapon.stability },
      { label: 'ZOOM', value: weapon.zoom },
      { label: 'MAGAZINE', value: weapon.mag }
    ];

    stats.forEach((s, i) => {
      this.rightPanelContainer.add(this.add.text(0, 180 + i * 40, s.label.padEnd(12, ' '), { fontFamily: 'VT323', fontSize: '24px', color: '#00cc33' }));
      this.drawStatBar(this.rightPanelContainer, 150, 185 + i * 40, s.value);
    });

    // Action Text
    if (isEquipped) {
      this.rightPanelContainer.add(this.add.text(0, 360, '[EQUIPPED]', { fontFamily: '"Press Start 2P"', fontSize: '24px', color: '#00cc33' }));
    } else if (isUnlocked) {
      this.rightPanelContainer.add(this.add.text(0, 360, '[PRESS ENTER TO EQUIP]', { fontFamily: '"Press Start 2P"', fontSize: '24px', color: '#00ff41' }));
    } else {
      const cost = (CONSTANTS.WEAPON_COSTS as any)[weapon.id] || 9999;
      const color = this.saveData.credits >= cost ? '#ffee00' : '#ff00aa';
      this.rightPanelContainer.add(this.add.text(0, 360, `UNLOCK COST: ${cost} CREDITS`, { fontFamily: '"Press Start 2P"', fontSize: '20px', color }));
    }
  }

  drawStatBar(container: Phaser.GameObjects.Container, x: number, y: number, value: number) {
    const max = 10;
    const g = this.add.graphics();
    for (let i = 0; i < max; i++) {
      if (i < value) {
        g.fillStyle(0x00ff41);
        g.fillRect(x + i * 20, y, 15, 15);
      } else {
        g.lineStyle(1, 0x333333);
        g.strokeRect(x + i * 20, y, 15, 15);
      }
    }
    container.add(g);
  }

  moveSelection(dir: number) {
    this.selectedIndex = (this.selectedIndex + dir + this.weapons.length) % this.weapons.length;
    this.drawLeftPanel();
    this.drawRightPanel();
  }

  equipOrUnlock() {
    const weapon = this.weapons[this.selectedIndex];
    const isUnlocked = this.saveData.unlockedWeapons.includes(weapon.id);

    if (isUnlocked) {
      this.saveData.equippedWeapon = weapon.id;
      SaveSystem.save(this.saveData);
    } else {
      const cost = (CONSTANTS.WEAPON_COSTS as any)[weapon.id] || 9999;
      if (this.saveData.credits >= cost) {
        this.saveData.credits -= cost;
        this.saveData.unlockedWeapons.push(weapon.id);
        SaveSystem.save(this.saveData);
      }
    }
    this.drawLeftPanel();
    this.drawRightPanel();
  }
}
