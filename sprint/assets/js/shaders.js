const vertexShader = 
    `varying vec2 vUv;
		void main() {
			vUv = vec2( uv.x, 1.0-uv.y );
			gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );
		}`

const fragmentShader = 
    `
	precision highp float;
	uniform sampler2D image;
	varying vec2 vUv;

	void main()	
	{ 
		vec3 texColor = texture2D ( image, vUv ).rgb;
		gl_FragColor = vec4(texColor, 1.0);
	}
	`
const elevationVertexShader = 
	`
	uniform float discret; 
	uniform float scaleElevation; 
	uniform vec2 stepPixel;
	uniform vec3 lightDir;
	uniform float lightIntensity;
	uniform sampler2D tex;
	uniform int colorSpace;
	uniform int colorChannel;
	
	varying vec2 vUv;
	varying float NdotL;

	const float EPSILON = 1e-10;

	// RGB to XYZ
	vec3 rgb2xyz( vec3 c ) {
		vec3 tmp;
		tmp.x = ( c.r > 0.04045 ) ? pow( ( c.r + 0.055 ) / 1.055, 2.4 ) : c.r / 12.92;
		tmp.y = ( c.g > 0.04045 ) ? pow( ( c.g + 0.055 ) / 1.055, 2.4 ) : c.g / 12.92,
		tmp.z = ( c.b > 0.04045 ) ? pow( ( c.b + 0.055 ) / 1.055, 2.4 ) : c.b / 12.92;
		return tmp *
			mat3( 0.4124, 0.3576, 0.1805,
				  0.2126, 0.7152, 0.0722,
				  0.0193, 0.1192, 0.9505 );
	}

	// RGB to Yxy via xyz
	vec3 xyz2yxy(vec3 c){
		float s=c.x+c.y+c.z;
		return vec3(c.y,c.x/s,c.y/s); //Blue's within s.
	}

	vec3 rgb2yxy(vec3 c){return xyz2yxy(rgb2xyz(c));}
	
	// RGB to LAB via xyz
	vec3 xyz2lab( vec3 c ) {
		vec3 n = c / vec3( 95.047, 100, 108.883 );
		vec3 v;
		v.x = ( n.x > 0.008856 ) ? pow( n.x, 1.0 / 3.0 ) : ( 7.787 * n.x ) + ( 16.0 / 116.0 );
		v.y = ( n.y > 0.008856 ) ? pow( n.y, 1.0 / 3.0 ) : ( 7.787 * n.y ) + ( 16.0 / 116.0 );
		v.z = ( n.z > 0.008856 ) ? pow( n.z, 1.0 / 3.0 ) : ( 7.787 * n.z ) + ( 16.0 / 116.0 );
		return vec3(( 116.0 * v.y ) - 16.0, 500.0 * ( v.x - v.y ), 200.0 * ( v.y - v.z ));
	}

	vec3 rgb2lab(vec3 c) {
		vec3 lab = xyz2lab( rgb2xyz( c ) );
		return vec3( lab.x / 100.0, 0.5 + 0.5 * ( lab.y / 127.0 ), 0.5 + 0.5 * ( lab.z / 127.0 ));
	}

	// RGB to HSV via HCV
	vec3 RGBtoHCV(vec3 rgb)
	{
		vec4 p = (rgb.g < rgb.b) ? vec4(rgb.bg, -1., 2. / 3.) : vec4(rgb.gb, 0., -1. / 3.);
		vec4 q = (rgb.r < p.x) ? vec4(p.xyw, rgb.r) : vec4(rgb.r, p.yzx);
		float c = q.x - min(q.w, q.y);
		float h = abs((q.w - q.y) / (6. * c + EPSILON) + q.z);
		return vec3(h, c, q.x);
	}

	vec3 RGBtoHSV(vec3 rgb)
	{
		vec3 hcv = RGBtoHCV(rgb);
		float s = hcv.y / (hcv.z + EPSILON);
		return vec3(hcv.x, s, hcv.z);
	}

	// RGB to HSL via HCV
	vec3 RGBtoHSL(vec3 rgb)
	{
		vec3 hcv = RGBtoHCV(rgb);
		float z = hcv.z - hcv.y * 0.5;
		float s = hcv.y / (1. - abs(z * 2. - 1.) + EPSILON);
		return vec3(hcv.x, s, z);
	}

	float function ( vec4 color )
	{
		vec3 selColSpace;

		if(colorSpace == 0) {
			selColSpace = color.rgb;
		}
		else if(colorSpace == 1) {
			selColSpace = rgb2yxy( color.rgb );
		}
		else if(colorSpace == 2) {
			selColSpace = rgb2lab( color.rgb );
		}
		else if(colorSpace == 3) {
			selColSpace = RGBtoHSV( color.rgb );
		}
		else if(colorSpace == 4) {
			selColSpace = RGBtoHCV( color.rgb );
		}
		else if(colorSpace == 5) {
			selColSpace = RGBtoHSL( color.rgb );
		}
		
		if(colorChannel == 0) {
			return length ( selColSpace.x );
		}
		else if(colorChannel == 1) {
			return length ( selColSpace.y );
		}
		if(colorChannel == 2) {
			return length ( selColSpace.z );
		}
		return length ( selColSpace );
	}

	void main() {
		vUv = uv;
		float l = function ( texture2D ( tex, vUv ) );
		vec3 tmp = position;
		tmp.z = -(tmp.z + l*scaleElevation);

		float diffX = function(texture2D (tex, vUv+vec2 (stepPixel.x*discret,0.0 ) ))-function(texture2D (tex, vUv+vec2 (-stepPixel.x*discret,0.0 ) ));
		float diffY = function(texture2D (tex, vUv+vec2 (0.0,stepPixel.y*discret ) ))-function(texture2D (tex, vUv+vec2 (0.0,-stepPixel.y*discret ) ));
		vec3 normal = normalize(cross ( vec3 ( 1.0, 0.0, 6.0*scaleElevation*diffX ),
										vec3 ( 0.0, 1.0, 6.0*scaleElevation*diffY ) ) );
		NdotL = lightIntensity*(dot(normal, lightDir));

		gl_Position = projectionMatrix * modelViewMatrix * vec4(tmp, 1.0);
	}
	`

const elevationFragmentShader =

	`
	varying vec2 vUv;
	varying float NdotL;

	uniform sampler2D tex;

	void main() {
		vec3 color = texture2D ( tex, vUv ).rgb;
		gl_FragColor.rgb = vec3(NdotL)*color;
		gl_FragColor.a = 1.0;
	}
	`

const colorCloudVertexShader =

	`
	uniform sampler2D tex;
	uniform int colorSpace;
	uniform float shadow;
	uniform float ccLab;
	
	varying vec3 color;

	const float EPSILON = 1e-10;

	// RGB to XYZ
	vec3 rgb2xyz( vec3 c ) {
		vec3 tmp;
		tmp.x = ( c.r > 0.04045 ) ? pow( ( c.r + 0.055 ) / 1.055, 2.4 ) : c.r / 12.92;
		tmp.y = ( c.g > 0.04045 ) ? pow( ( c.g + 0.055 ) / 1.055, 2.4 ) : c.g / 12.92,
		tmp.z = ( c.b > 0.04045 ) ? pow( ( c.b + 0.055 ) / 1.055, 2.4 ) : c.b / 12.92;
		return ccLab * tmp *
			mat3( 0.4124, 0.3576, 0.1805,
				  0.2126, 0.7152, 0.0722,
				  0.0193, 0.1192, 0.9505 );
	}

	// RGB to Yxy via xyz
	vec3 xyz2yxy(vec3 c){
		float s=c.x+c.y+c.z;
		return vec3(c.y,c.x/s,c.y/s); //Blue's within s.
	}

	vec3 rgb2yxy(vec3 c){return xyz2yxy(rgb2xyz(c));}
	
	// RGB to LAB via xyz
	vec3 xyz2lab( vec3 c ) {
		vec3 n = c / vec3( 95.047, 100, 108.883 );
		vec3 v;
		v.x = ( n.x > 0.008856 ) ? pow( n.x, 1.0 / 3.0 ) : ( 7.787 * n.x ) + ( 16.0 / 116.0 );
		v.y = ( n.y > 0.008856 ) ? pow( n.y, 1.0 / 3.0 ) : ( 7.787 * n.y ) + ( 16.0 / 116.0 );
		v.z = ( n.z > 0.008856 ) ? pow( n.z, 1.0 / 3.0 ) : ( 7.787 * n.z ) + ( 16.0 / 116.0 );
		return vec3(( 116.0 * v.y ) - 16.0, 500.0 * ( v.x - v.y ), 200.0 * ( v.y - v.z ));
	}

	vec3 rgb2lab(vec3 c) {
		vec3 lab = xyz2lab( rgb2xyz( c ) );
		return vec3( lab.x / 100.0, 0.5 + 0.5 * ( lab.y / 127.0 ), 0.5 + 0.5 * ( lab.z / 127.0 ));
	}

	// RGB to HSV via HCV
	vec3 RGBtoHCV(vec3 rgb)
	{
		vec4 p = (rgb.g < rgb.b) ? vec4(rgb.bg, -1., 2. / 3.) : vec4(rgb.gb, 0., -1. / 3.);
		vec4 q = (rgb.r < p.x) ? vec4(p.xyw, rgb.r) : vec4(rgb.r, p.yzx);
		float c = q.x - min(q.w, q.y);
		float h = abs((q.w - q.y) / (6. * c + EPSILON) + q.z);
		return vec3(h, c, q.x);
	}

	vec3 RGBtoHSV(vec3 rgb)
	{
		vec3 hcv = RGBtoHCV(rgb);
		float s = hcv.y / (hcv.z + EPSILON);
		return vec3(hcv.x, s, hcv.z);
	}

	// RGB to HSL via HCV
	vec3 RGBtoHSL(vec3 rgb)
	{
		vec3 hcv = RGBtoHCV(rgb);
		float z = hcv.z - hcv.y * 0.5;
		float s = hcv.y / (1. - abs(z * 2. - 1.) + EPSILON);
		return vec3(hcv.x, s, z);
	}

	vec3 function (vec4 color) {
		vec3 selColSpace;

		if(colorSpace == 0) {
			selColSpace = color.rgb;
		}
		else if(colorSpace == 1) {
			selColSpace = rgb2yxy( color.rgb );
		}
		else if(colorSpace == 2) {
			selColSpace = rgb2lab( color.rgb );
		}
		else if(colorSpace == 3) {
			selColSpace = RGBtoHSV( color.rgb );
		}
		else if(colorSpace == 4) {
			selColSpace = RGBtoHCV( color.rgb );
		}
		else if(colorSpace == 5) {
			selColSpace = RGBtoHSL( color.rgb );
		}

		return selColSpace;
	}

	void main() {

		vec4 mvPosition =  modelViewMatrix * vec4(position, 1.0);
		
		color = function(texture2D ( tex, position.xy ));
		
		color.y = shadow * color.y;
		gl_PointSize = 5.0 / (-mvPosition.z + 2.0);
		gl_Position = projectionMatrix * modelViewMatrix * vec4(color-vec3(.5,.5,.5), 1.0);
	}
	`
const colorCloudFragmentShader =

	`
	uniform float shadow;
	
	varying vec3 color;

	void main() {
		if (shadow == 0.0) {
			gl_FragColor.rgba = vec4 (0.4, 0.4, 0.4, 0.75);
		}
		else {
			gl_FragColor.rgb = color;
			gl_FragColor.a = 1.0;
		}
		
	}
	`
export {vertexShader, fragmentShader,
		elevationVertexShader, elevationFragmentShader,
		colorCloudVertexShader, colorCloudFragmentShader}
