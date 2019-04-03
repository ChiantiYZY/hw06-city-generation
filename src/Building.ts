import { vec2, vec3, mat4, mat3 } from 'gl-matrix';
import Turtle from './Turtle';
import Expansion from './Expansion';
import Draw from './Draw';
import { readTextFile } from './globals';
import Mesh from './geometry/Mesh';





export default class Building {

    cubeCount: number;
    cubeHeight: number;
    translateArray:Array<any> = [];
    meshArray: Array<Mesh> = [];
    heightArray: Array<any> = [];
    radiusArray: Array<any> = [];
    cubeSize: number;
    position: vec3;

    constructor(t: number, s: number, position: vec3) {
       // this.cubeCount = 0;
        this.cubeHeight = t;
        this.cubeSize = s;
        this.position = position;
    }

    drawCube(cube: Mesh, trans: vec3, ColorsArray: vec3, r: number, height: number) {
        //let ColorsArray: number[] = [0.2196, 0.1333, 0.0235, 1.0]; // brown

        //let rotate = vec3.fromValues(0, r, 0);
        let rotation = mat4.create();
        mat4.fromRotation(rotation, r, vec3.fromValues(0, 1, 0));

        let tran = vec3.fromValues(trans[0], this.cubeHeight, trans[2]);
        let translate = mat4.create();

        let scalar = vec3.fromValues(this.cubeSize, height, this.cubeSize);
        let scalation = mat4.create();

        mat4.fromTranslation(translate, tran);
        mat4.fromScaling(scalation, scalar);

        let transform = mat4.create();


       // mat4.multiply(transform, position, transform);
       
        mat4.multiply(transform, scalation, transform);
        //mat4.multiply(transform, movePivot, transform);
        mat4.multiply(transform, translate, transform);
        mat4.multiply(transform, rotation, transform);
        

        


        cube.colorsArray.push(ColorsArray[0]);
        cube.colorsArray.push(ColorsArray[1]);
        cube.colorsArray.push(ColorsArray[2]);
        cube.colorsArray.push(1);


        cube.transArray1.push(transform[0]);
        cube.transArray1.push(transform[1]);
        cube.transArray1.push(transform[2]);
        cube.transArray1.push(transform[3]);

        cube.transArray2.push(transform[4]);
        cube.transArray2.push(transform[5]);
        cube.transArray2.push(transform[6]);
        cube.transArray2.push(transform[7]);

        cube.transArray3.push(transform[8]);
        cube.transArray3.push(transform[9]);
        cube.transArray3.push(transform[10]);
        cube.transArray3.push(transform[11]);

        cube.transArray4.push(transform[12]);
        cube.transArray4.push(transform[13]);
        cube.transArray4.push(transform[14]);
        cube.transArray4.push(transform[15]);

        cube.numbs++;
    }

    drawCubeBuilding(cube: Mesh) {
         //this.translateArray.push(0.0);
        // this.meshArray.push(cube);


        var trans = 0;

        var i = 0; 
        // while(i < 4)
        // {
        while(this.cubeHeight > -18.0)
        {
            i++;
            var randObj = Math.random() ;
            let obj0: string;
            if(randObj <= 0.33)
            {
                obj0 = readTextFile('./src/prism.obj');
            }
            else if(randObj <= 0.67)
                obj0 = readTextFile('./src/cube.obj');
            else
                obj0 = readTextFile('./src/pentagon.obj');

            let newMesh = new Mesh(obj0, vec3.fromValues(0, 0, 0));
            newMesh.create();
            this.meshArray.push(newMesh);

            var radius = (Math.random() - 0.5) * 3.14 * 2;
            this.radiusArray.push(radius);


            var y = Math.random() * 5.0;
            if(this.cubeHeight - y < -18.0)
            {
                y = this.cubeHeight + 18.0;
            }
            this.cubeHeight -= y;
            var x = Math.random() * this.cubeSize;
            trans += x;
            var tran = vec3.fromValues(trans, y, 0);

        
            vec3.add(tran, tran, this.position);
            this.translateArray.push(tran);

            for(var j = 0; j < i; j++)
            {
                var r = Math.random();
                var g = Math.random();
                var b = Math.random();
                let ColorsArray = vec3.fromValues(r, g, b); // brown
                this.drawCube(this.meshArray[j], this.translateArray[j], ColorsArray, this.radiusArray[j], y);
            }

        }


       // console.log(this.meshArray);


        
        for(var i = 0; i < this.meshArray.length; i++)
        {
            let col1: Float32Array = new Float32Array(this.meshArray[i].transArray1);
            let col2: Float32Array = new Float32Array(this.meshArray[i].transArray2);
            let col3: Float32Array = new Float32Array(this.meshArray[i].transArray3);
            let col4: Float32Array = new Float32Array(this.meshArray[i].transArray4);
            let colors: Float32Array = new Float32Array(this.meshArray[i].colorsArray);
            this.meshArray[i].setInstanceVBOs(col1, col2, col3, col4, colors);
            this.meshArray[i].setNumInstances(this.meshArray[i].numbs);
        }


        return this.meshArray;

    }

};