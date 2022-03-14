import Phaser from "phaser";

const config = {
  //WebGL ( Web Grachics Library) JS API for rendering 2D and 3D graphics
  type: Phaser.AUTO,
  width: "100%",
  height: "100%",
  physics: {
    //Arcade physics plugin
    default: "arcade",
  },
};

new Phaser.Game(config);
