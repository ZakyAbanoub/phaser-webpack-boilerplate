import Phaser from "phaser";

//Loading Assets, such as images, music, animations ...
function preload() {
  this.load.image('sky', 'assets/sky.png')
}

// create objects instance 
function create(){
  
}

const config = {
  //WebGL ( Web Grachics Library) JS API for rendering 2D and 3D graphics
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    //Arcade physics plugin
    default: "arcade",
  },
  scene: {
    preload,
    create,
  }
};



new Phaser.Game(config);
