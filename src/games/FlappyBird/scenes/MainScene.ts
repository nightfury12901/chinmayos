// @ts-nocheck
/* eslint-disable */
import { grantGameRewards, getHighScore } from '../../GameRewardBridge';

const HIGH_SCORE_KEY = 'chinmayos-flappy-highscore';
const GRAVITY = 1200;
const JUMP_FORCE = -420;
const PIPE_SPEED = -220;
const PIPE_GAP = 165;
const PIPE_INTERVAL = 1900;
const BIRD_X = 100;

let PhaserLib = null;
if (typeof window !== 'undefined') {
  const raw = require('phaser'); PhaserLib = raw?.default ?? raw;
}

const BaseScene = PhaserLib ? PhaserLib.Scene : class {};

export class MainScene extends BaseScene {
  constructor() {
    super({ key: 'MainScene' });
    this.score = 0;
    this.highScore = 0;
    this.alive = false;
    this.started = false;
    this.velocityY = 0;
    this.birdY = 0;
    this.W = 480;
    this.H = 640;
  }

  create() {
    this.highScore = getHighScore(HIGH_SCORE_KEY);

    // Sky
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1a1a3e, 0x1a1a3e, 0x0d1b2a, 0x0d1b2a, 1);
    bg.fillRect(0, 0, this.W, this.H);

    // Ground
    const ground = this.add.graphics();
    ground.fillStyle(0x2d5a27, 1);
    ground.fillRect(0, this.H - 60, this.W, 60);
    ground.fillStyle(0x8b4513, 1);
    ground.fillRect(0, this.H - 20, this.W, 20);

    // Stars
    for (let i = 0; i < 50; i++) {
      const x = PhaserLib.Math.Between(0, this.W);
      const y = PhaserLib.Math.Between(0, Math.floor(this.H * 0.6));
      this.add.circle(x, y, PhaserLib.Math.Between(1, 2), 0xffffff,
        PhaserLib.Math.FloatBetween(0.3, 0.9));
    }

    // Bird
    this.bird = this.add.text(BIRD_X, this.H / 2, '🐦', { fontSize: '32px' }).setOrigin(0.5);
    this.birdY = this.H / 2;

    // Pipes
    this.pipes = this.add.group();

    // Score display
    this.scoreText = this.add.text(this.W / 2, 40, '0', {
      fontSize: '40px', color: '#ffffff', fontFamily: 'Arial', stroke: '#000', strokeThickness: 4,
    }).setOrigin(0.5);

    this.hiScoreText = this.add.text(this.W - 10, 10, `Best: ${this.highScore}`, {
      fontSize: '14px', color: '#ffdd00', fontFamily: 'Arial',
    }).setOrigin(1, 0);

    this.statusText = this.add.text(this.W / 2, this.H / 2 - 80, 'Tap / Space to Start', {
      fontSize: '22px', color: '#ffffff', fontFamily: 'Arial', stroke: '#000', strokeThickness: 3,
      align: 'center',
    }).setOrigin(0.5);

    this.input.on('pointerdown', () => this.jump());
    this.input.keyboard?.on('keydown-SPACE', () => this.jump());
  }

  jump() {
    if (!this.started) { this.startGame(); return; }
    if (!this.alive) { this.restartGame(); return; }
    this.velocityY = JUMP_FORCE;
    this.tweens.add({
      targets: this.bird, angle: -25, duration: 80,
      onComplete: () => this.tweens.add({ targets: this.bird, angle: 25, duration: 300 }),
    });
  }

  startGame() {
    this.started = true;
    this.alive = true;
    this.score = 0;
    this.velocityY = JUMP_FORCE;
    this.statusText.setVisible(false);
    this.pipeTimer = this.time.addEvent({
      delay: PIPE_INTERVAL, callback: this.spawnPipe, callbackScope: this, loop: true,
    });
    this.spawnPipe();
  }

  restartGame() {
    this.birdY = this.H / 2;
    this.bird.setPosition(BIRD_X, this.birdY);
    this.bird.setAngle(0);
    this.pipes.clear(true, true);
    this.pipeTimer?.destroy();
    this.score = 0;
    this.scoreText.setText('0');
    this.startGame();
  }

  spawnPipe() {
    const gapY = PhaserLib.Math.Between(160, this.H - 160 - PIPE_GAP);
    const pipeW = 60;

    const topPipe = this.add.graphics();
    topPipe.fillStyle(0x2ecc71, 1);
    topPipe.fillRect(0, 0, pipeW, gapY);
    topPipe.fillStyle(0x27ae60, 1);
    topPipe.fillRect(-8, gapY - 28, pipeW + 16, 28);
    topPipe.setPosition(this.W + pipeW / 2, 0);
    topPipe.setData('scored', false);
    topPipe.setData('type', 'top');
    topPipe.setData('gapY', gapY);

    const bottomY = gapY + PIPE_GAP;
    const bottomH = this.H - bottomY - 60;
    const botPipe = this.add.graphics();
    botPipe.fillStyle(0x2ecc71, 1);
    botPipe.fillRect(0, 0, pipeW, bottomH);
    botPipe.fillStyle(0x27ae60, 1);
    botPipe.fillRect(-8, 0, pipeW + 16, 28);
    botPipe.setPosition(this.W + pipeW / 2, bottomY);
    botPipe.setData('type', 'bot');

    this.pipes.addMultiple([topPipe, botPipe]);
  }

  update(_, delta) {
    if (!this.alive || !this.started) return;
    const dt = delta / 1000;
    this.velocityY += GRAVITY * dt;
    this.birdY += this.velocityY * dt;
    this.bird.setY(this.birdY);

    if (this.birdY > this.H - 60 || this.birdY < 0) { this.die(); return; }

    this.pipes.getChildren().forEach((pipe) => {
      pipe.x += PIPE_SPEED * dt;

      if (!pipe.getData('scored') && pipe.getData('type') === 'top' && pipe.x < BIRD_X) {
        pipe.setData('scored', true);
        this.score++;
        this.scoreText.setText(String(this.score));
        if (this.score > this.highScore) {
          this.highScore = this.score;
          this.hiScoreText.setText(`Best: ${this.highScore}`);
        }
      }

      const pipeW = 60, birdSize = 20;
      const birdLeft = BIRD_X - birdSize, birdRight = BIRD_X + birdSize;
      const birdTop = this.birdY - birdSize, birdBottom = this.birdY + birdSize;

      if (birdRight > pipe.x - 8 && birdLeft < pipe.x + pipeW + 8) {
        const gapY = pipe.getData('gapY');
        if (gapY !== undefined) {
          if (birdTop < gapY) { this.die(); return; }
        } else {
          if (birdBottom > pipe.y) { this.die(); return; }
        }
      }

      if (pipe.x < -80) this.pipes.remove(pipe, true, true);
    });
  }

  die() {
    this.alive = false;
    this.pipeTimer?.destroy();
    this.cameras.main.shake(200, 0.015);
    this.bird.setText('💥');
    const { xp, coins, isHighScore } = grantGameRewards({
      score: this.score, xpPerScore: 2, baseXP: 50, coinsPerScore: 1, highScoreKey: HIGH_SCORE_KEY,
    });
    this.time.delayedCall(500, () => {
      this.statusText.setText(
        `💀 Game Over!\nScore: ${this.score} | Best: ${this.highScore}\n+${xp} XP · +${coins} 🪙${isHighScore ? '\n🏆 NEW HIGH SCORE!' : ''}\n\nTap to restart`
      ).setVisible(true);
      this.bird.setText('🐦');
    });
  }
}
