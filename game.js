//1.schritt die game.js einbinden in die HTML/anfangseinstellungen Kaboom
kaboom({
  global: true,
  fullscreen: true,
  scale: 1.5,
  debug: true,
  clearColor: [0, 0, 0, 1],
});

//7.schritt,zb gewschindikeit, sprung,..
const MOVE_SPEED = 200;
const JUMP_FORCE = 480;
const BIG_JUMP_FORCE = 550;
let CURRENT_JUMP_FORCE = JUMP_FORCE;
let isJumping = true;
const FALL_DEATH = 400;

//3.schritt
//level1
loadSprite("coin", "items/wbKxhcd.png"); //taler
loadSprite("evil-shroom", "items/KPO3fR9.png"); //fiecher
loadSprite("brick", "items/pogC9x5.png"); //Stein-Braun
loadSprite("block", "items/M6rwarW.png"); //Baustein-Braun
loadSprite("mario", "items/Wb1qfhK.png"); //Mario
loadSprite("mushroom", "items/0wMd92p.png"); //Pilz
loadSprite("surprise", "items/gesQ1KP.png"); //überraschungs-box
loadSprite("unboxed", "items/bdrLpi6.png"); //leere-box
loadSprite("pipe-top-left", "items/ReTPiWY.png"); //rohr-oben-rechts
loadSprite("pipe-top-right", "items/hj2GK4n.png"); //rohr-oben-links
loadSprite("pipe-bottom-left", "items/c1cYSbt.png"); //rohr-unten-links
loadSprite("pipe-bottom-right", "items/nqQ79eI.png"); //rohr-oben-rechts
//level2
loadSprite("blue-block", "items/nqQ79eI.png");
loadSprite("blue-brick", "items/3e5YRQd.png");
loadSprite("blue-steel", "items/gqVoI2b.png");
loadSprite("blue-evil-shroom", "items/SvV4ueD.png");
loadSprite("blue-surprise", "items/RMqCc1G.png");

//2.schritt szene aufstellen funktion schreiben ohne Ihnhalt/aufbau, => zu loadSprite:
scene("game", ({ level, score }) => {
  layers(["bg", "obj", "ui"], "obj");

  const maps = [
    [
      "            $                   ==            $           $$$$$     $     $    $                                                                                                                       ",
      "      $             $                                     $         $     $    $                                                                                                                       ",
      "      $             $                                     $  $$$    $     $    $                                                                                                                       ",
      "      $             $               ===                   $    $    $     $    $                  $                                           ===                                                      ",
      "                                    $$$                   $$$$$$    $$$$$$$    $$$$$            $ $ $                                         $$$                                           $$$$$$$$$  ",
      "              $                                                                                   $              $                                                                          $       $  ",
      "              $         ========             ===                                                                 $                                                                          $ $ $ $ $  ",
      "              $                                       ===%========     ========      ======   ======             $                                                                                  $  ",
      "                                                                                                           ============                                                                             $  ",
      "         =%=*=    =%=                           ====   =*====%=                                                                                                                                     $  ",
      "                                                                                                                                                                                                    -+ ",
      "                          ^                                                         ^            ^                                                                                               ^  () ",
      "==========================================    ======================================================================================     ===============================================================",
    ],
    [
      "£             $$$$$$$              $$$$$ £",
      "£               $$$$               $$$$$ £",
      "£    $$$$$$$$$$$$$$$$$$$$$$$$$         $ £",
      "£$$$$$$$      $$$$$$          $$$$$$   $ £",
      "£                 $$$$$                $ £",
      "£        @@@@@@              x x       $ £",
      "£                  $$$$$$   x x x      $ £",
      "£                        x x x x  x   -+ £",
      "£               z   z  x x x x x  x   () £",
      "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
    ],
    [
      "£                                        £",
      "£                                  $$$$$ £",
      "£                                  $$$$$ £",
      "£                                      $ £",
      "£                                      $ £",
      "£        @@   @@   @@       @@         $ £",
      "£                                      $ £",
      "£                                 x   -+ £",
      "£      ^       ^  z   z   x    x  x   () £",
      "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
    ],
    [
      "£                                        £",
      "£                                 $$$$$$ £",
      "£                                 $$$$$$ £",
      "£                                 $$$$$$ £",
      "£                                      $ £",
      "£        @@@@@@     ^    ^     x x     $ £",
      "£ !!!!!  !!!!!!   !!!!!!!    !!!!!!    $ £",
      "£                                     -+ £",
      "£       ^    ^    z   z        ^^     () £",
      "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",
    ],
  ];

  //4.schritt
  const levelCfg = {
    width: 20,
    height: 30,
    "=": [sprite("block"), solid()],
    $: [sprite("coin"), "coin"],
    "%": [sprite("surprise"), solid(), "coin-surprise"],
    "*": [sprite("surprise"), solid(), "mushroom-surprise"],
    "}": [sprite("unboxed"), solid()],
    "(": [sprite("pipe-bottom-left"), solid(), scale(0.9), "pipe"],
    ")": [sprite("pipe-bottom-right"), solid(), scale(0.9), "pipe"],
    "-": [sprite("pipe-top-left"), solid(), scale(0.9)],
    "+": [sprite("pipe-top-right"), solid(), scale(0.9)],
    "^": [sprite("evil-shroom"), solid(), "dangerous", scale(1.5)],
    "#": [sprite("mushroom"), solid(), "mushroom", body()],
    "!": [sprite("blue-block"), solid(), scale(1)],
    "€": [sprite("blue-brick"), solid(), scale(1)],
    z: [sprite("blue-evil-shroom"), solid(), scale(1), "dangerous"],
    "@": [sprite("blue-surprise"), solid(), scale(1), "coin-surprise"],
    x: [sprite("blue-steel"), solid(), scale(1)],
  };

  const gameLevel = addLevel(maps[level], levelCfg);

  //6.schritt scorelabel hinzufügen in der level
  const scoreLabel = add([
    text("score"),
    pos(30, 6),
    layer("ui"),
    {
      value: "score",
    },
  ]);
  add([text("level" + parseInt(level + 1)), pos(40, 6)]);

  //8.schritt Mario wird groß +++++++++++++IF+++++++++++++++
  function big() {
    let timer = 0;
    let isBig = false;
    return {
      update() {
        if (isBig) {
          CURRENT_JUMP_FORCE = BIG_JUMP_FORCE;
          timer -= dt();
          if (timer <= 0) {
            this.smallify();
          }
        }
      },
      isBig() {
        return isBig;
      },
      smallify() {
        this.scale = vec2(1);
        CURRENT_JUMP_FORCE = JUMP_FORCE;
        timer = 0;
        isBig = false;
      },
      biggify(time) {
        this.scale = vec2(2);

        timer = time;
        isBig = true;
      },
    };
  }

  //5.schritt Mario Gravitation
  const player = add([
    sprite("mario"),
    solid(),
    scale(1.3), //marios görsse
    pos(30, 0),
    body(),
    big(),
    origin("bot"),
  ]);

  //9.Schritt Marios pilze moven nachdem zerstören der box
  action("mushroom", (m) => {
    m.move(30, 0); //schnelligkein, und die 0 für die X-achse
  });

  //8.schritt mashroom sprouting/sprießen, steine zerstören
  //*********************----IF----*******************************
  //spawn=hervorbringen,vermehren //unboxed-leere-box
  player.on("headbump", (obj) => {
    if (obj.is("coin-surprise")) {
      gameLevel.spawn("$", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("}", obj.gridPos.sub(0, 0));
    }

    if (obj.is("mushroom-surprise")) {
      gameLevel.spawn("#", obj.gridPos.sub(0, 1));
      destroy(obj);
      gameLevel.spawn("}", obj.gridPos.sub(0, 0));
    }
  });

  //10.wenn der player pilz trifft,
  //dann wird Mario endlich gross!

  player.collides("mushroom", (m) => {
    destroy(m);
    player.biggify();
  });

  player.collides("coin", (c) => {
    destroy(c);
    scoreLabel.value++;
    scoreLabel.text = scoreLabel.value;
  });

  //13.schritt die fiecher bewegen sich
  const ENEMY_SPEED = 50;
  action("dangerous", (d) => {
    d.move(-ENEMY_SPEED, 0);
  });

  //!!11.schritt GAME OVER + PUNKTE ZEIGEN
  player.collides("dangerous", (d) => {
    if (isJumping) {
      destroy(d);
    } else {
      go("lose", { score: scoreLabel.value });
    }
  });

  //kameramovement PositionierungCAM
  //14.schritt
  const FALL_DEATH = player.action(() => {
    camPos(player.pos);
    if (player.pos.y >= FALL_DEATH) {
      go("lose", { score: scoreLabel.value });
    }
  });

  //go to Next Level
  player.collides("pipe", () => {
    keyPress("down", () => {
      go("game", {
        level: (level + 1) % maps.length, //looping the levels
        score: scoreLabel.value,
      });
    });
  });

  //TASTATUR//*************IF******************
  //7.Mario Kann gehen, Settings!
  keyDown("left", () => {
    player.move(-MOVE_SPEED, 0);
  });
  keyDown("right", () => {
    player.move(MOVE_SPEED, 0);
  });

  player.action(() => {
    if (player.grounded()) {
      isJumping = false;
    }
  });

  keyPress("up", () => {
    if (player.grounded()) {
      isJumping = true;
      player.jump(CURRENT_JUMP_FORCE);
    }
  });
});

scene("lose", ({ score }) => {
  add([text(score, 32), origin("center"), pos(width() / 2, height() / 2)]);
});

//START GAME
start("game", { level: 0, score: 0 });
