import BaseScene from './BaseScene';
import Phaser from 'phaser';

const PIPES_TO_RENDER = 4;

class PlayScene extends BaseScene {
    constructor(config) {
        super('PlayScene', config);

        this.bird = null;
        this.pipes = null;
        this.isPaused = false;

        this.pipeHorizontalDistance = 0;
        this.pipeVerticalDistance = 0;
        this.flapVelocity = 250;
        this.score = 0;
        this.scoreText = '';

        this.currentDifficulty = 'easy';
        this.difficulties = {
            easy: {
                pipeHorizontalDistanceRange: [300, 350],
                pipeVerticalDistanceRange: [170, 200],
            },
            normal: {
                pipeHorizontalDistanceRange: [280, 330],
                pipeVerticalDistanceRange: [150, 180],
            },
            hard: {
                pipeHorizontalDistanceRange: [250, 310],
                pipeVerticalDistanceRange: [120, 150],
            },
        };
    }

    create() {
        this.currentDifficulty = 'easy';
        super.create();
        this.createBird();
        this.createPipes();
        this.createColliders();
        this.createScore();
        this.createPause();
        this.hanleInputs();
        this.listenToEvents();

        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('bird', { start: 8, end: 15 }),
            frameRate: 8,
            //repeat infinitely
            repeat: -1,
        });
        this.bird.play('fly');
    }
    update() {
        this.checkGamesStatus();
        this.recyclePipes();
    }

    listenToEvents() {
        if (this.pauseEvent) {
            return;
        }
        this.pauseEvent = this.events.on('resume', () => {
            this.initialTime = 3;
            this.countDownText = this.add.text(...this.screenCenter, `Fly in:  ${this.initialTime}`, this.fontOptions).setOrigin(0.5);
            this.timedEvent = this.time.addEvent({
                delay: 1000,
                callback: this.countDown,
                callbackScope: this,
                loop: true,
            });
        });
    }

    countDown() {
        this.initialTime--;
        this.countDownText.setText(`Fly in ${this.initialTime}`);
        if (this.initialTime <= 0) {
            this.isPaused = false;
            this.countDownText.setText('');
            this.physics.resume();
            this.timedEvent.remove();
        }
    }

    createBird() {
        this.bird = this.physics.add
            .sprite(this.config.startPosition.x, this.config.startPosition.y, 'bird')
            .setFlipX(true)
            .setScale(2)
            .setOrigin(0)

        this.bird.setBodySize(this.bird.width, this.bird.height - 8);
        this.bird.body.gravity.y = 400;
        this.bird.setCollideWorldBounds(true);
    }

    createPipes() {
        this.pipes = this.physics.add.group();

        for (let i = 0; i < PIPES_TO_RENDER; i++) {
            const upperPipe = this.pipes
                .create(0, 0, 'pipe')
                .setImmovable(true)
                .setOrigin(0, 1);
            const lowerPipe = this.pipes
                .create(0, 0, 'pipe')
                .setImmovable(true)
                .setOrigin(0, 0);
            this.placePipe(upperPipe, lowerPipe);
        }

        this.pipes.setVelocityX(-100);
    }

    createColliders() {
        this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
    }

    createScore() {
        this.score = 0;
        const bestScore = localStorage.getItem('bestScore');
        this.scoreText = this.add.text(16, 16, `Score: ${0}`, { fontSize: '32px', fill: '#000' });
        this.bestScore = 0;
        this.bestScoreText = this.add.text(16, 48, `Best Score: ${bestScore || 0}`, { fontSize: '16px', fill: '#000' });
    }

    createPause() {
        this.isPaused = false;
        const pauseButton = this.add
            .image(this.config.width - 10, this.config.height - 10, 'pause')
            .setInteractive()
            .setScale(3)
            .setOrigin(1);
        pauseButton.on('pointerdown', () => {
            this.isPaused = true;
            this.physics.pause();
            this.scene.pause();
            this.scene.launch('PauseScene');
        });
    }

    hanleInputs() {
        this.input.on('pointerdown', this.flap, this);
        this.input.keyboard.on('keydown_SPACE', this.flap, this);
    }

    checkGamesStatus() {
        // console.log(this.bird.y);
        if (this.bird.getBounds().bottom >= this.config.height || this.bird.getBounds().top <= 0) {
            this.gameOver();
        }
    }

    placePipe(uPipe, lPipe) {
        const difficulty = this.difficulties[this.currentDifficulty];
        const rightMostX = this.getRightMostPipe();
        const pipeVerticalPosition = Phaser.Math.Between(0 + 20, this.config.height - 20 - this.pipeVerticalDistance);
        this.pipeVerticalDistance = Phaser.Math.Between(...difficulty.pipeVerticalDistanceRange);
        this.pipeHorizontalDistance = Phaser.Math.Between(...difficulty.pipeHorizontalDistanceRange);

        // upperPipe = this.physics.add.sprite(pipeHorizontalDistance, pipeVerticalDistance, 'pipe').setOrigin(0, 1);
        // lowerPipe = this.physics.add.sprite(pipeHorizontalDistance, upperPipe.y + pipeVerticalDistance, 'pipe').setOrigin(0, 0);

        uPipe.x = rightMostX + this.pipeHorizontalDistance;
        uPipe.y = pipeVerticalPosition;

        lPipe.x = uPipe.x;
        lPipe.y = uPipe.y + this.pipeVerticalDistance;
    }

    getRightMostPipe() {
        let rightMostX = 0;
        this.pipes.getChildren().forEach(function(pipe) {
            rightMostX = Math.max(pipe.x, rightMostX);
        });

        return rightMostX;
    }

    recyclePipes() {
        const tempPipes = [];
        this.pipes.getChildren().forEach(pipe => {
            if (pipe.getBounds().right <= 0) {
                tempPipes.push(pipe);
                if (tempPipes.length === 2) {
                    this.placePipe(...tempPipes);
                    this.increaseScore();
                    this.saveBestScore();
                    this.increaseDifficulty();
                }
            }
        });
    }

    increaseDifficulty() {
        console.log(this.currentDifficulty);
        if (this.score === 1) {
            this.currentDifficulty = 'normal';
        }

        if (this.score === 3) {
            this.currentDifficulty = 'hard';
        }
    }

    flap() {
        if (this.isPaused) {
            return;
        }
        this.bird.body.velocity.y = -this.flapVelocity;
    }

    increaseScore() {
        this.score++;
        this.scoreText.setText(`Score: ${this.score}`);
    }

    saveBestScore() {
        const bestScoreText = localStorage.getItem('bestScore');
        const bestScore = bestScoreText && parseInt(bestScoreText, 10);

        if (!bestScore || this.score > bestScore) {
            localStorage.setItem('bestScore', this.score);
        }
    }

    gameOver() {
        this.physics.pause();
        this.bird.setTint(0xff0000);
        this.saveBestScore();

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.scene.restart();
            },
            loop: false,
        });
    }
}

export default PlayScene;
