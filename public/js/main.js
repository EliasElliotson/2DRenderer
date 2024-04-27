import { Canvas, Sprite } from './render/render.js'

const app = new Canvas({ width: 1024, height: 512 });
document.body.appendChild(app.view);

const light = new PIXI.lights.PointLight(0xffffff);

const bg = new Sprite("images/BGTextureTest.jpg", "images/BGTextureNORM.jpg");
const block = new Sprite("images/block.png", "images/blockNormalMap.png");
const block1 = new Sprite("images/block.png", "images/blockNormalMap.png");
const block2 = new Sprite("images/block.png", "images/blockNormalMap.png");

block.rotation = Math.PI;
block.position.set(100, 100);
block1.position.set(500, 100);
block2.position.set(300, 400);

light.position.set(525, 160);
app.addSprite(bg, block, block1, block2);

app.stage.addChild(new PIXI.lights.AmbientLight(0x4d4d59, 0.4));
app.stage.addChild(new PIXI.lights.DirectionalLight(0x4d4d59, 1, block1));
app.stage.addChild(light);

app.stage.addEventListener('pointermove', function (event) {
  light.position.copyFrom(event.data.global);
});

app.stage.addEventListener('pointerdown', function (event) {
  const clickLight = new PIXI.lights.PointLight(0xffffff);
  clickLight.position.copyFrom(event.data.global);
  app.stage.addChild(clickLight);
});