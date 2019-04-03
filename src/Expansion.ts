import {vec3} from 'gl-matrix';

export default class Expansion {
    rules : Map<string, string> = new Map();

    //flower grammar is commented out
    setRules() {
        //this.rules.set('X', 'FFF[-FX][+FX][++FX][--FX]*');
        //this.rules.set('*', 'F*');
        this.rules.set('A', 'BA');
        this.rules.set('B', 'A');

        this.rules.set('X', '[-G]XG[+G]');
        //this.rules.set('G', 'GG');
    }


    expanse(grammar: string) {
        let newGrammar: string;
    
        if(this.rules.get(grammar) != undefined)
        {                
            return this.rules.get(grammar);
        }
        else
        {
            return grammar;
        }
    }
    
};