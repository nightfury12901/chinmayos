import Phaser from 'phaser';
import { CONSTANTS } from '../../constants';
import { AudioManager } from './AudioManager';

export type WeatherType = 'CLEAR' | 'LIGHT_RAIN' | 'HEAVY_RAIN' | 'FOG';

export class WeatherSystem {
  private scene: Phaser.Scene;
  public weather: WeatherType = 'CLEAR';
  public windStrength: number = 0; // KPH
  public windDirection: number = 1; // 1 = right, -1 = left

  private rainEmitter?: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  generateWeather() {
    const types: WeatherType[] = ['CLEAR', 'LIGHT_RAIN', 'HEAVY_RAIN', 'FOG'];
    this.weather = Phaser.Math.RND.pick(types);
    this.windDirection = Math.random() > 0.5 ? 1 : -1;

    switch (this.weather) {
      case 'CLEAR':
        this.windStrength = Phaser.Math.FloatBetween(0, 1);
        break;
      case 'LIGHT_RAIN':
      case 'FOG':
        this.windStrength = Phaser.Math.FloatBetween(1, 5);
        break;
      case 'HEAVY_RAIN':
        this.windStrength = Phaser.Math.FloatBetween(3, 8);
        break;
    }
  }

  applyWeather() {
    const { WORLD_WIDTH, WORLD_HEIGHT } = CONSTANTS;

    if (this.weather === 'LIGHT_RAIN' || this.weather === 'HEAVY_RAIN') {
      AudioManager.playRainAmbience();
      
      if (!this.scene.textures.exists('rain_drop')) {
        const g = this.scene.make.graphics({x: 0, y: 0, add: false});
        g.fillStyle(0xffffff, 0.4);
        g.fillRect(0, 0, 1, 3);
        g.generateTexture('rain_drop', 1, 3);
      }

      this.rainEmitter = this.scene.add.particles(0, 0, 'rain_drop', {
        x: { min: -500, max: WORLD_WIDTH + 500 },
        y: -10,
        lifespan: 1500,
        speedY: { min: 400, max: this.weather === 'HEAVY_RAIN' ? 800 : 600 },
        speedX: this.windStrength * 50 * this.windDirection,
        quantity: this.weather === 'HEAVY_RAIN' ? 10 : 3,
        blendMode: 'ADD',
      });
      this.rainEmitter.setScrollFactor(1.0);
      this.rainEmitter.setDepth(99);
    } else {
      AudioManager.stopRainAmbience();
    }

    if (this.weather === 'FOG') {
      const fog = this.scene.add.graphics();
      fog.fillStyle(0xffffff, 0.15);
      fog.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
      fog.setDepth(99);
      fog.setScrollFactor(0);
      
      this.scene.tweens.add({
        targets: fog,
        alpha: 0.25,
        duration: 4000,
        yoyo: true,
        repeat: -1
      });
    }
  }

  stop() {
    AudioManager.stopRainAmbience();
    if (this.rainEmitter) this.rainEmitter.stop();
  }
}
