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
  this.lightningCountMax = 50;
  this.lightningGraphicsArray = [];

  this.lightningCount = 0;
  this.counter = 0;
}
function update(time, delta) {
  if (window.play) {
    if (time - this.counter > 30) {
      const { width, height } = this.sys.game.canvas;
      this.counter = time;
      this.lightningGenerator = this.lightning.add(Math.random() * 3 + 7);

      const lightningGraphics = this.add.graphics({ x: 0, y: 0 });

      createLightning = createLightning.bind(this);
      animateLightning = animateLightning.bind(this);
      console.log("lightningCount = ", this.lightningCount);

      if (this.lightningGraphicsArray.length <= this.lightningCountMax) {
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

        createLightning(lightningGraphics, finalPos);
      } else {
        animateLightning(this.lightningGraphicsArray[this.lightningCount]);
        this.lightningCount++;
        if (this.lightningCount === this.lightningGraphicsArray.length) {
          this.lightningCount = 0;
        }
      }
    }
  }
}

function createLightning(lightningGraphics, finalPos) {
  lightningGraphics.clear();
  const { width, height } = this.sys.game.canvas;

  lightning = this.lightningGenerator.generate(
    { x: width / 2, y: height / 2 },
    finalPos
  );

  const lineSize = 3;
  const color = 0xaaaaff;
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

/*   const lineSize2 = 1;
  const color2 = 0x2222ff;
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
  }); */
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

  lightningGraphics.postFX.addBlur(0.5, 0.5, 0.5, 0.2);


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

  lightningGraphics.postFX.addShine(1,23, 3);

  this.tweens.add({
    targets: lightningGraphics,
    duration: 400,
    alpha: 0,
    state: 1,
    ease: Phaser.Math.Easing.Quadratic.Out,
    onComplete: () => {
      // lightningGraphics.destroy();
    },
  });

  this.lightningGraphicsArray.push(lightningGraphics);
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
