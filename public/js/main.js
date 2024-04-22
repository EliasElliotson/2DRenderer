const app = new PIXI.Application({ width: 1024, height: 512 });
document.body.appendChild(app.view);

const stage = app.stage = new PIXI.layers.Stage();
const light = new PIXI.lights.PointLight(0xffffff, 1);

// put all layers for deferred rendering of normals
stage.addChild(new PIXI.layers.Layer(PIXI.lights.diffuseGroup));
stage.addChild(new PIXI.layers.Layer(PIXI.lights.normalGroup));
stage.addChild(new PIXI.layers.Layer(PIXI.lights.lightGroup));

PIXI.Assets.addBundle('textures', {
    bg_diffuse: 'images/BGTextureTest.jpg',
    bg_normal: 'images/BGTextureNORM.jpg',
    block_diffuse: 'images/block.png',
    block_normal: 'images/blockNormalMap.png',
});

function createPair(diffuseTex, normalTex) {
    const container = new PIXI.Container();
    const diffuseSprite = new PIXI.Sprite(diffuseTex);
    diffuseSprite.parentGroup = PIXI.lights.diffuseGroup;
    const normalSprite = new PIXI.Sprite(normalTex);
    normalSprite.parentGroup = PIXI.lights.normalGroup;
    container.addChild(diffuseSprite);
    container.addChild(normalSprite);
    return container;
}

PIXI.Assets.loadBundle('textures').then((res) => {

    const bg = createPair(res.bg_diffuse, res.bg_normal);
    const block = createPair(res.block_diffuse, res.block_normal);
    const block1 = createPair(res.block_diffuse, res.block_normal);
    const block2 = createPair(res.block_diffuse, res.block_normal);

    block.position.set(100, 100);
    block1.position.set(500, 100);
    block2.position.set(300, 400);

    light.position.set(525, 160);
    stage.addChild(bg);
    stage.addChild(block);
    stage.addChild(block1);
    stage.addChild(block2);

    stage.addChild(new PIXI.lights.AmbientLight(0x4d4d59, 0.4));
    stage.addChild(new PIXI.lights.DirectionalLight(0x4d4d59, 1, block1));
    stage.addChild(light);

    bg.interactive = true;
    bg.on('pointermove', function (event) {
        light.position.copyFrom(event.data.global);
    });

    bg.on('pointerdown', function (event) {
        const clickLight = new PIXI.lights.PointLight(0xffffff);
        clickLight.position.copyFrom(event.data.global);
        stage.addChild(clickLight);
    });
});