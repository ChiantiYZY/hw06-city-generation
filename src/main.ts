import {vec3, vec2, vec4, mat2, mat4} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Square from './geometry/Square';
import Plane from './geometry/Plane';
import ScreenQuad from './geometry/ScreenQuad';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';
import Lsystem from './Lsystem';
import {readTextFile} from './globals';
import Mesh from './geometry/Mesh';
import Draw from './Draw';
import { format } from 'path';
import Terrain from './Terrain';
import Building from './Building';

// Define an object with application parameters and button callbacks
// This will be referred to by dat.GUI's functions that add GUI elements.
const controls = {
  road: false,
  neighbor: false,
  business: false,
  store: false,
  terrian_map: true,
  density_map: false,

};

const  m = mat2.fromValues( 0.80,  0.60, -0.60,  0.80 );

let square: Square;
let road: Square;
let screenQuad: ScreenQuad;
let plane: Plane;

let branch: Mesh;
let petal:Mesh;
let cube: Mesh;
let neighbor: Array<Mesh>;
let business: Array<Mesh>;
let store: Array<Mesh>;
let overlap: Array<any>;

let build: Building;

let time: number = 0.0;

let map: Terrain;

function lies_on_segment(point : vec3, start : vec3, end : vec3)
{
  var deltax = end[0] - start[0];
  if (deltax == 0)
    var liesInXDir = (point[0] == start[0]);
  else
  {
    var t = (point[0] - start[0]) / deltax
    var liesInXDir = (t >= 0 && t <= 1);
  }
  if (liesInXDir)
  {
    var deltay = end[1] - start[1];
    if (deltay == 0)
      return (point[1] == start[1]);
    else
    {
      var t = (point[1] - start[1]) / deltay
      return (t >= 0 && t <= 1);
    }
  } 
  else
    return false;
}

function lies_on_water(point: vec3)
{
  map = new Terrain();
  return (map.getDensity(point) <= 0.0 );
}

function is_Forbidden(x: number, y: number, draw: Draw) {
  //check in water
  for (var i = -0.1; i < 0.1; i += 0.03) {
    for (var j = -0.1; j < 0.1; j += 0.03) {
      var pos = vec3.fromValues((x + i), (y + j), 0.0);
      if (lies_on_water(pos)) {
        return true;
      }
      //check highway intersection
      for (var k = 0; k < draw.roads.length; k++) {
        var start = draw.roads[k][0];
        var end = draw.roads[k][1];
        if (lies_on_segment(pos, start, end)) {
          //console.log("check intersect");
          return true;
        }
      }

      //check grid interseciton
      for (var k = 0; k < draw.grids.length; k++) {
        var start = draw.grids[k][0];
        var end = draw.grids[k][1];
        if (lies_on_segment(pos, start, end)) {
          //console.log("check grid intersect");
          return true;
        }
      }
    }
  }
  return false;
}

function loadScene() {

  screenQuad = new ScreenQuad();
  screenQuad.create();

  square = new Square();
  square.create();

  road = new Square();
  road.create();

  plane = new Plane(vec3.fromValues(0,0,0), vec2.fromValues(300,300), 20);
  plane.create();


  let obj0: string = readTextFile('./src/cube.obj');
  cube = new Mesh(obj0, vec3.fromValues(0, 0, 0));
  cube.create();

  //draw roads 
  let l = new Lsystem(0);
  l.iteration = 10;
  l.gridIter = 2;
  var draw = new Draw();
  draw = l.drawRoad(square, road);

  //draw building 
  neighbor = [];
  business = [];
  store = [];

  map = new Terrain();

  for(var i = 0; i < 100; i++)
  {

      var a = (Math.random() - 0.5) * 2;
      var b = (Math.random() - 0.5) * 2;
      var x = a * 100;
      var z = b * 100;

      if(!is_Forbidden(a, b, draw))
      {
        
        
        var density = map.getDensity(vec3.fromValues(a, b, 0));
        //console.log(density);

        //density is not correcly calculated 
        if(density < 0.35)
        {
          var tmpBuild = new Building(-13, 8, vec3.fromValues(x, 0, z));
          neighbor = neighbor.concat(tmpBuild.drawCubeBuilding(cube));
        }
        else if( density > 0.38)
        {
          var tmpBuild = new Building(3, 2, vec3.fromValues(x, 0, z));
          business = business.concat(tmpBuild.drawCubeBuilding(cube));
        }
        else
        {
          var tmpBuild = new Building(-5, 5, vec3.fromValues(x, 0, z));
          store = store.concat(tmpBuild.drawStoreBuilding(cube));
        }

        
        

        /*
      //purely random
       var rand = Math.random();

       if(rand < 0.33)
       {
         var tmpBuild = new Building(-13, 8, vec3.fromValues(x, 0, z));
         neighbor = neighbor.concat(tmpBuild.drawCubeBuilding(cube));
       }
       else if( rand > 0.67)
       {
         var tmpBuild = new Building(3, 2, vec3.fromValues(x, 0, z));
         business = business.concat(tmpBuild.drawCubeBuilding(cube));
       }
       else
       {
         var tmpBuild = new Building(-5, 5, vec3.fromValues(x, 0, z));
         store = store.concat(tmpBuild.drawStoreBuilding(cube));
       }

       */

       

    }
  }



}


function main() {
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);
  let flag = false;

  var show = { add:function(){ flag = true }};

  // Add controls to the gui
  const gui = new DAT.GUI();
  gui.add(controls, 'terrian_map').onChange(function(){controls.terrian_map == true});
  gui.add(controls, 'density_map').onChange(function(){controls.density_map == true});
  gui.add(controls, 'road').onChange(function(){controls.road == true});
  gui.add(controls, 'neighbor').onChange(function(){controls.neighbor == true});
  gui.add(controls, 'business').onChange(function(){controls.business == true});
  gui.add(controls, 'store').onChange(function(){controls.store == true});
 



  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene();

  //const camera = new Camera(vec3.fromValues(50, 50, 50), vec3.fromValues(50, 50, 50));
  const camera = new Camera(vec3.fromValues(10, 10, 10), vec3.fromValues(0, 0, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.2, 0.2, 0.2, 1);
  //gl.enable(gl.BLEND);
  //gl.blendFunc(gl.ONE, gl.ONE); // Additive blending
  gl.enable(gl.DEPTH_TEST);

  const instancedShader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/instanced-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/instanced-frag.glsl')),
  ]);

  const flat = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/flat-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/flat-frag.glsl')),
  ]);

  const lambert = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/lambert-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/lambert-frag.glsl')),
  ]);

  //generate L-System
  let l = new Lsystem(0);

  // This function will be called every frame
  function tick() {
    camera.update();
    stats.begin();
    instancedShader.setTime(time);
    flat.setTime(time++);
    lambert.setTime(time++);
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);

    renderer.clear();

    var terrain = 0.0;
    var show = 5.0;
    var showNeighbor = 5.0;
    var showBusiness = 5.0;
    var showStore = 5.0;

    if(controls.terrian_map == true)
    {
      terrain = 1.0;
    }

    var density = 0.0;

    if(controls.density_map == true)
    {
      density = 1.0;
    }

    if(controls.road == true)
    {
      show = 0.0;
    }


    if(controls.neighbor == true)
    {
      showNeighbor = 1.0;
    }


    if(controls.business == true)
    {
      showBusiness = 2.0;
    }


    if(controls.store == true)
    {
      showStore = 3.0;
    }


    flag = false;

    renderer.render(camera, flat, [screenQuad], terrain, density);

    renderer.render(camera, lambert, [plane], terrain, density);
    
    renderer.render1(camera, instancedShader, [
      square, road
    ], show);

    renderer.render1(camera, instancedShader, neighbor, showNeighbor);
    renderer.render1(camera, instancedShader, business, showBusiness);
    renderer.render1(camera, instancedShader, store, showStore);


    //renderer.render(camera, instancedShader, [branch, petal]);
    // renderer.render(camera, instancedShader, [branch, petal, pot]);

    //renderer.render(camera, instancedShader, [petal]);
    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
    flat.setDimensions(window.innerWidth, window.innerHeight);
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();
  flat.setDimensions(window.innerWidth, window.innerHeight);

  // Start the render loop
  tick();
}

main();
