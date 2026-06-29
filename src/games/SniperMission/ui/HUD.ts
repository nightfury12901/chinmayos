import Phaser from 'phaser';

export class HUD {
  private scene: Phaser.Scene;
  private container!: Phaser.GameObjects.Container;
  
  private timerText!: Phaser.GameObjects.Text;
  private ammoText!: Phaser.GameObjects.Text;
  private healthText!: Phaser.GameObjects.Text;
  
  private timeRemaining: number = 0;
  private maxAmmo: number;
  private currentAmmo: number;
  private scansUsed: number = 0;
  private scansText!: Phaser.GameObjects.Text;
  private intelText!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, maxAmmo: number) {
    this.scene = scene;
    this.maxAmmo = maxAmmo;
    this.currentAmmo = maxAmmo;
  }

  create(missionName: string, timeLimit: number) {
    this.timeRemaining = timeLimit;
    const { width, height } = this.scene.scale;
    
    this.container = this.scene.add.container(0, 0);
    this.container.setScrollFactor(0);
    this.container.setDepth(1000); // Always on top

    // Top Bar Background
    const topBar = this.scene.add.graphics();
    topBar.fillStyle(0x0a0a0a, 0.8);
    topBar.fillRect(0, 0, width, 20);
    this.container.add(topBar);

    // Top Bar Text
    this.container.add(this.scene.add.text(10, 2, 'NEXOS v1.0.0  [FN]  WELCOME BACK, USER', { fontFamily: 'VT323', fontSize: '14px', color: '#00ff41' }));
    
    const sysOnline = this.scene.add.text(width / 2, 2, '★ SYSTEM ONLINE ★', { fontFamily: 'VT323', fontSize: '14px', color: '#00ff41' }).setOrigin(0.5, 0);
    this.scene.time.addEvent({ delay: 1000, loop: true, callback: () => sysOnline.visible = !sysOnline.visible });
    this.container.add(sysOnline);

    this.container.add(this.scene.add.text(width - 10, 2, 'USER: USER   XP: 1240   COINS: 530   ⚡ 15:35:50', { fontFamily: 'VT323', fontSize: '14px', color: '#00ff41' }).setOrigin(1, 0));

    // Mission Name
    this.container.add(this.scene.add.text(10, 30, `// MISSION: ${missionName}_`, { fontFamily: 'VT323', fontSize: '16px', color: '#00ff41' }));

    // Timer
    this.timerText = this.scene.add.text(width - 10, 30, this.formatTime(), { fontFamily: 'VT323', fontSize: '20px', color: '#00ff41' }).setOrigin(1, 0);
    this.container.add(this.timerText);

    // Intel Pulses
    this.intelText = this.scene.add.text(width / 2, 30, 'INTEL PULSES: 3/3 [PRESS E]', { fontFamily: 'VT323, monospace', fontSize: '20px', color: '#ffaa00' }).setOrigin(0.5, 0);
    this.container.add(this.intelText);

    // Health
    this.healthText = this.scene.add.text(10, height - 30, '♥ 100', { fontFamily: 'VT323', fontSize: '20px', color: '#00ff41' });
    this.container.add(this.healthText);

    // Scans Counter (Middle bottom)
    this.scansText = this.scene.add.text(width / 2, height - 30, 'SCANS: 0', { fontFamily: 'VT323, monospace', fontSize: '20px', color: '#00e5ff' }).setOrigin(0.5, 0);
    this.container.add(this.scansText);

    // Ammo
    this.ammoText = this.scene.add.text(width - 10, height - 30, this.formatAmmo(), { fontFamily: 'VT323, monospace', fontSize: '20px', color: '#00ff41' }).setOrigin(1, 0);
    this.container.add(this.ammoText);
  }

  update(delta: number) {
    this.timeRemaining -= delta / 1000;
    if (this.timeRemaining < 0) this.timeRemaining = 0;
    
    this.timerText.setText(this.formatTime());
    if (this.timeRemaining < 30) this.timerText.setColor('#ff00aa');
  }

  formatTime() {
    const m = Math.floor(this.timeRemaining / 60);
    const s = Math.floor(this.timeRemaining % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  formatAmmo() {
    return `${this.currentAmmo}/${this.maxAmmo} ` + '■'.repeat(this.currentAmmo) + '□'.repeat(this.maxAmmo - this.currentAmmo);
  }

  shoot() {
    if (this.currentAmmo > 0) {
      this.currentAmmo--;
      this.ammoText.setText(this.formatAmmo());
      return true;
    }
    return false;
  }

  incrementScans() {
    this.scansUsed++;
    this.scansText.setText(`SCANS: ${this.scansUsed}`);
  }

  updateIntel(uses: number) {
    this.intelText.setText(`INTEL PULSES: ${uses}/3 [PRESS E]`);
    if (uses === 0) this.intelText.setColor('#666666');
  }

  canReload() {
    return this.currentAmmo < this.maxAmmo;
  }

  reload() {
    this.currentAmmo = this.maxAmmo;
    this.ammoText.setText(this.formatAmmo());
  }
}
