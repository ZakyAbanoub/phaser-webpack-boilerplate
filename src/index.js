import Phaser from 'phaser';
import PlayScene from './scenes/PlayScene';

const config = {
    //WebGL ( Web Grachics Library) JS API for rendering 2D and 3D graphics
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        //Arcade physics plugin
        default: 'arcade',
        arcade: {
            debug: true,
        },
    },
    scene: [PlayScene]
};

//Loading Assets, such as images, music, animations ...
function preload() {
    this.load.image('sky', 'assets/sky.png');
    this.load.image('bird', 'assets/bird.png');
    this.load.image('pipe', 'assets/pipe.png');
}

// create objects instance
// x
// y
// key of the image
// To have the full screen can i add as argument the half of the width and height or setOrigin to 0

// const VELOCITY = 200
const PIPES_TO_RENDER = 10;

const flapVelocity = 250;

let bird = null;
let pipes = null;

let pipeVerticalDistanceRange = [150, 250];
let pipeHorizontalDistanceRange = [300, 500];
let pipeHorizontalDistance = 0;
let pipeVerticalDistance = 0;

function flap() {
    bird.body.velocity.y = -flapVelocity;
}

function restartBirdPosition() {
    bird.x = initialBirdPosition.x;
    bird.y = initialBirdPosition.y;
    bird.body.velocity.y = 0;
}

function placePipe(uPipe, lPipe) {
    const rightMostX = getRightMostPipe();
    pipeVerticalDistance = Phaser.Math.Between(...pipeVerticalDistanceRange);
    pipeHorizontalDistance = Phaser.Math.Between(...pipeHorizontalDistanceRange);

    // upperPipe = this.physics.add.sprite(pipeHorizontalDistance, pipeVerticalDistance, 'pipe').setOrigin(0, 1);
    // lowerPipe = this.physics.add.sprite(pipeHorizontalDistance, upperPipe.y + pipeVerticalDistance, 'pipe').setOrigin(0, 0);

    uPipe.x = rightMostX + pipeHorizontalDistance;
    uPipe.y = pipeVerticalDistance;

    lPipe.x = uPipe.x;
    lPipe.y = uPipe.y + pipeVerticalDistance;

    function getRightMostPipe() {
        let rightMostX = 0;
        pipes.getChildren().forEach(function(pipe) {
            rightMostX = Math.max(pipe.x, rightMostX);
        });

        return rightMostX;
    }
}

function recyclePipss() {
    const tempPipes = [];
    pipes.getChildren().forEach(pipe => {
        if (pipe.getBounds().right <= 0) {
            tempPipes.push(pipe);
            if (tempPipes.length === 2) {
                placePipe(...tempPipes);
            }
        }
    });
}

const initialBirdPosition = { x: config.width * 0.1, y: config.height / 2 };

function create() {
    this.add.image(0, 0, 'sky').setOrigin(0);
    bird = this.physics.add.sprite(initialBirdPosition.x, initialBirdPosition.y, 'bird');
    bird.body.gravity.y = 400;

    pipes = this.physics.add.group();

    for (let i = 0; i < PIPES_TO_RENDER; i++) {
        const upperPipe = pipes.create(0, 0, 'pipe').setOrigin(0, 1);
        const lowerPipe = pipes.create(0, 0, 'pipe').setOrigin(0, 0);
        placePipe(upperPipe, lowerPipe);
    }

    pipes.setVelocityX(-100);

    this.input.on('pointerdown', flap);

    this.input.keyboard.on('keydown_SPACE', flap);
}

// 60 fps
// 60 times per second
// 60 * 16ms = 1000ms
//Gravity t0 = 0px/
// t1 = 200px/s
// t2 = 400px/s
function update(time, delta) {
    if (bird.y - bird.height <= 0 || bird.y >= config.height - bird.height) {
        restartBirdPosition();
    }

    recyclePipss();
    // console.log(delta);
    // totalDelta += delta;
    // if (totalDelta < 1000) {
    //   return;
    // }
    // console.log(bird.body.velocity.y);
    // totalDelta = 0;
}

new Phaser.Game(config);
