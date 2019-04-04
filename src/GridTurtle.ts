import {vec2, vec3, quat, mat3, mat4} from 'gl-matrix';
import Terrain from './Terrain';
import Draw from './Draw';
import Turtle from './Turtle';

export default class GridTurtle {

    position: vec3 = vec3.create();
    prevPos: vec3 = vec3.create();
    forward: vec3 = vec3.create();
    up: vec3 = vec3.create();
    right: vec3 = vec3.create();
    orientation: quat = quat.create();
    scale: number;
    map: Terrain;
    turtles: Array<GridTurtle>;
    


  constructor() {

    this.position = vec3.fromValues(0, 0, 0);
    this.prevPos = vec3.fromValues(0,0,0);
    this.up = vec3.fromValues(0, 1, 0);
    this.forward = vec3.fromValues(0, 0, 1);
    this.right = vec3.fromValues(1, 0, 0);
    this.orientation = quat.fromEuler(this.orientation, 0, 0, 0);
    // this.scale = vec3.fromValues(1, 1, 1);
  }

  growUp(distance: number) {
    this.prevPos = this.position;

    this.position = vec3.fromValues(this.prevPos[0] + distance * this.up[0], 
                                    this.prevPos[1] + distance * this.up[1], 
                                    this.prevPos[2] + distance * this.up[2]);


  }

  rotateOnZ(angle: number) {
        let rot: quat = quat.create();

        //generate the quat along the world z axis
        quat.setAxisAngle(rot, this.forward, angle);         //angle is radius
        
        //updating UFR// 
        vec3.transformQuat(this.forward, this.forward, rot);
        vec3.transformQuat(this.up, this.up, rot);
        vec3.transformQuat(this.right, this.right, rot);
        quat.multiply(this.orientation, rot, this.orientation);

        ///console.log('orientation: ' + this.orientation);

 
  }

  rotateOnY(angle: number) {
    let rot: quat = quat.create();

    //generate the quat along the world z axis
    quat.setAxisAngle(rot, this.up, angle);         //angle is radius
    
    //updating UFR// 
    vec3.transformQuat(this.forward, this.forward, rot);
    vec3.transformQuat(this.up, this.up, rot);
    vec3.transformQuat(this.right, this.right, rot);
    quat.multiply(this.orientation, rot, this.orientation);

  }

  rotateOnX(angle: number) {
    let rot: quat = quat.create();

    //generate the quat along the world z axis
    quat.setAxisAngle(rot, this.right, angle);         //angle is radius
    
    //updating UFR// 
    vec3.transformQuat(this.forward, this.forward, rot);
    vec3.transformQuat(this.up, this.up, rot);
    vec3.transformQuat(this.right, this.right, rot);
    quat.multiply(this.orientation, rot ,this.orientation);

  }  

  copy(turtle: Turtle) {
    //vec3.copy(this.position, turtle.prevPos);
    // vec3.copy(this.position, turtle.position);
    // vec3.copy(this.prevPos, turtle.prevPos);
   // quat.copy(this.orientation, turtle.orientation);
    vec3.copy(this.up, turtle.up);
    vec3.copy(this.right, turtle.right);
    vec3.copy(this.forward, turtle.forward);
    //vec3.copy(this.scale, turtle.scale);


    this.position = vec3.fromValues(turtle.position[0], turtle.position[1], turtle.position[2]);
    this.prevPos = vec3.fromValues(turtle.prevPos[0], turtle.prevPos[1], turtle.prevPos[2]);
    this.orientation = turtle.orientation;
  }



};

