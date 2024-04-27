import * as PIXI from 'pixi.js';

/**
 * Please note that this is not the most optimal way of doing pure shader generated rendering and should be used when the
 * scene is wanted as input texture. Check the mesh version of example for more performant version if you need only shader
 * generated content.
 **/
const app = new PIXI.Application({ background: '#1099bb', resizeTo: window });

document.body.appendChild(app.view);

PIXI.Assets.load('https://pixijs.com/assets/eggHead.png').then(onAssetsLoaded);

let filter = null;

let totalTime = 0;

// Fragment shader, in real use this would be much cleaner when loaded from a file
// or embedded into the application as data resource.
const fragment = `

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform sampler2D noise;
uniform float time;

void main()
{
  float a = texture2D(noise, vTextureCoord).w;

    // Output to screen
    gl_FragColor = vec4(0.5, 0.5, 1, a);
}
`;

function onAssetsLoaded(perlin)
{
    // Add perlin noise for filter, make sure it's wrapping and does not have mipmap.
    perlin.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
    perlin.baseTexture.mipmap = false;

    // Build the filter
    filter = new PIXI.Filter(null, fragment, {
        time: 0.0,
        noise: perlin,
    });
    app.stage.filterArea = app.renderer.screen;
    app.stage.filters = [filter];

    // Listen for animate update.
    app.ticker.add((delta) =>
    {
        filter.uniforms.time = totalTime;
        totalTime += delta / 60;
    });
}
