import * as PIXI from 'pixi.js';

/**
 * Please note that this is not the most optimal way of doing pure shader generated rendering and should be used when the
 * scene is wanted as input texture. Check the mesh version of example for more performant version if you need only shader
 * generated content.
 **/
const app = new PIXI.Application({ background: '#1099bb', resizeTo: window });

document.body.appendChild(app.view);

PIXI.Assets.load('https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Normal_map_example_-_Map.png/2048px-Normal_map_example_-_Map.png').then(onAssetsLoaded);

let filter = null;

let totalTime = 0;

// Fragment shader, in real use this would be much cleaner when loaded from a file
// or embedded into the application as data resource.
const fragment = `

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform sampler2D noise;
uniform float time;

vec4 rotateColor( vec4 col, float angle ) {
    const float PI = 3.141592653589793238462643383279502;

    vec3 c = vec3( ( col.x * 2.0 ) - 1.0, ( col.y * 2.0 ) - 1.0, ( col.z * 2.0 ) - 1.0 );
    
    
    float a = atan( c.y / c.x ) + angle + PI + ( ( sign(c.x) - 1.0 ) / 2.0 ) * PI;
    float d = sqrt( pow( c.x, 2.0 ) + pow( c.y, 2.0 ) );
    
    c.x = sin(a) * d;
    c.y = cos(a) * d;
    
    // Return the new color
    return vec4( ( c.x + 1.0 ) / 2.0, ( c.y + 1.0 ) / 2.0, ( c.z + 1.0 ) / 2.0, col.w );
}

void main()
{
  vec4 col = texture2D(noise, vTextureCoord);

    // Output to screen
    gl_FragColor = rotateColor( col, time );
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
