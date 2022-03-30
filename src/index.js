import Phaser from "phaser";

//Loading Assets, such as images, music, animations ...
function preload() {
  this.load.image("sky", "assets/sky.png");
  this.load.image("bird", "assets/bird.png");
}

// create objects instance
// x
// y
// key of the image
// To have the full screen can i add as argument the half of the width and height or setOrigin to 0

let bird = null;
let totalDelta = null;

function create() {
  this.add.image(0, 0, "sky").setOrigin(0);
  bird = this.physics.add.sprite(config.width / 10, config.height / 2, "bird");
  // bird.body.gravity.y = 200;
}

// 60 fps
// 60 times per second
// 60 * 16ms = 1000ms
//Gravity t0 = 0px/s
// t1 = 200px/s
// t2 = 400px/s
function update(time, delta) {
  // console.log(delta);
  // totalDelta += delta;
  // if (totalDelta < 1000) {
  //   return;
  // }
  // console.log(bird.body.velocity.y);
  // totalDelta = 0;
}

const config = {
  //WebGL ( Web Grachics Library) JS API for rendering 2D and 3D graphics
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    //Arcade physics plugin
    default: "arcade",
    arcade: {
      gravity: {
        y: 200,
      },
    },
  },
  scene: {
    preload,
    create,
    update,
  },
};

new Phaser.Game(config);
