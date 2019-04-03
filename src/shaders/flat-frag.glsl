#version 300 es
precision highp float;

uniform vec3 u_Eye, u_Ref, u_Up;
uniform vec2 u_Dimensions;
uniform float u_Time;
uniform float u_Terrian;
uniform float u_Density;

in vec2 fs_Pos;
out vec4 out_Col;



vec3 skyColor(vec3 rd )
{
    vec3 sundir = normalize( vec3(.0, .1, 1.) );
    
    float yd = min(rd.y, 0.);
    rd.y = max(rd.y, 0.);
    
    vec3 col = vec3(0.);
    
    col += vec3(.4, .4 - exp( -rd.y*20. )*.3, .0) * exp(-rd.y*9.); // Red / Green 
    col += vec3(.3, .5, .6) * (1. - exp(-rd.y*8.) ) * exp(-rd.y*.9) ; // Blue
    
    col = mix(col*1.2, vec3(.3),  1.-exp(yd*100.)); // Fog
    
    col += vec3(1.0, .8, .55) * pow( max(dot(rd,sundir),0.), 15. ) * .6; // Sun
    col += pow(max(dot(rd, sundir),0.), 150.0) *.15;
    
    return col;
}


float checker( vec2 p )
{
    p = mod(floor(p),2.0);
    return mod(p.x + p.y, 2.0) < 1.0 ? .25 : 0.1;
}

void main() {


    //screen coords
	//vec2 q = fragCoord.xy/iResolution.xy;

    vec3 light = vec3(-2.0, 0.0, 4.0);


    vec2 q = fs_Pos.xy ;

	vec2 v = -1.0+2.0*q;
	//v.x *= iResolution.x/iResolution.y;
    v.x *= u_Dimensions.x / u_Dimensions.y;


	//camera ray
	vec3 dir = normalize(vec3(fs_Pos, 1.0) + light * 0.3);
	
    //Vignetting
	//dir *= .7 + .3*pow(q.x*q.y*(1.-q.x)*(1.-q.y)*16., .1);
        
	//out_Col = vec4(col, 1.);

    out_Col = vec4(skyColor(dir), 1.0);

  //out_Col = vec4(0.0, 0.0, 0.0, 1.0);
}