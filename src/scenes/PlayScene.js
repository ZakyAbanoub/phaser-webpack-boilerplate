import Phaser from 'phaser';

const PIPES_TO_RENDER = 4;

class PlayScene extends Phaser.Scene {
    constructor(config) {
        super('PlayScene');
        this.config = config;

        this.bird = null;
        this.pipes = null;

        this.pipeVerticalDistanceRange = [150, 250];
        this.pipeHorizontalDistanceRange = [300, 500];
        this.pipeHorizontalDistance = 0;
        this.pipeVerticalDistance = 0;
        this.flapVelocity = 250;
    }

    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('bird', 'assets/bird.png');
        this.load.image('pipe', 'assets/pipe.png');
    }

    create() {
        this.createBG();
        this.createBird();
        this.createPipes();
        this.createColliders();
        this.hanleInputs();
    }
    update() {
        this.checkGamesStatus();
        this.recyclePipes();
    }

    createBG() {
        this.add.image(0, 0, 'sky').setOrigin(0);
    }

    createBird() {
        this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, 'bird');
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

    hanleInputs() {
        this.input.on('pointerdown', this.flap, this);
        this.input.keyboard.on('keydown_SPACE', this.flap, this);
    }

    checkGamesStatus() {
        console.log(this.bird.y);
        if (this.bird.getBounds().bottom >= this.config.height || this.bird.getBounds().top <= 0) {
            this.gameOver();
        }
    }

    placePipe(uPipe, lPipe) {
        const rightMostX = this.getRightMostPipe();
        this.pipeVerticalDistance = Phaser.Math.Between(...this.pipeVerticalDistanceRange);
        this.pipeHorizontalDistance = Phaser.Math.Between(...this.pipeHorizontalDistanceRange);

        // upperPipe = this.physics.add.sprite(pipeHorizontalDistance, pipeVerticalDistance, 'pipe').setOrigin(0, 1);
        // lowerPipe = this.physics.add.sprite(pipeHorizontalDistance, upperPipe.y + pipeVerticalDistance, 'pipe').setOrigin(0, 0);

        uPipe.x = rightMostX + this.pipeHorizontalDistance;
        uPipe.y = this.pipeVerticalDistance;

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
                }
            }
        });
    }

    flap() {
        this.bird.body.velocity.y = -this.flapVelocity;
    }

    gameOver() {
        this.physics.pause();
        this.bird.setTint(0xff0000);

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
