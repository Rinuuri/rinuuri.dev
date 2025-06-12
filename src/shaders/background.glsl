uniform vec2 u_resolution;
uniform float aspect;
uniform float u_time;
uniform float u_time_sin;
//uniform vec2 u_mouse;
uniform float u_scale;

// Worley noise implementation, credits to https://github.com/Erkaman

vec4 permute(vec4 x) {
  return mod((34.0 * x + 1.0) * x, 289.0);
}

vec2 dist(vec2 x, vec2 y) {
  return x * x + y * y;
}

vec4 dist(vec4 x, vec4 y, vec4 z) {
  return x * x + y * y + z * z;
}

vec2 worley(vec3 P, float jitter) {
    float K = 0.142857142857;
    float Ko = 0.428571428571;
    float K2 = 0.020408163265306;
    float Kz = 0.166666666667;
    float Kzo = 0.416666666667;

	vec3 Pi = mod(floor(P), 289.0);
 	vec3 Pf = fract(P);
	vec4 Pfx = Pf.x + vec4(0.0, -1.0, 0.0, -1.0);
	vec4 Pfy = Pf.y + vec4(0.0, 0.0, -1.0, -1.0);
	vec4 p = permute(Pi.x + vec4(0.0, 1.0, 0.0, 1.0));
	p = permute(p + Pi.y + vec4(0.0, 0.0, 1.0, 1.0));
	vec4 p1 = permute(p + Pi.z);
	vec4 p2 = permute(p + Pi.z + vec4(1.0));
	vec4 ox1 = fract(p1*K) - Ko;
	vec4 oy1 = mod(floor(p1*K), 7.0)*K - Ko;
	vec4 oz1 = floor(p1*K2)*Kz - Kzo;
	vec4 ox2 = fract(p2*K) - Ko;
	vec4 oy2 = mod(floor(p2*K), 7.0)*K - Ko;
	vec4 oz2 = floor(p2*K2)*Kz - Kzo;
	vec4 dx1 = Pfx + jitter*ox1;
	vec4 dy1 = Pfy + jitter*oy1;
	vec4 dz1 = Pf.z + jitter*oz1;
	vec4 dx2 = Pfx + jitter*ox2;
	vec4 dy2 = Pfy + jitter*oy2;
	vec4 dz2 = Pf.z - 1.0 + jitter*oz2;
	vec4 d1 = dist(dx1, dy1, dz1);
	vec4 d2 = dist(dx2, dy2, dz2);

	vec4 d = min(d1,d2);
	d2 = max(d1,d2);
	d.xy = (d.x < d.y) ? d.xy : d.yx;
	d.xz = (d.x < d.z) ? d.xz : d.zx;
	d.xw = (d.x < d.w) ? d.xw : d.wx;
	d.yzw = min(d.yzw, d2.yzw);
	d.y = min(d.y, d.z);
	d.y = min(d.y, d.w);
	d.y = min(d.y, d2.x);
	return sqrt(d.xy);
}

void main() {
	vec2 pixelPos = gl_FragCoord.xy / u_resolution;
	pixelPos.x *= aspect;
	//float distanceIN = max(0.1-length(pixelPos - vec2((1.0-u_mouse.x)*aspect, 1.0-u_mouse.y)), 0.0);
	pixelPos *= 12.0/u_scale;
    pixelPos += u_time_sin;
    float noise2 = worley(vec3(pixelPos, u_time+1.25), 1.0).x;
    float noise1 = worley(vec3(pixelPos*1.1, u_time), 1.0).x;
    float strengh = step(noise1, 0.07)*0.2+step(noise2, 0.04)*0.6;
	//strengh += distanceIN*(0.9-step(strengh, 0.01))*5.0;
    gl_FragColor = vec4(strengh, strengh-0.25, strengh, 1.0);
}
