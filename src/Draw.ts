import {vec3} from 'gl-matrix';
import Turtle from './Turtle';
import gridTurtles from './GridTurtle';
import Terrain from './Terrain';
import {readTextFile} from './globals';
import Mesh from './geometry/Mesh';
import { totalmem } from 'os';
import GridTurtle from './GridTurtle';
//import { scale } from 'gl-matrix/src/gl-matrix/vec2';

export default class Draw {

    turtles: Array<Turtle> = [new Turtle()];
    cur = this.turtles[0];

    rules : Map<string, any> = new Map();
    sca : number;
    ang : number;
    map = new Terrain();

    roads = new Array();
    grids = new Array();

    gridTurtles : Array<GridTurtle> = [new GridTurtle()];
    curGrid = this.gridTurtles[0];

    //scale = Math.random();

    constructor()
    {
        // let obj0: string = readTextFile('../branch.obj');
        // let m = new Mesh(obj0, vec3.fromValues(0, 0, 0));
        // m.create();
        this.sca = 1.0;
        this.ang = 1.0;

    }

    getRandomInt(max : number) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    intersectionTest(e0: vec3, e1: vec3, o0: vec3, o1: vec3) {
		// convert to Ax + By = C form
		var A1 = e1[1] - e0[1];
		var B1 = e0[0] - e1[0];
		var C1 = A1 * e0[0] + B1 * e0[1];
		
		var A2 = o1[1] - o0[1];
		var B2 = o0[0] - o1[0];
		var C2 = A2 * o0[0] + B2 * o0[1];

		var det = A1 * B2 - A2 * B1;

		// parallel lines
		if (Math.abs(det) < 0.001) {
			return false;
		} else { 
			var x = (B2 * C1 - B1 * C2) / det;
            var y = (A1 * C2 - A2 * C1) / det;
            
            var intersection = vec3.fromValues(x, y, 0);
            
            var e_left = Math.min(e0[0], e1[0]);
            var e_right = Math.max(e0[0], e1[0]);
            var o_left = Math.min(o0[0], o1[0]);
            var o_right = Math.max(o0[0], o1[0]);

            if(x > e_left && x < e_right && x > o_left && x < o_right)
            {
                var e_down = Math.min(e0[1], e1[1]);
                var e_up = Math.max(e0[1], e1[1]);
                var o_down = Math.min(o0[1], o1[1]);
                var o_up = Math.max(o0[1], o1[1]);

                if(y > e_down && y < e_up && y > o_down && y < o_up)
                {
                    return true;
                }

            }
			return false;
		}
    }
    

    getIntersection(e0: vec3, e1: vec3, o0: vec3, o1: vec3) {
		var A1 = e1[1] - e0[1];
		var B1 = e0[0] - e1[0];
		var C1 = A1 * e0[0] + B1 * e0[1];
		
		var A2 = o1[1] - o0[1];
		var B2 = o0[0] - o1[0];
		var C2 = A2 * o0[0] + B2 * o0[1];

        var det = A1 * B2 - A2 * B1;
        
        var x = (B2 * C1 - B1 * C2) / det;
        var y = (A1 * C2 - A2 * C1) / det;
        var intersection = vec3.fromValues(x, y, 0);

        return intersection;
	}

    pushTurtle()
    {
        let tmp = new Turtle();
        tmp.copy(this.cur);
       // vec3.copy(tmp.prevPos, this.cur.position);
        this.turtles.push(tmp);

    }

    popTurtle()
    {
        let tmp = this.turtles.pop();
        this.cur.copy(tmp);
        
    }

    growUp()
    {
        this.cur.growUp(this.sca);
    }

    rotateRight()
    {

        this.curGrid.rotateOnZ(3.14 / 2.0);
    }

    rotateLeft()
    {

        this.curGrid.rotateOnZ(-3.14 / 2.0);
    }

    rotateForward()
    {
        let flag = Math.random();
        this.cur.rotateOnY(1.57 * flag);
        //console.log('check rotate: ');
       // console.log(this.cur);
    }

    rotateBack()
    {
        let flag = Math.random();
        this.cur.rotateOnY(-1.57 * flag);
    }

    seek()
    {

        // console.log('check seek');
        var cur_map = this.turtles.map;
        var step = 1.0;
        var angle = 3.14 / 8.0;

        var highDense = 0;

        var flag = false; 

        let new_turtle = new Turtle();

            var dis = vec3.fromValues(0, 0, 0);
            var length = 100;


            for(var i = 0; i < 4; i++)
            {
                let tmp = new Turtle();
                tmp.copy(this.cur);
                tmp.rotateOnZ(angle * i + Math.random());
                tmp.growUp(0.5);
                var position = tmp.position;
                var density = this.map.getDensity(position);
                if(density > highDense)
                {
                    flag = true;
                    highDense = density;
                    new_turtle.copy(tmp);
                }

            }

            if(highDense < 0)
            {
                this.popTurtle();
                return;
            }


        for(var i = 0; i < this.roads.length; i++)
        {
            var e0 = this.roads[i][0];
            var e1 = this.roads[i][1];
            if(this.intersectionTest(e0, e1, new_turtle.prevPos, new_turtle.position))
            {
                var isect = this.getIntersection(e0, e1, new_turtle.prevPos, new_turtle.position);
                new_turtle.position = isect;
            }
        }
            
            
            if(flag)
            {
                this.cur.copy(new_turtle);
                this.pushTurtle();
                this.roads.push([this.cur.prevPos, this.cur.position]);
            }
            else
            {
                if(this.turtles.length > 0)
                    this.popTurtle();
            }

            //this.curGrid.copy(this.cur);
            
            this.curGrid.position = this.cur.position;

    }

    gridForward()
    {
        var dir = Math.random();

        var tmp = this.curGrid;
        if(dir < 0.5)
        {
            tmp.growUp(0.1);
            if(this.map.getDensity(tmp.position) < 0)
            {
                tmp.growUp(-0.1);
            }
        }
        else
        {
            tmp.growUp(-0.1);
            if(this.map.getDensity(tmp.position) < 0)
            {
                tmp.growUp(0.1);
            }
        }

        for(var i = 0; i < this.grids.length; i++)
        {
            var e0 = this.grids[i][0];
            var e1 = this.grids[i][1];
            if(this.intersectionTest(e0, e1, tmp.prevPos, tmp.position))
            {
                var isect = this.getIntersection(e0, e1, tmp.prevPos, tmp.position);
                tmp.position = isect;
            }
        }
        this.grids.push(tmp.prevPos, tmp.position);

        this.curGrid.copy(tmp);
        this.pushGrid();

    }

    pushGrid()
    {
        let tmp = new Turtle();
        tmp.copy(this.curGrid);
       // vec3.copy(tmp.prevPos, this.cur.position);
        this.gridTurtles.push(tmp);

    }

    popGrid()
    {
        let tmp = this.gridTurtles.pop();
        this.curGrid.copy(tmp);
    }

    setRule()
    {
        this.rules.set('F', this.growUp.bind(this));
        this.rules.set('*', this.growUp.bind(this));
        this.rules.set('+', this.rotateRight.bind(this));
        this.rules.set('-', this.rotateLeft.bind(this));
        this.rules.set('>', this.rotateForward.bind(this));
        this.rules.set('<', this.rotateBack.bind(this));
        //this.rules.set('-', this.cur.rotateOnZ.bind(this.cur));
        
        this.rules.set('[', this.pushTurtle.bind(this));
        this.rules.set(']', this.popTurtle.bind(this));

        //this.rules.set('B', this.seek.bind(this));
        this.rules.set('B', this.seek.bind(this));
        this.rules.set('G', this.gridForward.bind(this));
        this.rules.set('(', this.pushGrid.bind(this));
        this.rules.set(')', this.popGrid.bind(this));
        
    }

    draw(grammar: string)
    {
        let func = this.rules.get(grammar);

        if(func)
        {
            func();
        }
    }

};