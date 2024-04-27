class Canvas extends PIXI.Application {
  diffuseGroup;
  normalGroup;
  lightGroup;

  constructor(o) {
    super(o);

    this.stage = new PIXI.layers.Stage();
    this.stage.eventMode = 'static';

    this.diffuseGroup = PIXI.lights.diffuseGroup;
    this.normalGroup = PIXI.lights.normalGroup;
    this.lightGroup = PIXI.lights.lightGroup;

    this.stage.addChild(new PIXI.layers.Layer(this.diffuseGroup));
    this.stage.addChild(new PIXI.layers.Layer(this.normalGroup));
    this.stage.addChild(new PIXI.layers.Layer(this.lightGroup));
  }

  addSprite(...sprites) {
    for (let sprite in sprites) {
      sprites[sprite].diffuseMap.parentGroup = this.diffuseGroup;
      sprites[sprite].normalMap.parentGroup = this.normalGroup;

      this.stage.addChild(sprites[sprite]);
    }
  }
}

class Sprite extends PIXI.Container {
  diffuseMap;
  normalMap;

  constructor(diffuse, normal) {
    super();

    this.diffuseMap = new PIXI.Sprite(
      PIXI.Texture.from(diffuse)
    );
    this.normalMap = new PIXI.Sprite(
      PIXI.Texture.from(normal)
    );

    this.addChild(this.diffuseMap);
    this.addChild(this.normalMap);
  }
}

export { Canvas, Sprite };