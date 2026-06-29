import Phaser from 'phaser';
import { Mission, Target } from '../../types/Mission';
import { NPCManager } from './NPCManager';
import { NPC } from '../entities/NPC';

const MISSION_NAMES = [
  'ELIMINATE THE BROKER', 'GHOST PROTOCOL', 'SILENT RAIN', 
  'THE NIGHT MARKET', 'IRON VEIL', 'CODE RED', 'THE FIXER',
  'OPERATION BLACKOUT', 'LAST CALL', 'THE INFORMANT',
  'NEON REQUIEM', 'COLD SIGNAL', 'THE CONTRACTOR',
  'RADIO SILENCE', 'DEAD DROP', 'THE SYNDICATE',
  'ZERO HOUR', 'FINAL APPROACH', 'THE CLEANER', 'DARK TIDE'
];

export class MissionSystem {
  public currentMission!: Mission;

  generateMission(): Mission {
    const heights = ['short', 'average', 'tall'];
    const builds = ['slim', 'average', 'heavy'];
    const movements = ['normal', 'fast', 'irregular'];
    const behaviors: any[] = ['SMOKER', 'PHONE_USER', 'GUARD', 'TALKER', 'SITTER', 'WALKER'];
    
    const targetConfig: any = {
      jacketColor: '#000000', // Unused visually now
      hasBriefcase: Math.random() > 0.5,
      hasHat: Math.random() > 0.5,
      hasGlasses: Math.random() > 0.5,
      behavior: Phaser.Math.RND.pick(behaviors),
      height: Phaser.Math.RND.pick(heights),
      build: Phaser.Math.RND.pick(builds),
      movement: Phaser.Math.RND.pick(movements)
    };

    if (targetConfig.behavior === 'SMOKER') {
      targetConfig.hasSmoking = true;
    }

    const traits: string[] = [];
    
    // Always include the 3 main visual traits for the scan system
    if (targetConfig.height === 'short') traits.push('TARGET IS SHORT');
    else if (targetConfig.height === 'average') traits.push('TARGET IS AVERAGE HEIGHT');
    else if (targetConfig.height === 'tall') traits.push('TARGET IS TALL');

    if (targetConfig.build === 'slim') traits.push('TARGET HAS SLIM BUILD');
    else if (targetConfig.build === 'average') traits.push('TARGET HAS AVERAGE BUILD');
    else if (targetConfig.build === 'heavy') traits.push('TARGET HAS HEAVY BUILD');

    if (targetConfig.movement === 'normal') traits.push('TARGET MOVES NORMALLY');
    else if (targetConfig.movement === 'fast') traits.push('TARGET MOVES FAST');
    else if (targetConfig.movement === 'irregular') traits.push('TARGET MOVES IRREGULARLY');

    if (targetConfig.hasHat) traits.push('WEARS A HAT');
    if (targetConfig.hasBriefcase) traits.push('CARRIES A BRIEFCASE');

    if (targetConfig.behavior === 'SMOKER') traits.push('KNOWN TO SMOKE');
    else if (targetConfig.behavior === 'PHONE_USER') traits.push('OFTEN ON THE PHONE');
    else if (targetConfig.behavior === 'GUARD') traits.push('ACTS AS A GUARD');
    else if (targetConfig.behavior === 'TALKER') traits.push('OFTEN SEEN TALKING');
    else if (targetConfig.behavior === 'SITTER') traits.push('LIKES TO SIT AROUND');

    // Pick 5 random traits so the briefing isn't too huge
    const finalTraits = Phaser.Math.RND.shuffle(traits).slice(0, 5);

    const types = ['SILENT', 'HIGH_VALUE', 'TIMED'];
    const type = Phaser.Math.RND.pick(types) as any;
    
    let timeLimit = 180;
    if (type === 'HIGH_VALUE') timeLimit = 240;
    if (type === 'TIMED') timeLimit = 120;

    this.currentMission = {
      id: Phaser.Math.RND.uuid(),
      name: Phaser.Math.RND.pick(MISSION_NAMES),
      type,
      timeLimit,
      targetId: 'target_npc',
      clues: finalTraits,
      scansUsed: 0,
      targetProfile: targetConfig // Extraneous property, we'll store it here to read in GameScene
    } as any;

    return this.currentMission;
  }
}
