import symbolsSpriteJson from "../assets/symbols-sprite.json";
import Reel from "../components/Reel.js";
import { reelsLayoutConfig } from "../config/Config.js";
import { fakeWinners, fakeLoosers } from "../fake/Fake";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({
      key: "MainScene",
    });
    this.stopped = false;
    this.gamesCount = 0;
    this.backgroundCenter = null;
    this.reels = [];
    this.imageSize = 0;
    reelsLayoutConfig.rows = 3; // rows to thow
    this.reelsDisplay = reelsLayoutConfig.display;
    this.layout = {
      reelsRect: {},
    };

    this.reelsEnded = 0;
    this.winnerAnimationsEnded = 0;

    this.reelsConfig = [
      {
        symbols: [
          { texture: "apple" },
          { texture: "lemon" },
          { texture: "coin" },
          { texture: "blueberries" },
          { texture: "cherry" },
          { texture: "strawberry" },
          { texture: "coin" },
          { texture: "grapes" },
        ],
      },
      {
        symbols: [
          { texture: "blueberries" },
          { texture: "coin" },
          { texture: "lemon" },
          { texture: "apple" },
          { texture: "coconut" },
          { texture: "coin" },
          { texture: "cherry" },
        ],
      },
      {
        symbols: [
          { texture: "coin" },
          { texture: "strawberry" },
          { texture: "coin" },
          { texture: "apple" },
          { texture: "coconut" },
          { texture: "banana" },
          { texture: "cherry" },
        ],
      },
    ];

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    this.status = "ready";
  }

  winnerAnimationEnded() {
    this.winnerAnimationsEnded++;
    if (this.winnerAnimationsEnded === this.reelsConfig.length) {
      console.log("winnerAnimationsEnded", this.winnerAnimationsEnded);
      this.gameOver();
    }
  }

  gameOver() {
    this.spinningLoop.stop();
      window.parent.postMessage(
        JSON.stringify({ id: "golden-dolly-game-ended", winner: this.winner }),
        "*"
      );;
  }

  reelEnded() {
    this.reelsEnded++;
    if (this.reelsEnded === this.reelsConfig.length) {
      console.log("reelEnded", this.reelsEnded);
      this.gamesCount++;
      this.status = "ready";
      this.reels.forEach((reel) => reel.showWinnerAnimations());
    }
  }

  prepareLayout() {
    console.log("_______> IFRAME");
    const { width, height } = this.sys.game.canvas;

    const reelWidth = width * reelsLayoutConfig.container.windowPercentWidth;
    this.imageSize = reelWidth / this.reelsConfig.length;

    const reelHeight = reelsLayoutConfig.rows * this.imageSize;

    if (height - reelHeight < reelsLayoutConfig.marginBottomMin) {
      this.imageSize =
        (height - reelsLayoutConfig.marginBottomMin) / reelsLayoutConfig.rows;
    }

    this.imageSize = this.imageSize;

    let spaceX =
      (reelWidth - this.imageSize * this.reelsConfig.length) /
      (this.reelsConfig.length - 1);

    if (this.reelsDisplay === "space-evenly") {
      spaceX =
        (reelWidth - this.imageSize * this.reelsConfig.length) /
        (this.reelsConfig.length + 1);
    } else if (this.reelsDisplay === "space-around") {
      spaceX = (reelWidth - this.imageSize * this.reelsConfig.length) / 2;
    }

    spaceX = spaceX;

    this.layout.reelsRect = {
      x: (width * (1 - reelsLayoutConfig.container.windowPercentWidth)) / 2,
      y: reelsLayoutConfig.container.y,
      width: reelWidth,
      height: reelsLayoutConfig.rows * this.imageSize,
      spaceX: spaceX,
    };
  }

  /** @returns {void} */
  editorCreate() {
    console.log("editorCreate");
    const { width, height } = this.sys.game.canvas;

    this.backgroundCenter = this.add.tileSprite(
      width / 2,
      height / 2,
      width,
      height,
      "backgroundCenter"
    );

    this.prepareLayout();

    this.reels = this.reelsConfig.map((reel, index) => {
      let spaceX = index > 0 ? this.layout.reelsRect.spaceX * index : 0;

      if (this.reelsDisplay === "space-evenly") {
        spaceX = this.layout.reelsRect.spaceX * (index + 1);
      } else if (this.reelsDisplay === "space-around") {
        spaceX = this.layout.reelsRect.spaceX;
      }

      const container = this.add.container(
        this.layout.reelsRect.x + this.imageSize * index + spaceX,
        reelsLayoutConfig.container.y
      );

      return new Reel(container, reel, index);
    });

    this.spinningLoop = this.sound.add("spinningLoop", {
      loop: true,
      volume: 0.1,
    });
    this.reels.forEach((reel, index) => {
      reel.displayReel();
    });
    this.events.emit("scene-awake");

    window.addEventListener("message", this.processMessages, false);
  }

  processMessages = (event) => {
    try {
      JSON.parse(event.data);
    } catch (e) {
      console.log("Postmessage JSON error: " + event.data);
      return false;
    }
    const json = JSON.parse(event.data);

    if (json.id === "start") {
      this.winner = json.winner;
      this.start();
      console.log("postmessage", json);
    }
  };
  start = () => {
    this.scale.on("resize", this.resize, this);
    if (this.status === "spinning" && !this.stopped) {
      console.log("this.status === spinning && !this.stopped");

      this.stopped = true;
      this.spinningLoop.stop();
      this.reels.forEach((reel, index) => {
        reel.stopSpin(500 * index);
      });
    } else if (this.status === "ready") {
      console.log("this.status === ready");
      this.stopped = false;
      this.reelsEnded = 0;
      this.winnerAnimationsEnded = 0;
      this.status = "spinning";
      this.spinningLoop.play();
      const winner = Math.floor(Math.random() * fakeWinners.length);
      const looser = Math.floor(Math.random() * fakeLoosers.length);
      this.reels.forEach((reel, index) => {
        reel.startSpin(
          this.winner ? fakeWinners[winner][index] : fakeLoosers[looser][index],
          500 * index
        );
      });
    }
  };

  create() {
    this.editorCreate();
  }

  resize(gameSize, baseSize, displaySize, resolution) {
    /*     console.log("gameSize", gameSize);
    console.log("baseSize", baseSize);
    console.log("displaySize", displaySize);
    console.log("resolution", resolution);
    console.log("this.sys.game.canvas", this.sys.game.canvas); */

    const { width, height } = this.sys.game.canvas;

    this.prepareLayout();
    this.backgroundCenter.x = width / 2;
    this.backgroundCenter.y = height / 2;
    this.backgroundCenter.width = width;
    this.backgroundCenter.height = height;

    this.reels.forEach((reel, index) => {
      let spaceX = index > 0 ? this.layout.reelsRect.spaceX * index : 0;

      if (this.reelsDisplay === "space-evenly") {
        spaceX = this.layout.reelsRect.spaceX * (index + 1);
      } else if (this.reelsDisplay === "space-around") {
        spaceX = this.layout.reelsRect.spaceX;
      }
      console.log("reel, index", reel.x, reel.y, reel, index);
      reel.setContainerPosition(
        this.layout.reelsRect.x + this.imageSize * index + spaceX,
        reelsLayoutConfig.container.y
      );
      reel.resize();
    });
  }

  preload() {
    this.load.spritesheet("coinsSprite", "src/assets/sprite-coins-all.png", {
      frameWidth: 150,
      frameHeight: 150,
    });

    this.load.image("backgroundCenter", "src/assets/images/bg-center.jpg");
    this.load.audio("boing", ["src/assets/audio/boing.mp3"]);
    this.load.audio("start", ["src/assets/audio/giggle5.mp3"]);
    this.load.audio("spinningLoop", ["src/assets/audio/bassloop.mp3"]);
    this.load.atlas(
      "symbols",
      "src/assets/symbols3-sprite.png",
      symbolsSpriteJson
    );
  }
}
