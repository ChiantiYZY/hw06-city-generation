#version 300 es

uniform mat4 u_ViewProj;
uniform float u_Time;

uniform float u_isRoad;

uniform mat3 u_CameraAxes;// Used for rendering particles as billboards (quads that are always looking at the camera)
// gl_Position = center + vs_Pos.x * camRight + vs_Pos.y * camUp;

in vec4 vs_Pos;// Non-instanced; each particle is the same quad drawn in a different place
in vec4 vs_Nor;// Non-instanced, and presently unused
in vec4 vs_Col;
// An instanced rendering attribute; each particle instance has a different color
in vec3 vs_Translate;// Another instance rendering attribute used to position each quad instance in the scene
in vec2 vs_UV;// Non-instanced, and presently unused in main(). Feel free to use it for your meshes.

in vec4 vs_Transform1;
in vec4 vs_Transform2;
in vec4 vs_Transform3;
in vec4 vs_Transform4;

out vec4 fs_Col;
out vec4 fs_Pos;


vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v)
  { 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
  i = mod289(i); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
  }


void main()
{
    
    fs_Pos=vs_Pos;
    vec4 tmp=vec4(vs_Pos.xyz,1);  
    mat4 trans=mat4(vs_Transform1,vs_Transform2,vs_Transform3,vs_Transform4);
    vec4 pos = trans*tmp;
    
    if(u_isRoad== 0.0)
    {
        float y=pos.y;
        pos.y=pos.z;
        pos.z=y;
        
        pos.y=-17.9;


        vec3 col1 = vec3(0.5333, 0.4549, 0.0235);
        vec3 col2 = vec3(0.0275, 0.5137, 0.0667);

        fs_Col=vec4(mix(col1, col2, (vs_Pos.x) * 0.5 ), 1.0);
        gl_Position=u_ViewProj*pos;
    }
    //business
    else if(u_isRoad == 2.0)
    {
        vec4 col1 = vec4(0.4784, 0.4549, 0.4549, 1.0);

        float gap = 0.01;
        
        float step = (sin(u_Time * gap) + 1.0) * 2.5;

        if(abs(pos.y - step) < 6.0)
        {
            fs_Col = vec4(0.7804, 0.7686, 0.7686, 1.0);
        }
        else if(abs(pos.y - step) < 12.0)
        {
            fs_Col = vec4(0.2824, 0.2863, 0.2863, 1.0);
        }
        else if(abs(pos.y - step) < 18.0)
        {
            fs_Col = vec4(0.0118, 0.0118, 0.0118, 1.0);
        }
        else
        {
            vec4 col3 = vec4(0, 0, 0, 1);
            fs_Col = col3;
        }
        gl_Position=u_ViewProj*pos;
    }
    //store
    else if(u_isRoad == 3.0)
    {

        vec4 left = vec4(0.9725, 0.6235, 0.3412, 1.0);
        vec4 right = vec4(0.9216, 0.3333, 0.0588, 1.0); 
        vec4 col1 = vec4(0.3059, 0.1608, 0.5725, 1.0);
        vec4 col2 = vec4(0.6588, 0.502, 0.8667, 1.0);

        float y = -(pos.y + 18.0) / 13.0 + 1.0;

        float stripes = mod(floor(vs_Pos.y), 2.0);

        if(stripes == 0.0)
            fs_Col = mix(left, col2, pos.x * 0.02);
        else if(stripes == 1.0)
            fs_Col = mix(right, col1, pos.x * 0.02);
        
        gl_Position=u_ViewProj*pos;
        
    }
    //house
    else if(u_isRoad == 1.0)
    {
        float noise = snoise(pos.xyz * 10.0);
        fs_Col = mix(vec4(0.3608, 0.2078, 0.0353, 1.0), vec4(0.9412, 0.7765, 0.3294, 1.0), noise);
        gl_Position=u_ViewProj*pos;
    }
    else
    {
        gl_Position = vec4(0.0);
    }
    
    
   }