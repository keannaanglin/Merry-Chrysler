const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const progressBar = document.querySelector("progress");
let score = 0;
const backgroundImage = new Image();

const newEnemyInterval = 10000;
const scoreIncrementInterval = 500;

function startGame() {
  if (progressBar.value === 0) {
    progressBar.value = 100;
    score = 0;
    enemies.length = 3;
    Object.assign(player, { x: canvas.width / 2, y: canvas.height / 2 });
    requestAnimationFrame(drawScene);
  }
}

setInterval(() => {
  score++;
}, scoreIncrementInterval);

setInterval(createRandomEnemy, newEnemyInterval);

backgroundImage.src =
  "https://image.freepik.com/free-vector/christmas-background-with-pattern-style_23-2147696936.jpg";

const playerUrl =
  "http://images.glaciermedia.ca/polopoly_fs/1.23086813.1510088077!" +
  "/fileImage/httpImage/image.png_gen/derivatives/landscape_804/santa.png";

const enemyUrl =
  "https://orig00.deviantart.net/b7c4/f/2015/342/4/8/" +
  "evil_gingerbread_man_by_camperlv-d9jgpn7.png";

function distanceBetween(sprite1, sprite2) {
  return Math.hypot(sprite1.x - sprite2.x, sprite1.y - sprite2.y);
}

function haveCollided(sprite1, sprite2) {
  return distanceBetween(sprite1, sprite2) < sprite1.radius + sprite2.radius;
}

class Sprite {}

class Player extends Sprite {
  constructor(x, y, radius, color, speed) {
    super();
    this.image = new Image();
    this.image.src = playerUrl;
    Object.assign(this, { x, y, radius, color, speed });
  }
  draw() {
    ctx.drawImage(this.image, this.x, this.y, 25, 30);
  }
}

let player = new Player(250, 150, 15, "lemonchiffon", 0.07);

class Enemy extends Sprite {
  constructor(x, y, radius, color, speed) {
    super();
    this.image = new Image();
    this.image.src = enemyUrl;
    Object.assign(this, { x, y, radius, color, speed });
  }
  draw() {
    ctx.drawImage(this.image, this.x, this.y, 25, 30);
  }
}

function createRandomEnemy() {
  enemies.push(
    new Enemy(
      Math.floor(Math.random() * canvas.width),
      Math.floor(Math.random() * canvas.height),
      12,
      "rgba(200, 100, 0, 0.7)",
      Math.random() * 0.04 + 0.005
    )
  );
}

let enemies = [
  new Enemy(80, 200, 12, "rgba(250, 0, 50, 0.8)", 0.015),
  new Enemy(200, 250, 12, "rgba(200, 100, 0, 0.7)", 0.01),
  new Enemy(150, 180, 12, "rgba(50, 10, 70, 0.5)", 0.02)
];

let mouse = { x: 0, y: 0 };
document.body.addEventListener("mousemove", updateMouse);
function updateMouse(event) {
  const { left, top } = canvas.getBoundingClientRect();
  mouse.x = event.clientX - left;
  mouse.y = event.clientY - top;
}

function moveToward(leader, follower, speed) {
  follower.x += (leader.x - follower.x) * speed;
  follower.y += (leader.y - follower.y) * speed;
}

function pushOff(c1, c2) {
  let [dx, dy] = [c2.x - c1.x, c2.y - c1.y];
  const distanceBetween = Math.hypot(dx, dy);
  let distToMove = c1.radius + c2.radius - L;
  if (distToMove > 0) {
    dx /= distanceBetween;
    dy /= distanceBetween;
    c1.x -= dx * distToMove / 2;
    c1.y -= dy * distToMove / 2;
    c2.x += dx * distToMove / 2;
    c2.y += dy * distToMove / 2;
  }
}
function updateScene() {
  moveToward(mouse, player, player.speed);
  enemies.forEach(enemy => moveToward(player, enemy, enemy.speed));
  enemies.forEach((enemy, i) =>
    pushOff(enemy, enemies[(i + 1) % enemies.length])
  );
  enemies.forEach(enemy => {
    if (haveCollided(enemy, player)) {
      progressBar.value -= 2;
    }
  });
}

function clearBackground() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

function checkIfGameOver() {
  if (progressBar.value <= 0) {
    ctx.fillStyle = "white";
    ctx.strokeStyle = "red";
    ctx.rect(50, 70, 400, 70);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "green";
    ctx.font = "18px Bungee";
    ctx.fillText("Game over, click to play again", 88, 112);
  } else {
    requestAnimationFrame(drawScene);
    document.getElementById("score").innerHTML = score;
  }
}

function drawScene() {
  clearBackground();
  player.draw();
  enemies.forEach(enemy => enemy.draw());
  updateScene();
  checkIfGameOver();
}

canvas.addEventListener("click", startGame);

