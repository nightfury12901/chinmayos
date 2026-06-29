import Phaser from 'phaser';
import { NPC } from '../entities/NPC';
import { BehaviorType, NPCConfig, RoutineAction } from '../../types/NPCData';
import { CONSTANTS } from '../../constants';

export class NPCManager {
  private scene: Phaser.Scene;
  private npcs: Phaser.GameObjects.Group;
  private waypoints: {x: number, y: number}[];

  constructor(scene: Phaser.Scene, waypoints: {x: number, y: number}[]) {
    this.scene = scene;
    this.waypoints = waypoints;
    this.npcs = scene.add.group({
      classType: NPC,
      runChildUpdate: true
    });
  }

  spawnNPCs(count: number, targetProfile?: any) {
    const behaviors: BehaviorType[] = ['WALKER', 'SMOKER', 'GUARD', 'SITTER', 'PHONE_USER', 'TALKER'];
    const heights: ('short' | 'average' | 'tall')[] = ['short', 'average', 'tall'];
    const builds: ('slim' | 'average' | 'heavy')[] = ['slim', 'average', 'heavy'];
    const movements: ('normal' | 'fast' | 'irregular')[] = ['normal', 'fast', 'irregular'];

    let decoysToSpawn = Phaser.Math.Between(3, 5); // 3 to 5 decoys
    
    // Select one trait that will be UNIQUE to the target
    const traitKeys = ['behavior', 'hasBriefcase', 'hasHat', 'height', 'build', 'movement'];
    let uniqueTrait = '';
    if (targetProfile) {
      uniqueTrait = Phaser.Math.RND.pick(traitKeys);
    }

    for (let i = 0; i < count; i++) {
      let isTarget = false;
      let config: NPCConfig;
      
      if (i === 0 && targetProfile) {
        isTarget = true;
        config = {
          id: 'target_npc',
          behavior: targetProfile.behavior,
          jacketColor: '#000000',
          hasBriefcase: targetProfile.hasBriefcase,
          hasHat: targetProfile.hasHat,
          hasGlasses: targetProfile.hasGlasses,
          hasSmoking: targetProfile.behavior === 'SMOKER',
          isTarget: true,
          moveSpeed: CONSTANTS.NPC_WALK_SPEED,
          routine: this.generateRoutine(targetProfile.behavior),
          height: targetProfile.height,
          build: targetProfile.build,
          movement: targetProfile.movement
        };
      } else {
        // Generate random NPC
        let b = Phaser.Math.RND.pick(behaviors);
        let h = Phaser.Math.RND.pick(heights);
        let bd = Phaser.Math.RND.pick(builds);
        let m = Phaser.Math.RND.pick(movements);

        if (targetProfile && decoysToSpawn > 0) {
          // Make this a decoy! A decoy shares exactly 2 traits with the target.
          const traitsToShare = Phaser.Math.RND.shuffle(['height', 'build', 'movement']).slice(0, 2);
          
          if (traitsToShare.includes('height')) h = targetProfile.height;
          else h = Phaser.Math.RND.pick(heights.filter(x => x !== targetProfile.height)) || 'average';

          if (traitsToShare.includes('build')) bd = targetProfile.build;
          else bd = Phaser.Math.RND.pick(builds.filter(x => x !== targetProfile.build)) || 'average';

          if (traitsToShare.includes('movement')) m = targetProfile.movement;
          else m = Phaser.Math.RND.pick(movements.filter(x => x !== targetProfile.movement)) || 'normal';

          decoysToSpawn--;
        } else if (targetProfile) {
          // Just a normal NPC, ensure they don't accidentally match 2 or 3 traits. Limit to max 1.
          // For simplicity, just randomly pick and if it matches >= 2, reroll.
          let matches = 0;
          if (h === targetProfile.height) matches++;
          if (bd === targetProfile.build) matches++;
          if (m === targetProfile.movement) matches++;
          
          if (matches >= 2) {
             h = Phaser.Math.RND.pick(heights.filter(x => x !== targetProfile.height)) || 'average';
             bd = Phaser.Math.RND.pick(builds.filter(x => x !== targetProfile.build)) || 'average';
          }
        }

        let moveSpeed = CONSTANTS.NPC_WALK_SPEED;
        if (m === 'fast') moveSpeed *= 1.3;
        if (m === 'irregular') moveSpeed *= 0.8;

        let hasBriefcase = Math.random() > 0.8;
        let hasHat = Math.random() > 0.8;

        // FORCE EXCLUSION of the unique trait!
        if (targetProfile && uniqueTrait) {
          if (uniqueTrait === 'behavior') {
            while (b === targetProfile.behavior) b = Phaser.Math.RND.pick(behaviors);
          }
          if (uniqueTrait === 'hasBriefcase') hasBriefcase = !targetProfile.hasBriefcase;
          if (uniqueTrait === 'hasHat') hasHat = !targetProfile.hasHat;
          if (uniqueTrait === 'height') {
            while (h === targetProfile.height) h = Phaser.Math.RND.pick(heights);
          }
          if (uniqueTrait === 'build') {
            while (bd === targetProfile.build) bd = Phaser.Math.RND.pick(builds);
          }
          if (uniqueTrait === 'movement') {
            while (m === targetProfile.movement) m = Phaser.Math.RND.pick(movements);
          }
        }

        config = {
          id: `npc_${i}`,
          behavior: b,
          jacketColor: '#000000',
          hasBriefcase: hasBriefcase,
          hasHat: hasHat,
          hasGlasses: Math.random() > 0.8,
          hasSmoking: b === 'SMOKER',
          isTarget: false,
          moveSpeed: moveSpeed * Phaser.Math.FloatBetween(0.9, 1.1),
          routine: this.generateRoutine(b),
          height: h,
          build: bd,
          movement: m
        };
      }

      const npc = new NPC(this.scene, config, this.waypoints);
      this.npcs.add(npc);
    }
  }

  private generateRoutine(behavior: BehaviorType): RoutineAction[] {
    const routine: RoutineAction[] = [];
    const wpCount = this.waypoints.length;
    
    if (wpCount === 0) return routine;

    switch (behavior) {
      case 'WALKER':
        const walkPoints = Phaser.Math.RND.shuffle([...Array(wpCount).keys()]).slice(0, 4);
        walkPoints.forEach(wp => {
          routine.push({ action: 'walk', duration: 0, waypointIndex: wp });
          routine.push({ action: 'idle', duration: Phaser.Math.Between(2000, 5000), waypointIndex: wp });
        });
        break;
        
      case 'SMOKER':
        const smokeSpot = Phaser.Math.Between(0, wpCount - 1);
        routine.push({ action: 'walk', duration: 0, waypointIndex: smokeSpot });
        routine.push({ action: 'idle', duration: 90000, waypointIndex: smokeSpot }); // Wait 90s
        routine.push({ action: 'smoke', duration: 10000, waypointIndex: smokeSpot }); // Smoke 10s
        break;
        
      case 'GUARD':
        const g1 = Phaser.Math.Between(0, wpCount - 1);
        const g2 = (g1 + 1) % wpCount;
        routine.push({ action: 'walk', duration: 0, waypointIndex: g1 });
        routine.push({ action: 'look_around', duration: 5000, waypointIndex: g1 });
        routine.push({ action: 'walk', duration: 0, waypointIndex: g2 });
        routine.push({ action: 'look_around', duration: 5000, waypointIndex: g2 });
        break;
        
      case 'SITTER':
        const sitSpot = Phaser.Math.Between(0, wpCount - 1);
        routine.push({ action: 'walk', duration: 0, waypointIndex: sitSpot });
        routine.push({ action: 'sit', duration: Phaser.Math.Between(30000, 60000), waypointIndex: sitSpot });
        break;

      case 'PHONE_USER':
        const p1 = Phaser.Math.Between(0, wpCount - 1);
        const p2 = (p1 + 2) % wpCount;
        routine.push({ action: 'walk', duration: 0, waypointIndex: p1 });
        routine.push({ action: 'phone', duration: Phaser.Math.Between(5000, 10000), waypointIndex: p1 });
        routine.push({ action: 'walk', duration: 0, waypointIndex: p2 });
        routine.push({ action: 'phone', duration: Phaser.Math.Between(5000, 10000), waypointIndex: p2 });
        break;

      case 'TALKER':
        const tSpot = Phaser.Math.Between(0, wpCount - 1);
        routine.push({ action: 'walk', duration: 0, waypointIndex: tSpot });
        routine.push({ action: 'talk', duration: 15000, waypointIndex: tSpot });
        break;
    }
    
    return routine;
  }

  getGroup() {
    return this.npcs;
  }

  triggerPanic() {
    this.npcs.getChildren().forEach((child) => {
      const npc = child as NPC;
      if (typeof npc.panic === 'function') {
        npc.panic();
      }
    });
  }
}
