#version 300 es
precision highp float;

uniform vec3 u_Eye, u_Ref, u_Up;
uniform vec2 u_Dimensions;
uniform float u_Time;
uniform float u_Terrian;
uniform float u_Density;

in vec4 fs_Pos;
in float fs_density;
in float fs_height;
out vec4 out_Col;



void main() {

float density = fs_density;
float height = fs_height;

    vec4 terrian_Col;
    vec4 density_Col; 


    if(height < 0.2)
    {
        vec4 col1 = vec4(0.102, 0.6275, 0.8314, 1.0);
        vec4 col2 = vec4(0.6588, 0.9373, 0.9451, 1.0);
        terrian_Col = mix(col1, col2, height);
        density_Col = vec4(1, 0, 0, 1);
    }

    else
    {
        vec4 col1 = vec4(0.0392, 0.3412, 0.0549, 1.0);
        vec4 col2 = vec4(0.6706, 0.9412, 0.4549, 1.0);
        terrian_Col = mix(col1, col2, height * height);
        density_Col = mix(vec4(1, 0 , 0, 1), vec4(1.0, 1.0, 1.0, 1.0), density);
    }

    if(u_Density == 0.0) 
    {
        density_Col = vec4(1);
    }
    if(u_Terrian == 0.0)
    {
        terrian_Col = vec4(1);
    }


    out_Col = density_Col * terrian_Col;

		return;
}