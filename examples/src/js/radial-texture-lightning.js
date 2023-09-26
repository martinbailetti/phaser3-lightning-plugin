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
  this.lightningCountMax = 100;
  this.lightningArray = [];

  this.timeElapsed = 0;

  this.lightningCount = 0;
  this.counter = 0;
  createLightnings = createLightnings.bind(this);
  createLightnings();
}
function update(time, delta) {
  if (time - this.timeElapsed > 30) {
    this.timeElapsed = time;
    this.lightningArray[this.counter].alpha = 1;
    this.tweens.add({
      targets: this.lightningArray[this.counter],
      duration: 400,
      alpha: 0,
      ease: Phaser.Math.Easing.Quadratic.Out,
      onComplete: () => {
        // lightningGraphics.destroy();
      },
    });

    this.counter++;

    if (this.counter == this.lightningCountMax) {
      this.counter = 0;
    }
  }
}

function createLightnings() {
  const { width, height } = this.sys.game.canvas;

  const lightningGenerator = this.lightning.add(Math.random() * 3 + 7);

  for (let i = 0; i < this.lightningCountMax; i++) {
    var finalPos = {};
    if (Math.random() < 0.5) {
      if (Math.random() < 0.5) {
        //right
        finalPos = {
          x: width,
          y: Math.floor(Math.random() * height),
        };
      } else {
        //down
        finalPos = {
          x: Math.floor(Math.random() * width),
          y: height,
        };
      }
    } else {
      if (Math.random() < 0.5) {
        // left
        finalPos = {
          x: 0,
          y: Math.floor(Math.random() * height),
        };
      } else {
        //up
        finalPos = {
          x: Math.floor(Math.random() * width),
          y: 0,
        };
      }
    }

    const lightningGraphics = this.make.graphics({ x: 0, y: 0 });
    const initialPos = { x: width / 2, y: height / 2 };
    this.lightning = lightningGenerator.generate(initialPos, finalPos);

    this.lightning.forEach((s) => {
      if (s.level === 1) {
        lightningGraphics.lineStyle(1, 0xffffff, 1);
      } else {
        lightningGraphics.lineStyle(1, 0xffffff, 1 - s.level / 4);
      }
      lightningGraphics.beginPath();
      lightningGraphics.moveTo(s.startPoint.x, s.startPoint.y);
      lightningGraphics.lineTo(s.endPoint.x, s.endPoint.y);
      lightningGraphics.closePath();
      lightningGraphics.strokePath();
    });
   
    // Generar una textura a partir de la instancia de Graphics
    lightningGraphics.generateTexture("ray" + i, width, height);
    const image = this.add.image(width / 2, height / 2, "ray" + i);





 /* 
name	type	arguments	Default	description
gameObject	Phaser.GameObjects.GameObject			
A reference to the Game Object that has this fx.

quality	number	<optional>	0	
The quality of the blur effect. Can be either 0 for Low Quality, 1 for Medium Quality or 2 for High Quality.

x	number	<optional>	2	
The horizontal offset of the blur effect.

y	number	<optional>	2	
The vertical offset of the blur effect.

strength	number	<optional>	1	
The strength of the blur effect.

color	number	<optional>	0xffffff	
The color of the blur, as a hex value.

steps	number	<optional>	4	
The number of steps to run the blur effect for. This value should always be an integer.
*/

image.postFX.addBlur(0.5, 0.5, 0.5, 0.1);

/* 

name	type	arguments	Default	description
gameObject	Phaser.GameObjects.GameObject			
A reference to the Game Object that has this fx.

speed	number	<optional>	0.5	
The speed of the Shine effect.

lineWidth	number	<optional>	0.5	
The line width of the Shine effect.

gradient	number	<optional>	3	
The gradient of the Shine effect.

reveal	boolean	<optional>	false	
Does this Shine effect reveal or get added to its target?
*/

image.postFX.addShine(1, 1, 3);









    image.alpha = 0;
    this.lightningArray.push(image);
  }
  console.log(this.lightningArray);
}

function animateLightning(graphics) {
  graphics.alpha = 1;
  this.tweens.add({
    targets: graphics,
    duration: 400,
    alpha: 0,
    state: 1,
    ease: Phaser.Math.Easing.Quadratic.Out,
    onComplete: () => {
      // lightningGraphics.destroy();
    },
  });
}
