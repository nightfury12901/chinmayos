import Phaser from 'phaser';
import { NPCConfig, RoutineAction } from '../../types/NPCData';
import { CONSTANTS } from '../../constants';

export class NPC extends Phaser.Physics.Arcade.Sprite {
  public config: NPCConfig;
  private currentRoutineIndex = 0;
  private stateTimer = 0;
  private waypoints: {x: number, y: number}[];
  
  private animFrame = 0;
  private animTimer = 0;
  private isMoving = false;
  
  private textures: Record<string, string> = {};

  constructor(scene: Phaser.Scene, config: NPCConfig, waypoints: {x: number, y: number}[]) {
    super(scene, waypoints[0].x, waypoints[0].y, '');
    this.config = config;
    this.waypoints = waypoints;
    
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Create specific texture keys for this NPC's jacket color + briefcase
    this.generateTextures(scene);
    
    this.setTexture(this.textures.idle);
    
    // Scale up slightly so it's visible, our base is 16x32
    this.setScale(2); 
    
    if (this.body && this.body instanceof Phaser.Physics.Arcade.Body) {
      this.body.setSize(16, 32);
      this.body.setOffset(0, 0);
    }
    
    this.startNextRoutine();
  }

  private generateTextures(scene: Phaser.Scene) {
    const id = this.config.id;
    
    // Base dimensions
    let w = 10;
    let h = 14;
    let legLen = 8;
    
    // Proportions based on build
    if (this.config.build === 'slim') w = 8;
    if (this.config.build === 'heavy') w = 14;
    
    // Proportions based on height
    if (this.config.height === 'short') { h = 12; legLen = 6; }
    if (this.config.height === 'tall') { h = 18; legLen = 10; }

    const isIrregular = this.config.movement === 'irregular';
    
    // Walk frames
    const frames = [
      { key: 'idle', legA: 0, legB: w - 2, armA: 0, armB: w + 2 },
      { key: 'walk1', legA: -2, legB: w, armA: 2, armB: w - 2 },
      { key: 'walk2', legA: 0, legB: w - 2, armA: 0, armB: w + 2 },
      { key: 'walk3', legA: 2, legB: w - 4, armA: -2, armB: w + 4 },
      { key: 'walk4', legA: 0, legB: w - 2, armA: 0, armB: w + 2 },
    ];

    if (isIrregular) {
      // Limp: asymmetric frames
      frames[1].legA = -4; frames[1].legB = w - 2; 
      frames[3].legA = 1; frames[3].legB = w - 1;
    }

    frames.forEach((f, idx) => {
      const texKey = `npc_${id}_${f.key}_${idx}`;
      this.textures[f.key === 'idle' ? 'idle' : `walk${idx}`] = texKey;
      
      if (scene.textures.exists(texKey)) return;

      const g = scene.make.graphics({x: 0, y: 0});
      
      const cx = 16;
      const cy = 10;

      // Shadow under character
      g.fillStyle(0x000000, 0.4);
      g.fillEllipse(cx + w/2, cy + h + legLen + 2, 12 + w, 4);

      // ALL FILL BLACK
      g.fillStyle(0x000000, 1);

      // Head
      g.fillRoundedRect(cx + w/2 - 4, cy - 8, 8, 8, 2);
      
      // Hat
      if (this.config.hasHat) {
        g.fillRect(cx + w/2 - 6, cy - 9, 12, 2); // Brim
        g.fillRoundedRect(cx + w/2 - 4, cy - 13, 8, 5, 2); // Top
      }
      
      // Body
      g.fillRoundedRect(cx, cy, w, h, 2);
      
      // Legs
      g.fillRect(cx + f.legA, cy + h, 4, legLen);
      g.fillRect(cx + f.legB, cy + h, 4, legLen);
      
      // Arms
      let armLen = h - 2;
      let leftArmY = cy + 1;
      let rightArmY = cy + 1;

      // Behavior overrides for arms
      if (this.config.behavior === 'PHONE_USER') {
        leftArmY = cy - 4; // Arm raised
        armLen = h - 6;
      }
      
      g.fillRoundedRect(cx - 3 + f.armA/4, leftArmY, 3, armLen, 1);
      g.fillRoundedRect(cx + w + f.armB/4, rightArmY, 3, armLen, 1);

      // Briefcase
      if (this.config.hasBriefcase) {
        g.fillRoundedRect(cx + w + f.armB/4 - 1, rightArmY + armLen - 2, 8, 6, 1);
      }

      // Cigarette glow
      if (this.config.hasSmoking) {
        g.fillStyle(0xffaa00, 1);
        g.fillCircle(cx + w/2 + 4, cy - 4, 1);
      }
      
      g.generateTexture(texKey, 32, 48);
    });
  }

  private startNextRoutine() {
    if (this.config.routine.length === 0) return;
    
    this.currentRoutineIndex = (this.currentRoutineIndex + 1) % this.config.routine.length;
    const currentAction = this.config.routine[this.currentRoutineIndex];
    
    this.stateTimer = currentAction.duration;
    
    const targetWaypoint = this.waypoints[currentAction.waypointIndex];
    
    if (currentAction.action === 'walk') {
      this.isMoving = true;
      const speed = this.config.moveSpeed;
      const dir = Math.sign(targetWaypoint.x - this.x);
      
      this.setFlipX(dir < 0);
      
      if (this.body && this.body instanceof Phaser.Physics.Arcade.Body) {
        this.body.setVelocityX(dir * speed);
      }
    } else {
      this.isMoving = false;
      this.setTexture(this.textures.idle);
      if (this.body && this.body instanceof Phaser.Physics.Arcade.Body) {
        this.body.setVelocityX(0);
      }
    }
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);
    
    if (this.config.routine.length === 0) return;

    const currentAction = this.config.routine[this.currentRoutineIndex];
    
    // Animation
    if (this.isMoving) {
      this.animTimer += delta;
      if (this.animTimer > 150) {
        this.animTimer = 0;
        this.animFrame = (this.animFrame + 1) % 4;
        this.setTexture(this.textures[`walk${this.animFrame + 1}`]);
      }
      
      // Check if reached destination
      const targetWaypoint = this.waypoints[currentAction.waypointIndex];
      const dist = Math.abs(this.x - targetWaypoint.x);
      
      if (dist < 5) {
        this.x = targetWaypoint.x;
        this.startNextRoutine();
      }
    } else {
      // Timer for idle states
      this.stateTimer -= delta;
      if (this.stateTimer <= 0) {
        this.startNextRoutine();
      }
    }
  }

  panic() {
    this.config.moveSpeed = CONSTANTS.NPC_WALK_SPEED * 2.5;
    
    // Generate a frantic running routine
    const newRoutine: RoutineAction[] = [];
    const numWaypoints = this.waypoints.length;
    if (numWaypoints > 0) {
      for(let i=0; i<10; i++) {
          newRoutine.push({ action: 'walk', duration: 0, waypointIndex: Phaser.Math.Between(0, numWaypoints - 1) });
      }
      this.config.routine = newRoutine;
      this.currentRoutineIndex = -1;
      this.startNextRoutine();
    }
  }
}
