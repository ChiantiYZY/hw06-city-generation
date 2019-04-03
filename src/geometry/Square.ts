import { vec3, vec4, vec2 } from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import { gl } from '../globals';

class Square extends Drawable {
  indices: Uint32Array;
  positions: Float32Array;
  colors: Float32Array;
  offsets: Float32Array; // Data for bufTranslate


  array1: Float32Array;
  array2: Float32Array;
  array3: Float32Array;
  array4: Float32Array;



  transArray1: Array<any> = [];
  transArray2: Array<any> = [];
  transArray3: Array<any> = [];
  transArray4: Array<any> = [];


  constructor() {
    super(); // Call the constructor of the super class. This is required.
  }

  create() {

    this.indices = new Uint32Array([0, 1, 2,
      0, 2, 3]);
    this.positions = new Float32Array([-0.5, -0.5, 0, 1,
      0.5, -0.5, 0, 1,
      0.5, 0.5, 0, 1,
    -0.5, 0.5, 0, 1]);

    this.generateIdx();
    this.generatePos();
    this.generateCol();
    this.generateTranslate();
    this.generateTransform1();
    this.generateTransform2();
    this.generateTransform3();
    this.generateTransform4();

    this.count = this.indices.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);

    console.log(`Created square`);
  }


  create1(start: vec2, end: vec2) {
    this.indices = new Uint32Array([0, 1, 2,
      0, 2, 3]);
    this.positions = new Float32Array([-0.01 + start[0], start[1], 0, 1,
    0.01 + start[0], start[1], 0, 1,
    0.01 + end[0], end[1], 0, 1,
    -0.01 + end[0], end[1], 0, 1]);

    this.generateIdx();
    this.generatePos();
    this.generateCol();
    this.generateTranslate();
    this.generateTransform1();
    this.generateTransform2();
    this.generateTransform3();
    this.generateTransform4();

    this.count = this.indices.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);

    console.log(`Created square`);
  }

  setInstanceVBOs(offsets: Float32Array, colors: Float32Array) {
    this.colors = colors;
    this.offsets = offsets;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufCol);
    gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTranslate);
    gl.bufferData(gl.ARRAY_BUFFER, this.offsets, gl.STATIC_DRAW);
  }



  setInstanceVBOs1(array1: Float32Array, array2: Float32Array,
    array3: Float32Array, array4: Float32Array) {
    this.array1 = array1;
    this.array2 = array2;
    this.array3 = array3;
    this.array4 = array4;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransform1);
    gl.bufferData(gl.ARRAY_BUFFER, this.array1, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransform2);
    gl.bufferData(gl.ARRAY_BUFFER, this.array2, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransform3);
    gl.bufferData(gl.ARRAY_BUFFER, this.array3, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransform4);
    gl.bufferData(gl.ARRAY_BUFFER, this.array4, gl.STATIC_DRAW);

  }

  setInstanceVBOs2(array1: Float32Array, array2: Float32Array,
    array3: Float32Array, array4: Float32Array, colors: Float32Array) {
    this.colors = colors;
    this.array1 = array1;
    this.array2 = array2;
    this.array3 = array3;
    this.array4 = array4;


    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufCol);
    gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransform1);
    gl.bufferData(gl.ARRAY_BUFFER, this.array1, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransform2);
    gl.bufferData(gl.ARRAY_BUFFER, this.array2, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransform3);
    gl.bufferData(gl.ARRAY_BUFFER, this.array3, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTransform4);
    gl.bufferData(gl.ARRAY_BUFFER, this.array4, gl.STATIC_DRAW);

  }
};

export default Square;
