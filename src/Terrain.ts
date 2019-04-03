import { vec3, vec2, vec4, mat2, mat4 } from 'gl-matrix';







export default class Terrain {

    m = mat2.fromValues(0.80, 0.60, -0.60, 0.80);

    noise(x: vec2) {
        return Math.sin(1.5 * x[0]) * Math.sin(1.5 * x[1]);
    }

    multi(mat: mat2, vec: vec2, t: number) {
        return vec2.fromValues((mat[0] * vec[0] + mat[1] * vec[1]) * t, (mat[2] * vec[0] + mat[3] * vec[1]) * t);
    }

    fbm4(p: vec2) {
        var f = 0.0;
        f += 0.5000 * this.noise(p);
        p = this.multi(this.m, p, 2.02);
        f += 0.2500 * this.noise(p);
        p = this.multi(this.m, p, 2.03);
        f += 0.1250 * this.noise(p);
        p = this.multi(this.m, p, 2.01);
        f += 0.0625 * this.noise(p);
        return f / 0.9375;
    }

    fbm6(p: vec2) {
        var f = 0.0;
        f += 0.500000 * (0.5 + 0.5 * this.noise(p));
        p = this.multi(this.m, p, 2.02);
        f += 0.250000 * (0.5 + 0.5 * this.noise(p));
        p = this.multi(this.m, p, 2.03);
        f += 0.125000 * (0.5 + 0.5 * this.noise(p));
        p = this.multi(this.m, p, 2.01);
        f += 0.062500 * (0.5 + 0.5 * this.noise(p));
        p = this.multi(this.m, p, 2.04);
        f += 0.031250 * (0.5 + 0.5 * this.noise(p));
        p = this.multi(this.m, p, 2.01);
        f += 0.015625 * (0.5 + 0.5 * this.noise(p));
        return f / 0.96875;
    }

    func(q: vec2) {
        var ql = q.length;
        q[0] += 0.05 * Math.sin(0.01 + ql * 4.1);
        q[1] += 0.05 * Math.sin(0.01 + ql * 4.3);
        q = vec2.fromValues(0.5 * q[0], 0.5 * q[1]);

        var o = vec2.fromValues(0, 0);
        o[0] = 0.5 + 0.5 * this.fbm4(vec2.fromValues(2 * q[0], 2 * q[1]));
        o[1] = 0.5 + 0.5 * this.fbm4(vec2.fromValues(2 * q[0] + 5.2, 2 * q[1] + 5.2));

        var ol = o.length;
        o[0] += 0.02 * Math.sin(0.01 + ol) / ol;
        o[1] += 0.02 * Math.sin(0.01 + ol) / ol;

        var n = vec2.fromValues(0, 0);
        n[0] = this.fbm6(vec2.fromValues(4 * o[0] + 9.2, 4 * o[1] + 9.2));
        n[1] = this.fbm6(vec2.fromValues(4 * o[0] + 5.7, 4 * o[1] + 5.7));

        var p = vec2.fromValues(0, 0);

        vec2.add(p, n, o);

        var f = this.fbm4(p);

        return f;
    }

    constructor() {
        
    }

    getDensity(position: vec3) {

        

        var pos = vec2.fromValues(2 * position[0] / window.innerWidth - 1.0, 2 * position[1] / window.innerHeight - 1.0);

        pos = vec2.fromValues(position[0], position[1]);
        // console.log(pos);
        // console.log(window.innerWidth);
        var length = Math.sqrt(position[0] * position[0] + position[1] * position[1]);

        var den_height = this.func(pos);
        var terr_height = this.fbm6(vec2.fromValues(pos[0] * Math.sin(length), pos[1] * Math.sin(length)))
            + this.fbm4(vec2.fromValues(pos[0] * Math.cos(length), pos[1] * Math.cos(length)));

        if (terr_height < 0.2) {
            den_height = 0.0;
        }


        return den_height;
    }
};