var config = {
  type: Phaser.WEBGL,
  parent: "phaser-example",
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
  transparent: true,
  scale: {
    mode: Phaser.Scale.RESIZE,
  },
};
var play = false;
var game = new Phaser.Game(config);

function preload() {
  this.load.scenePlugin(
    "LightningPlugin",
    "./LightningPlugin.js",
    null,
    "lightning"
  );
}

function stop() {
  console.log("stop");
  window.play = false;
}

function start() {
  console.log("stop");
  window.play = true;
}

function create() {
  console.log("create");

  this.counter = 0;
}
function update(time, delta) {
  if (window.play) {
    if (time - this.counter > 100) {
      const { width, height } = this.sys.game.canvas;
      this.counter = time;
      this.lightningGenerator = this.lightning.add(Math.random() * 3 + 9);

      const lightningGraphics = this.add.graphics({ x: 30, y: 30 });

      createLightning = createLightning.bind(this);

        createLightning(lightningGraphics, {
          x: Math.floor(Math.random() * width/2)+width/2,
          y: Math.floor(Math.random() * height/2)+height/2,
        });
 
    }
  }
}

function createLightning(lightningGraphics, finalPos) {
  // console.log("createLightning");
  lightningGraphics.clear();

  const lightning = this.lightningGenerator.generate({ x: 0, y: 0 }, finalPos);

  const lineSize = 3;
  const color = 0xdedeff;
  lightning.forEach((s) => {
    if (s.level === 1) {
      lightningGraphics.lineStyle(lineSize, color, 1);
    } else {
      lightningGraphics.lineStyle(
        lineSize - lineSize / s.level,
        color,
        1 - s.level / 20
      );
    }
    lightningGraphics.beginPath();
    lightningGraphics.moveTo(s.startPoint.x, s.startPoint.y);
    lightningGraphics.lineTo(s.endPoint.x, s.endPoint.y);
    lightningGraphics.closePath();
    lightningGraphics.strokePath();
  });

   const lineSize2 = 1;
  const color2 = 0x0000AA;
  lightning.forEach((s) => {
    if (s.level === 1) {
      lightningGraphics.lineStyle(lineSize2, color2, 0.7);
    } else {
      lightningGraphics.lineStyle(
        lineSize2 - lineSize2 / s.level,
        color2,
        0.7 - s.level / 20
      );
    }
    lightningGraphics.beginPath();
    lightningGraphics.moveTo(s.startPoint.x, s.startPoint.y);
    lightningGraphics.lineTo(s.endPoint.x, s.endPoint.y);
    lightningGraphics.closePath();
    lightningGraphics.strokePath();
  }); 

  let tween = this.tweens.add({
    targets: lightningGraphics,
    duration: 400,
    alpha: 0,
    state: 1,
    ease: Phaser.Math.Easing.Quadratic.Out,
    onComplete: ()=>{
      lightningGraphics.destroy();
    }
  });
}
