import Phaser from 'phaser';
import { CONSTANTS } from '../../constants';
import { SaveSystem } from '../systems/SaveSystem';
import { AudioManager } from '../systems/AudioManager';
import { WeatherSystem } from '../systems/WeatherSystem';
import { MissionSystem } from '../systems/MissionSystem';
import { BulletSystem } from '../systems/BulletSystem';
import { ScopeController } from '../systems/ScopeController';
import { NPCManager } from '../systems/NPCManager';
import { HUD } from '../../ui/HUD';
import { ScopeOverlay } from '../../ui/ScopeOverlay';

// Maps
import { NeonDistrict } from '../../maps/NeonDistrict';
import { HarborDocks } from '../../maps/HarborDocks';
import { RooftopGardens } from '../../maps/RooftopGardens';

export class GameScene extends Phaser.Scene {
  private callbacks: any;
  
  private weatherSystem!: WeatherSystem;
  private missionSystem!: MissionSystem;
  private bulletSystem!: BulletSystem;
  private scopeController!: ScopeController;
  private npcManager!: NPCManager;
  
  private hud!: HUD;
  private scopeOverlay!: ScopeOverlay;

  private windTextCache?: Phaser.GameObjects.Text;
  
  // Scan System
  private hoveredNpc: any = null;
  private scanTimer: number = 0;
  private scanCooldown: number = 0;
  private scanRing!: Phaser.GameObjects.Graphics;
  private scanReadout!: Phaser.GameObjects.Container;
  private scannedNpcs: Set<string> = new Set();
  
  private sceneTimeRemaining: number = 0;

  // New Mechanics
  private isPanicMode: boolean = false;
  private intelUses: number = 3;
  private isReloading: boolean = false;

  constructor() {
    super({ key: 'GameScene' });
  }

  setCallbacks(callbacks: any) {
    this.callbacks = callbacks;
  }

  create(data: { mapId: string, mission?: any }) {
    const saveData = SaveSystem.load();
    const weaponData = (CONSTANTS.WEAPONS as any)[saveData.equippedWeapon] || CONSTANTS.WEAPONS.M24;
    
    // Disable context menu
    this.input.mouse?.disableContextMenu();

    // 1. Draw Map
    const mapId = data.mapId || 'NeonDistrict';
    let waypoints: {x: number, y: number}[] = [];
    if (mapId === 'NeonDistrict') { NeonDistrict.draw(this); waypoints = NeonDistrict.getWaypoints(); }
    if (mapId === 'HarborDocks') { HarborDocks.draw(this); waypoints = HarborDocks.getWaypoints(); }
    if (mapId === 'RooftopGardens') { RooftopGardens.draw(this); waypoints = RooftopGardens.getWaypoints(); }

    this.cameras.main.setBounds(0, -300, CONSTANTS.WORLD_WIDTH, CONSTANTS.WORLD_HEIGHT + 600);

    // 2. Systems Init
    AudioManager.init();
    
    this.weatherSystem = new WeatherSystem(this);
    this.weatherSystem.generateWeather();
    
    this.missionSystem = new MissionSystem();
    // Use passed mission or fallback (for direct testing)
    const mission = data.mission || this.missionSystem.generateMission();
    this.missionSystem.currentMission = mission;
    this.sceneTimeRemaining = mission.timeLimit * 1000;
    this.isPanicMode = false;
    this.intelUses = 3;
    
    this.npcManager = new NPCManager(this, waypoints);
    this.npcManager.spawnNPCs(25, mission.targetProfile); // Lowered NPC count for better gameplay
    
    // We send clues to parent React app to show in UI if needed, but we already have BriefingScene
    
    this.bulletSystem = new BulletSystem(this, this.npcManager);
    
    this.scopeController = new ScopeController(this, weaponData.sway);
    
    // 3. Weather
    this.weatherSystem.applyWeather();

    // 4. UI
    this.hud = new HUD(this, weaponData.mag);
    this.hud.create(mission.name, mission.timeLimit);
    
    this.scopeOverlay = new ScopeOverlay(this);
    this.scopeOverlay.create();

    // 5. Inputs
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.rightButtonDown()) {
        const isScoped = this.scopeController.toggleScope();
        this.scopeOverlay.setVisible(isScoped);
        if (this.windTextCache) this.windTextCache.setVisible(isScoped);
      } else if (pointer.leftButtonDown() && this.scopeController.isScoped) {
        this.fireWeapon(weaponData.suppressed);
      }
    });

    this.input.on('wheel', (pointer: any, go: any, dx: number, dy: number) => {
      if (dy !== 0) this.scopeController.cycleZoom();
    });

    this.input.keyboard?.on('keydown-SPACE', () => this.scopeController.setHoldingBreath(true));
    this.input.keyboard?.on('keyup-SPACE', () => this.scopeController.setHoldingBreath(false));
    
    this.input.keyboard?.on('keydown-E', () => this.useIntel());
    
    this.input.keyboard?.on('keydown-R', () => {
      if (!this.isReloading && this.hud.canReload()) {
        this.isReloading = true;
        AudioManager.playReload();
        // Unscope if scoped
        if (this.scopeController.isScoped) {
           this.scopeController.toggleScope();
           this.scopeOverlay.setVisible(false);
           if (this.windTextCache) this.windTextCache.setVisible(false);
        }
        setTimeout(() => {
          this.hud.reload();
          this.isReloading = false;
        }, 1200); // 1.2s reload time
      }
    });

    // Wind text cache for scope
    this.windTextCache = this.add.text(this.scale.width / 2 - CONSTANTS.SCOPE_RADIUS - 55, this.scale.height / 2 - 15, 
      `WIND: ${this.weatherSystem.windStrength.toFixed(1)} KPH`, 
      { 
        fontFamily: 'VT323, monospace', 
        fontSize: '18px', 
        color: '#00e5ff',
        backgroundColor: '#000000aa',
        padding: { x: 4, y: 2 }
      })
      .setOrigin(1, 0.5)
      .setDepth(901)
      .setScrollFactor(0)
      .setVisible(false);

    // CRT Filter
    this.applyCRTFilter();

    // Scan Graphics
    this.scanRing = this.add.graphics().setDepth(800).setVisible(false);
    this.scanReadout = this.add.container(0, 0).setDepth(2001).setScrollFactor(0).setVisible(false);
  }

  private buildScanReadout(npc: any, target: any) {
    this.scanReadout.removeAll(true);
    
    // Calculate matches
    let matches = 0;
    let mismatches = 0;
    
    const checkMatch = (val: any, targetVal: any) => {
      if (val === targetVal) { matches++; return '[✓]'; }
      mismatches++; return '[✗]';
    };

    const hMark = checkMatch(npc.config.height, target.height);
    const bMark = checkMatch(npc.config.build, target.build);
    const mMark = checkMatch(npc.config.movement, target.movement);
    const hatMark = checkMatch(npc.config.hasHat, target.hasHat);
    const caseMark = checkMatch(npc.config.hasBriefcase, target.hasBriefcase);
    const actvMark = checkMatch(npc.config.behavior, target.behavior);

    let confidence = Math.max(0, Math.min(99, (matches * 15) - (mismatches * 10) + 10));
    // If it's the actual target, force it to look confident
    if (npc.config.isTarget) confidence = Phaser.Math.Between(87, 95);
    
    let confColor = '#ff0000';
    if (confidence > 40) confColor = '#ffff00';
    if (confidence > 70) confColor = '#00ff00';

    const bg = this.add.graphics();
    bg.fillStyle(0x000000, 0.9);
    bg.lineStyle(1, 0x00e5ff, 1);
    bg.fillRect(0, 0, 230, 200);
    bg.strokeRect(0, 0, 230, 200);

    const txt = this.add.text(10, 10, 
      `SCANNING TARGET...\n` +
      `──────────────────\n` +
      `HEIGHT:   ${npc.config.height.toUpperCase().padEnd(7)} ${hMark}\n` +
      `BUILD:    ${npc.config.build.toUpperCase().padEnd(7)} ${bMark}\n` +
      `MOVEMENT: ${npc.config.movement.substring(0,7).toUpperCase().padEnd(7)} ${mMark}\n` +
      `HAT:      ${(npc.config.hasHat ? 'YES' : 'NO').padEnd(7)} ${hatMark}\n` +
      `CASE:     ${(npc.config.hasBriefcase ? 'YES' : 'NO').padEnd(7)} ${caseMark}\n` +
      `ACTV:     ${npc.config.behavior.substring(0,7).toUpperCase().padEnd(7)} ${actvMark}\n` +
      `──────────────────\n`,
      { fontFamily: 'VT323, monospace', fontSize: '14px', color: '#00ff00' }
    );

    const confTxt = this.add.text(10, 170, `CONFIDENCE: ${confidence}%`, { fontFamily: 'VT323, monospace', fontSize: '16px', color: confColor });

    this.scanReadout.add([bg, txt, confTxt]);
    this.scanReadout.setAlpha(0);
    this.tweens.add({ targets: this.scanReadout, alpha: 1, duration: 200 });
  }

  applyCRTFilter() {
    const { width, height } = this.scale;
    const g = this.add.graphics();
    g.setScrollFactor(0).setDepth(2000);
    g.fillStyle(0x000000, CONSTANTS.SCANLINE_ALPHA);
    for (let y = 0; y < height; y += 4) g.fillRect(0, y, width, 2);
  }

  fireWeapon(suppressed: boolean) {
    if (this.isReloading) return;
    if (!this.hud.shoot()) {
      AudioManager.playDryFire();
      return; // Out of ammo
    }

    AudioManager.playGunshot(suppressed);
    
    const worldCenter = this.cameras.main.getWorldPoint(this.scale.width / 2, this.scale.height / 2);
    
    this.bulletSystem.fire(
      worldCenter.x, 
      worldCenter.y, 
      this.weatherSystem.windStrength, 
      this.weatherSystem.windDirection,
      (success, hitNPC) => {
        // Unscope
        this.scopeController.toggleScope();
        this.scopeOverlay.setVisible(false);
        if (this.windTextCache) this.windTextCache.setVisible(false);

        if (success) {
          AudioManager.playJingle(true);
          setTimeout(() => this.scene.start('EndScene', { success: true, scansUsed: this.missionSystem.currentMission.scansUsed }), 1500);
        } else {
          if (!this.isPanicMode) {
             this.isPanicMode = true;
             this.sceneTimeRemaining = 10000; // 10 seconds remaining!
             this.npcManager.triggerPanic();
             const flash = this.add.rectangle(0, 0, CONSTANTS.WORLD_WIDTH, CONSTANTS.WORLD_HEIGHT, 0xff0000, 0.15)
               .setOrigin(0).setDepth(2000).setScrollFactor(0);
             this.tweens.add({ targets: flash, alpha: 0, duration: 500, yoyo: true, repeat: -1 });
          } else if (hitNPC) {
             AudioManager.playJingle(false);
             setTimeout(() => this.scene.start('EndScene', { success: false }), 2000);
          }
        }
      }
    );
  }

  update(time: number, delta: number) {
    this.hud.update(delta);
    
    this.sceneTimeRemaining -= delta;
    if (this.sceneTimeRemaining <= 0) {
       // Time out
       this.scene.start('EndScene', { success: false, timeout: true });
    }

    if (this.scopeController.isScoped) {
      const p = this.input.activePointer;
      this.scopeController.update(delta, p.x, p.y);
      
      this.scopeOverlay.draw(
        this.scopeController.breathMeter / 100, 
        this.weatherSystem.windStrength, 
        this.weatherSystem.windDirection,
        this.sceneTimeRemaining
      );
      if (this.windTextCache) {
        const dirArr = this.weatherSystem.windDirection > 0 ? '>>>' : '<<<';
        this.windTextCache.setText(`WIND: ${this.weatherSystem.windStrength.toFixed(1)} KPH ${dirArr}`);
        
        const zoom = this.cameras.main.zoom;
        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;
        const radius = CONSTANTS.SCOPE_RADIUS / zoom;
        this.windTextCache.setPosition(cx - radius - 20 / zoom, cy);
        this.windTextCache.setScale(1 / zoom);
      }

      // Scan logic
      if (this.scanCooldown > 0) {
        this.scanCooldown -= delta;
        this.scanRing.setAlpha(this.scanCooldown / 500); // fade out
      } else if (this.scopeController.getZoomIndex() >= 1) { // 4x or 8x
        const worldCenter = this.cameras.main.getWorldPoint(this.scale.width / 2, this.scale.height / 2);
        
        let currentlyHovered = null;
        for (const child of this.npcManager.getGroup().getChildren()) {
          const npc = child as any;
          if (npc.getBounds().contains(worldCenter.x, worldCenter.y)) {
            currentlyHovered = npc;
            break;
          }
        }

        if (currentlyHovered) {
          if (this.hoveredNpc !== currentlyHovered) {
            this.hoveredNpc = currentlyHovered;
            this.scanTimer = 0;
            this.scanReadout.setVisible(false);
          } else {
            this.scanTimer += delta;
            
            // Draw pulsing ring
            this.scanRing.setVisible(true);
            this.scanRing.setAlpha(0.4);
            this.scanRing.clear();
            this.scanRing.lineStyle(2, 0x00e5ff, 1);
            const pulse = (Math.sin(time * 0.01) + 1) * 5;
            this.scanRing.strokeCircle(this.hoveredNpc.x, this.hoveredNpc.y, 25 + pulse);

            if (this.scanTimer >= 500 && !this.scanReadout.visible) {
              this.scanReadout.setVisible(true);
              this.buildScanReadout(this.hoveredNpc, this.missionSystem.currentMission.targetProfile);
              
              if (!this.scannedNpcs.has(this.hoveredNpc.config.id)) {
                this.scannedNpcs.add(this.hoveredNpc.config.id);
                this.hud.incrementScans();
                this.missionSystem.currentMission.scansUsed++;
              }
            } else if (this.scanReadout.visible) {
              // Position statically on the right side of the scope
              const zoom = this.cameras.main.zoom;
              const cx = this.scale.width / 2;
              const cy = this.scale.height / 2;
              const radius = CONSTANTS.SCOPE_RADIUS / zoom;
              this.scanReadout.setPosition(cx + radius + 40 / zoom, cy - 100 / zoom);
              this.scanReadout.setScale(1 / zoom);
            }
          }
        } else {
          // Stopped hovering
          if (this.hoveredNpc) {
            this.scanCooldown = 500;
            this.hoveredNpc = null;
            this.scanTimer = 0;
            this.scanReadout.setVisible(false);
          }
        }
      } else {
        // Zoom too low
        this.scanRing.setVisible(false);
        this.scanReadout.setVisible(false);
        this.hoveredNpc = null;
        this.scanTimer = 0;
      }
    } else {
      this.scanRing.setVisible(false);
      this.scanReadout.setVisible(false);
      this.hoveredNpc = null;
      this.scanTimer = 0;
    }
  }

  private useIntel() {
    if (this.intelUses <= 0 || this.isPanicMode) return;
    this.intelUses--;
    if ((this.hud as any).updateIntel) {
      (this.hud as any).updateIntel(this.intelUses);
    }

    // Find target
    let targetNpc: any = null;
    for (const child of this.npcManager.getGroup().getChildren()) {
      const npc = child as any;
      if (npc.config.isTarget) {
        targetNpc = npc;
        break;
      }
    }

    if (targetNpc) {
      // Create radar ping
      const ping = this.add.graphics();
      ping.setDepth(500);
      
      const offsetX = Phaser.Math.Between(-150, 150);
      const offsetY = Phaser.Math.Between(-150, 150);
      const px = targetNpc.x + offsetX;
      const py = targetNpc.y + offsetY;
      
      ping.lineStyle(4, 0xffaa00, 1);
      ping.strokeCircle(px, py, 40);
      
      this.tweens.add({
        targets: ping,
        scaleX: 8,
        scaleY: 8,
        alpha: 0,
        duration: 2000,
        onComplete: () => ping.destroy()
      });
    }
  }
}
