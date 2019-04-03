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

void main()
{
    
    fs_Pos=vs_Pos;
    
    // fs_Rot = abs(vs_Rotate);
    
    // vec3 offset = vs_Translate;
    // vec4 rotate = (vs_Rotate);
    // //offset.z = (sin((u_Time + offset.x) * 3.14159 * 0.1) + cos((u_Time + offset.y) * 3.14159 * 0.1)) * 1.5;
    
    vec4 tmp=vec4(vs_Pos.xyz,1);
    //fs_Pos = tmp;
    
    mat4 trans=mat4(vs_Transform1,vs_Transform2,vs_Transform3,vs_Transform4);
    vec4 pos=trans*tmp;
    
    //fs_Col = vs_Col;
    
    if(u_isRoad== 1.0)
    {
        float y=pos.y;
        pos.y=pos.z;
        pos.z=y;
        
        pos.y=-17.9;
        fs_Col=vec4(0,0,0,1);
    }
    else
    {
        //fs_Col= vec4(0.5647, 0.1059, 0.9412, 1.0);
        //fs_Col = vs_Col;
        fs_Col = vs_Pos * vec4(0.9059, 0.0941, 0.0941, 1.0);
    }
    
    gl_Position=u_ViewProj*pos;


   //gl_Position = u_ViewProj * vs_Pos;
   }