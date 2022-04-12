import Phaser from 'phaser';
import PlayScene from './scenes/PlayScene';
import MenuScene from './scenes/MenuScene';
import PreloadScene from './scenes/PreloadScene';
import ScoreScene from './scenes/ScoreScene';
import PauseScene from './scenes/PauseScene';

const WIDTH = 800;
const HEIGHT = 600;
const BIRD_POSITION = { x: WIDTH * 0.1, y: HEIGHT / 2 };

const SHARED_CONFIG = {
    width: WIDTH,
    height: HEIGHT,
    startPosition: BIRD_POSITION,
};

const Scenes = [PreloadScene, MenuScene, PlayScene, ScoreScene, PauseScene];

const initScenes = () => {
    return Scenes.map(Scene => new Scene(SHARED_CONFIG));
};

const config = {
    //WebGL ( Web Grachics Library) JS API for rendering 2D and 3D graphics
    type: Phaser.AUTO,
    ...SHARED_CONFIG,
    pixelArt: true,
    physics: {
        //Arcade physics plugin
        default: 'arcade',
        arcade: {
            // debug: true,
        },
    },
    scene: initScenes(),
};

new Phaser.Game(config);
