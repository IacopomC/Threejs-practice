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


	float function ( vec4 color )
	{
		vec4 colorRGB = color;
		if(colorSpace == 0) {
			color = colorRGB;
		}
		if(colorChannel == 0) {
			return length ( color.x );
		}
		else if(colorChannel == 1) {
			return length ( color.y );
		}
		if(colorChannel == 2) {
			return length ( color.z );
		}
		return length ( color.rgb );
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
	varying vec3 color;

	void main() {
		color = texture2D ( tex, position.xy ).rgb;
		gl_PointSize = 1.0;
		gl_Position = projectionMatrix * modelViewMatrix * vec4(color-vec3(.5,.5,.5), 1.0);
	}
	`
const colorCloudFragmentShader =

	`
	varying vec3 color;

	void main() {
		gl_FragColor.rgb = color;
		gl_FragColor.a = 1.0;
	}
	`
export {vertexShader, fragmentShader,
		elevationVertexShader, elevationFragmentShader,
		colorCloudVertexShader, colorCloudFragmentShader}
