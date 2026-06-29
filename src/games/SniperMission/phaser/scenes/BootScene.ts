import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  private lines: string[] = [
    'NEXOS v1.0.0 — TACTICAL OPERATIONS SYSTEM',
    'COPYRIGHT (C) 2047 NEXOS CORP. ALL RIGHTS RESERVED.',
    'INITIALIZING HARDWARE...',
    'CPU: NEXOS X-CORE 2.4GHz [OK]',
    'MEMORY: 640K [OK]',
    'LOADING KERNEL MODULES...',
    '> sniper.exe LOADED',
    '> npc_manager.dll LOADED',
    '> ballistics.sys LOADED',
    '> weather.sys LOADED',
    '> audio.sys LOADED',
    'SYSTEM ONLINE. WELCOME BACK, OPERATIVE.',
    '',
    '[PRESS ANY KEY TO CONTINUE]'
  ];
  private currentLineIndex = 0;
  private textObjects: Phaser.GameObjects.Text[] = [];
  private bootTimer?: Phaser.Time.TimerEvent;

  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    this.load.image('target_broker', '/assets/sniper/target_broker.png');
    this.load.image('m24', '/assets/sniper/m24.png');
    this.load.image('vss', '/assets/sniper/vss.png');
    this.load.image('awm', '/assets/sniper/awm.png');
    this.load.image('dsr1', '/assets/sniper/dsr1.png');
  }

  create() {
    this.cameras.main.setBackgroundColor('#000000');
    
    // We start displaying lines one by one
    this.bootTimer = this.time.addEvent({
      delay: 80,
      callback: this.showNextLine,
      callbackScope: this,
      repeat: this.lines.length - 1
    });

    // Skip to menu on any key or click
    this.input.keyboard?.on('keydown', this.skipToMenu, this);
    this.input.on('pointerdown', this.skipToMenu, this);
  }

  showNextLine() {
    if (this.currentLineIndex >= this.lines.length) return;

    const yPos = 50 + this.currentLineIndex * 24;
    const text = this.add.text(50, yPos, this.lines[this.currentLineIndex], {
      fontFamily: 'VT323, monospace',
      fontSize: '20px',
      color: '#00ff41'
    });
    this.textObjects.push(text);

    // If it's the last line, add a blinking cursor effect
    if (this.currentLineIndex === this.lines.length - 1) {
      this.time.addEvent({
        delay: 500,
        loop: true,
        callback: () => {
          text.visible = !text.visible;
        }
      });
    }

    this.currentLineIndex++;
  }

  skipToMenu() {
    if (this.bootTimer) this.bootTimer.remove();
    this.scene.start('MenuScene');
  }
}
