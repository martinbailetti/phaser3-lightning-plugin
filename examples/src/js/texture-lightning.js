var config = {
  type: Phaser.WEBGL,
  parent: "phaser-example",
  scene: {
    preload: preload,
    create: create,
  },
};

var game = new Phaser.Game(config);

function preload() {
  this.load.scenePlugin(
    "LightningPlugin",
    "./LightningPlugin.js",
    null,
    "lightning"
  );
}

function create() {
  this.visible = false;
  this.image = null;
  //  Create the lightning generator
  this.lightningGenerator = this.lightning.add(10);

  this.lightningGraphics = this.make.graphics({ x: 0, y: 0 });

  createLightning = createLightning.bind(this);
  hideLightning = hideLightning.bind(this);

  createLightning();

  this.input.on("pointerdown", () => {
    this.visible = !this.visible;
    if (this.visible) {
      hideLightning();
    } else {
      createLightning();
    }
  });
}

function hideLightning() {
  this.image.alpha = 0;
}
function createLightning() {
  this.lightningGraphics.clear();
  if (this.image == null) {
    this.lightning = this.lightningGenerator.generate(
      { x: 0, y: 0 },
      { x: 700, y: 700 }
    );

    this.lightning.forEach((s) => {
      if (s.level === 1) {
        this.lightningGraphics.lineStyle(1, 0xffffff, 1);
      } else {
        this.lightningGraphics.lineStyle(1, 0xffffff, 1 - s.level / 4);
      }
      this.lightningGraphics.beginPath();
      this.lightningGraphics.moveTo(s.startPoint.x, s.startPoint.y);
      this.lightningGraphics.lineTo(s.endPoint.x, s.endPoint.y);
      this.lightningGraphics.closePath();
      this.lightningGraphics.strokePath();
    });

    // Generar una textura a partir de la instancia de Graphics
    this.lightningGraphics.generateTexture("ray", 700,700);
    this.image = this.add.image(700/2, 700/2, "ray");
  } else {
    this.image.alpha = 1;
  }
}
