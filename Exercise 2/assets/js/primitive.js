import * as THREE from '../../../../node_modules/three/build/three.module.js';

function createPrimitives(z) {

    const spread = 15;
    const z_spread = 50;
    const primitives = [];

    function addObject(x, y, z, obj) {
        obj.position.x = x * spread;
        obj.position.y = y * spread;
        obj.position.z = z * z_spread;

        primitives.push(obj);
    }

    function createMaterial() {
        const material = new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        });

        const hue = Math.random();
        const saturation = 1;
        const luminance = .5;
        material.color.setHSL(hue, saturation, luminance);

        return material;
    }

    function addSolidGeometry(x, y, z, geometry) {
        const mesh = new THREE.Mesh(geometry, createMaterial());
        addObject(x, y, z, mesh);
    }

    function addLineGeometry(x, y, z, geometry) {
        const material = new THREE.LineBasicMaterial({color: 0x000000});
        const mesh = new THREE.LineSegments(geometry, material);
        addObject(x, y, z, mesh);
    }

    {
        const width = 8;
        const height = 8;
        const depth = 8;
        addSolidGeometry(-2, 2, z, new THREE.BoxGeometry(width, height, depth));
    }
    {
        const radius = 7;
        const segments = 24;
        addSolidGeometry(-1, 2, z, new THREE.CircleGeometry(radius, segments));
    }
    {
        const radius = 6;
        const height = 8;
        const segments = 16;
        addSolidGeometry(0, 2, z, new THREE.ConeGeometry(radius, height, segments));
    }
    {
        const radiusTop = 4;
        const radiusBottom = 4;
        const height = 8;
        const radialSegments = 12;
        addSolidGeometry(1, 2, z, new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments));
    }
    {
        const radius = 7;
        addSolidGeometry(2, 2, z, new THREE.DodecahedronGeometry(radius));
    }
    {
        const shape = new THREE.Shape();
        const x = -2.5;
        const y = -5;
        shape.moveTo(x + 2.5, y + 2.5);
        shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
        shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
        shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
        shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
        shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
        shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

        const extrudeSettings = {
        steps: 2,
        depth: 2,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelSegments: 2,
        };

        addSolidGeometry(-2, 1, z, new THREE.ExtrudeGeometry(shape, extrudeSettings));
    }
    {
        const radius = 7;
        addSolidGeometry(-1, 1, z, new THREE.IcosahedronGeometry(radius));
    }
    {
        const points = [];
        for (let i = 0; i < 10; ++i) {
        points.push(new THREE.Vector2(Math.sin(i * 0.2) * 3 + 3, (i - 5) * .8));
        }
        addSolidGeometry(0, 1, z, new THREE.LatheGeometry(points));
    }
    {
        const radius = 7;
        addSolidGeometry(1, 1, z, new THREE.OctahedronGeometry(radius));
    }
    {
        
        function klein(v, u, target) {
        u *= Math.PI;
        v *= 2 * Math.PI;
        u = u * 2;

        let x;
        let z;

        if (u < Math.PI) {
            x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(u) * Math.cos(v);
            z = -8 * Math.sin(u) - 2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v);
        } else {
            x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(v + Math.PI);
            z = -8 * Math.sin(u);
        }

        const y = -2 * (1 - Math.cos(u) / 2) * Math.sin(v);

        target.set(x, y, z).multiplyScalar(0.75);
        }

        const slices = 25;
        const stacks = 25;
        addSolidGeometry(2, 1, z, new THREE.ParametricGeometry(klein, slices, stacks));
    }
    {
        const width = 9;
        const height = 9;
        const widthSegments = 2;
        const heightSegments = 2;
        addSolidGeometry(-2, 0, z, new THREE.PlaneGeometry(width, height, widthSegments, heightSegments));
    }
    {
        const verticesOfCube = [
            -1, -1, -1,    1, -1, -1,    1,  1, -1,    -1,  1, -1,
            -1, -1,  1,    1, -1,  1,    1,  1,  1,    -1,  1,  1,
        ];
        const indicesOfFaces = [
            2, 1, 0,    0, 3, 2,
            0, 4, 7,    7, 3, 0,
            0, 1, 5,    5, 4, 0,
            1, 2, 6,    6, 5, 1,
            2, 3, 7,    7, 6, 2,
            4, 5, 6,    6, 7, 4,
        ];
        const radius = 7;
        const detail = 2;
        addSolidGeometry(-1, 0, z, new THREE.PolyhedronGeometry(verticesOfCube, indicesOfFaces, radius, detail));
    }
    {
        const innerRadius = 2;
        const outerRadius = 7;
        const segments = 18;
        addSolidGeometry(0, 0, z, new THREE.RingGeometry(innerRadius, outerRadius, segments));
    }
    {
        const shape = new THREE.Shape();
        const x = -2.5;
        const y = -5;
        shape.moveTo(x + 2.5, y + 2.5);
        shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
        shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
        shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
        shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
        shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
        shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);
        addSolidGeometry(1, 0, z, new THREE.ShapeGeometry(shape));
    }
    {
        const radius = 7;
        const widthSegments = 12;
        const heightSegments = 8;
        addSolidGeometry(2, 0, z, new THREE.SphereGeometry(radius, widthSegments, heightSegments));
    }
    {
        const radius = 7;
        addSolidGeometry(-2, -1, z, new THREE.TetrahedronGeometry(radius));
    }
    {
        const loader = new THREE.FontLoader();
        // promisify font loading
        function loadFont(url) {
        return new Promise((resolve, reject) => {
            loader.load(url, resolve, undefined, reject);
        });
        }

        async function doit() {
        const font = await loadFont('https://threejsfundamentals.org/threejs/resources/threejs/fonts/helvetiker_regular.typeface.json');  
        const geometry = new THREE.TextGeometry('three.js', {
            font: font,
            size: 3.0,
            height: .2,
            curveSegments: 12,
            bevelEnabled: true,
            bevelThickness: 0.15,
            bevelSize: .3,
            bevelSegments: 5,
        });

        addSolidGeometry(-2, -1, z, geometry);
        }
        doit();

    }
    {
        const radius = 5;
        const tubeRadius = 2;
        const radialSegments = 8;
        const tubularSegments = 24;
        addSolidGeometry(0, -1, z, new THREE.TorusGeometry(radius, tubeRadius, radialSegments, tubularSegments));
    }
    {
        const radius = 3.5;
        const tube = 1.5;
        const radialSegments = 8;
        const tubularSegments = 64;
        const p = 2;
        const q = 3;
        addSolidGeometry(1, -1, z, new THREE.TorusKnotGeometry(radius, tube, tubularSegments, radialSegments, p, q));
    }
    {
        class CustomSinCurve extends THREE.Curve {
        constructor(scale) {
            super();
            this.scale = scale;
        }
        getPoint(t) {
            const tx = t * 3 - 1.5;
            const ty = Math.sin(2 * Math.PI * t);
            const tz = 0;
            return new THREE.Vector3(tx, ty, tz).multiplyScalar(this.scale);
        }
        }

        const path = new CustomSinCurve(4);
        const tubularSegments = 20;
        const radius = 1;
        const radialSegments = 8;
        const closed = false;
        addSolidGeometry(2, -1, z, new THREE.TubeGeometry(path, tubularSegments, radius, radialSegments, closed));
    }
    {
        const width = 8;
        const height = 8;
        const depth = 8;
        const thresholdAngle = 15;
        addLineGeometry(-1, -2, z, new THREE.EdgesGeometry(
            new THREE.BoxGeometry(width, height, depth),
            thresholdAngle));
    }
    {
        const width = 8;
        const height = 8;
        const depth = 8;
        addLineGeometry(1, -2, z, new THREE.WireframeGeometry(new THREE.BoxGeometry(width, height, depth)));
    }

    return primitives;

}

export default createPrimitives;
