import Phaser from 'phaser';
import PlayScene from './scenes/PlayScene';

const WIDTH = 800;
const HEIGHT = 600;
const BIRD_POSITION = { x: WIDTH * 0.1, y: HEIGHT / 2 };

const SHARED_CONFIG = {
    width: WIDTH,
    height: HEIGHT,
    startPosition: BIRD_POSITION,
};

const config = {
    //WebGL ( Web Grachics Library) JS API for rendering 2D and 3D graphics
    type: Phaser.AUTO,
    ...SHARED_CONFIG,
    physics: {
        //Arcade physics plugin
        default: 'arcade',
        arcade: {
            debug: true,
        },
    },
    scene: [new PlayScene(SHARED_CONFIG)],
};

new Phaser.Game(config);
