#version 300 es
precision highp float;

// The vertex shader used to render the background of the scene

uniform mat4 u_ViewProj;
uniform mat4 u_Model;
uniform float u_Time;
in vec4 vs_Pos;
out vec4 fs_Pos;
out float fs_density;
out float fs_height;


/**
 * Noise functions
 */


const mat2 m = mat2( 0.80,  0.60, -0.60,  0.80 );

float noise( in vec2 x )
{
	return sin(1.5*x.x)*sin(1.5*x.y);
}

float fbm4( vec2 p )
{
    float f = 0.0;
    f += 0.5000*noise( p ); p = m*p*2.02;
    f += 0.2500*noise( p ); p = m*p*2.03;
    f += 0.1250*noise( p ); p = m*p*2.01;
    f += 0.0625*noise( p );
    return f/0.9375;
}

float fbm6( vec2 p )
{
    float f = 0.0;
    f += 0.500000*(0.5+0.5*noise( p )); p = m*p*2.02;
    f += 0.250000*(0.5+0.5*noise( p )); p = m*p*2.03;
    f += 0.125000*(0.5+0.5*noise( p )); p = m*p*2.01;
    f += 0.062500*(0.5+0.5*noise( p )); p = m*p*2.04;
    f += 0.031250*(0.5+0.5*noise( p )); p = m*p*2.01;
    f += 0.015625*(0.5+0.5*noise( p ));
    return f/0.96875;
}

float func( vec2 q)
{
    float ql = length( q );
    q.x += 0.05*sin(0.01+ql*4.1);
    q.y += 0.05*sin(0.01+ql*4.3);
    q *= 0.5;

	vec2 o = vec2(0.0);
    o.x = 0.5 + 0.5*fbm4( vec2(2.0*q          )  );
    o.y = 0.5 + 0.5*fbm4( vec2(2.0*q+vec2(5.2))  );

	float ol = length( o );
    o.x += 0.02*sin(0.01+ol)/ol;
    o.y += 0.02*sin(0.01+ol)/ol;

    vec2 n;
    n.x = fbm6( vec2(4.0*o+vec2(9.2))  );
    n.y = fbm6( vec2(4.0*o+vec2(5.7))  );

    vec2 p = n + o;

    float f = fbm4( p );
	
    return f;
}

float rand(vec2 uv) {
    const highp float a = 12.9898;
    const highp float b = 78.233;
    const highp float c = 43758.5453;
    highp float dt = dot(uv, vec2(a, b));
    highp float sn = mod(dt, 3.1415);
    return fract(sin(sn) * c);
}

void draw_stars(inout vec4 color, vec2 uv) {
    float t = sin(u_Time * 0.1 * rand(-uv)) * 0.5 + 0.5;
    //color += step(0.99, stars) * t;
    color += smoothstep(0.99, 1.0, rand(uv)) * t;
}

vec3 random3( vec3 p ) {
    return fract(sin(vec3(dot(p,vec3(127.1, 311.7, 191.999)),
                          dot(p,vec3(269.5, 183.3, 765.54)),
                          dot(p, vec3(420.69, 631.2,109.21))))
                 *43758.5453);
}

float WorleyNoise3D(vec3 p)
{
    // Tile the space
    vec3 pointInt = floor(p);
    vec3 pointFract = fract(p);

    float minDist = 1.0; // Minimum distance initialized to max.

    // Search all neighboring cells and this cell for their point
    for(int z = -1; z <= 1; z++)
    {
        for(int y = -1; y <= 1; y++)
        {
            for(int x = -1; x <= 1; x++)
            {
                vec3 neighbor = vec3(float(x), float(y), float(z));

                // Random point inside current neighboring cell
                vec3 point = random3(pointInt + neighbor);

                // Animate the point
                //point = 0.5 + 0.5 * sin(u_Time * 0.01 + 6.2831 * point); // 0 to 1 range

                // Compute the distance b/t the point and the fragment
                // Store the min dist thus far
                vec3 diff = neighbor + point - pointFract;
                float dist = length(diff);
                minDist = min(minDist, dist);
            }
        }
    }
    return minDist;
}

float worleyFBM(vec3 uv) {
    float sum = 0.f;
    float freq = 4.f;
    float amp = 0.5;
    for(int i = 0; i < 8; i++) {
        sum += WorleyNoise3D(uv * freq) * amp;
        freq *= 2.f;
        amp *= 0.5;
    }
    return sum;
}

float random1( vec3 p , vec3 seed) {
  return fract(sin(dot(p + seed, vec3(987.654, 123.456, 531.975))) * 85734.3545);
}

float interpNoise3D(float x, float y, float z) {
    float intX = floor(x);
    float intY = floor(y);
    float intZ = floor(z);
    float fractX = fract(x);
    float fractY = fract(y);
    float fractZ = fract(z);

    float v1 = random1(vec3(intX, intY, intZ), vec3(1.0, 1.0, 1.0));
    float v2 = random1(vec3(intX, intY, intZ + 1.0), vec3(1.0, 1.0, 1.0));
    float v3 = random1(vec3(intX + 1.0, intY, intZ + 1.0), vec3(1.0, 1.0, 1.0));
    float v4 = random1(vec3(intX + 1.0, intY, intZ), vec3(1.0, 1.0, 1.0));
    float v5 = random1(vec3(intX, intY + 1.0, intZ), vec3(1.0, 1.0, 1.0));
    float v6 = random1(vec3(intX, intY + 1.0, intZ + 1.0), vec3(1.0, 1.0, 1.0));
    float v7 = random1(vec3(intX + 1.0, intY + 1.0, intZ), vec3(1.0, 1.0, 1.0));
    float v8 = random1(vec3(intX + 1.0, intY + 1.0, intZ + 1.0), vec3(1.0, 1.0, 1.0));


    float i1 = mix(v1, v2, fractX);
    float i2 = mix(v3, v4, fractX);
    float i3 = mix(v5, v6, fractX);
    float i4 = mix(v7, v8, fractX);

    float i5 = mix(i1, i2, fractY);
    float i6 = mix(i3, i4, fractY);

    return mix(i5, i6, fractZ);
}


void main() {


    vec4 pos = vs_Pos;

    vec2 noise = (vs_Pos.xy + vs_Pos.yz + vs_Pos.xz) * 0.01;

    float density = func(noise);
    float height = fbm6(vec2(noise * sin(length(noise)))) + fbm4(vec2(noise* cos(length(noise))));

    if(height < 0.2)
    {
        pos.y = mix(-20.0, -18.0, height * 5.0);
    }
    else
    {
        pos.y = -18.0;
    }
    
    fs_density = density;
    fs_height = height;

    fs_Pos = pos;

    gl_Position = u_ViewProj * u_Model * pos;

}
