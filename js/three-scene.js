class LMAJHOLScene {
    constructor() {
        this.scenes = [];
        this.mouse = { x: 0, y: 0 };
        this.clock = new THREE.Clock();
        this.init();
    }
    init() {
        this.setupHeroScene();
        this.setupShowcaseScene();
        this.setupEventListeners();
        this.animate();
    }
    setupHeroScene() {
        const canvas = document.getElementById('heroCanvas');
        if (!canvas) return;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        camera.position.z = 5;
        scene.add(new THREE.AmbientLight(0xffffff, 0.4));
        const mainLight = new THREE.DirectionalLight(0xffffff, 1);
        mainLight.position.set(5, 5, 5);
        scene.add(mainLight);
        const fillLight = new THREE.DirectionalLight(0x8888ff, 0.3);
        fillLight.position.set(-5, 0, -5);
        scene.add(fillLight);
        this.createHeroTShirt(scene);
        this.createParticles(scene, 500);
        this.createFloatingShapes(scene);
        this.scenes.push({ scene, camera, renderer, type: 'hero' });
    }
    createHeroTShirt(scene) {
        const bodyGeo = new THREE.BoxGeometry(2, 2.5, 0.3);
        const bodyMat = new THREE.MeshPhysicalMaterial({ color: 0xfafafa, roughness: 0.8, metalness: 0.0, clearcoat: 0.1 });
        this.heroTShirt = new THREE.Mesh(bodyGeo, bodyMat);
        scene.add(this.heroTShirt);
        const sleeveGeo = new THREE.BoxGeometry(0.8, 0.8, 0.3);
        const leftSleeve = new THREE.Mesh(sleeveGeo, bodyMat);
        leftSleeve.position.set(-1.2, 0.5, 0);
        leftSleeve.rotation.z = Math.PI / 6;
        this.heroTShirt.add(leftSleeve);
        const rightSleeve = new THREE.Mesh(sleeveGeo, bodyMat);
        rightSleeve.position.set(1.2, 0.5, 0);
        rightSleeve.rotation.z = -Math.PI / 6;
        this.heroTShirt.add(rightSleeve);
        const collarGeo = new THREE.TorusGeometry(0.5, 0.08, 8, 32, Math.PI);
        const collarMat = new THREE.MeshPhysicalMaterial({ color: 0xe0e0e0, roughness: 0.9 });
        const collar = new THREE.Mesh(collarGeo, collarMat);
        collar.position.set(0, 1.25, 0.15);
        collar.rotation.x = Math.PI / 2;
        this.heroTShirt.add(collar);
    }
    createParticles(scene, count) {
        const geo = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
        }
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.02, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending });
        this.particles = new THREE.Points(geo, mat);
        scene.add(this.particles);
    }
    createFloatingShapes(scene) {
        this.floatingShapes = [];
        const shapes = [
            { geo: new THREE.IcosahedronGeometry(0.3, 0), pos: [-3, 2, -2] },
            { geo: new THREE.OctahedronGeometry(0.25), pos: [3, -1, -3] },
            { geo: new THREE.TetrahedronGeometry(0.2), pos: [-2, -2, -1] },
            { geo: new THREE.TorusGeometry(0.2, 0.05, 8, 32), pos: [2, 3, -2] },
            { geo: new THREE.DodecahedronGeometry(0.2), pos: [4, 1, -4] }
        ];
        shapes.forEach((s, i) => {
            const mat = new THREE.MeshPhysicalMaterial({ color: i % 2 === 0 ? 0xfafafa : 0xc9a96e, roughness: 0.3, metalness: 0.2, transparent: true, opacity: 0.6 });
            const mesh = new THREE.Mesh(s.geo, mat);
            mesh.position.set(...s.pos);
            mesh.userData = { originalPos: [...s.pos], speed: Math.random() * 0.5 + 0.5, rotSpeed: Math.random() * 0.02 + 0.01 };
            scene.add(mesh);
            this.floatingShapes.push(mesh);
        });
    }
    setupShowcaseScene() {
        const canvas = document.getElementById('showcaseCanvas');
        if (!canvas) return;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        camera.position.set(0, 0, 6);
        scene.add(new THREE.AmbientLight(0xffffff, 0.3));
        const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
        keyLight.position.set(3, 3, 5);
        scene.add(keyLight);
        const rimLight = new THREE.DirectionalLight(0xc9a96e, 0.5);
        rimLight.position.set(-3, 2, -3);
        scene.add(rimLight);
        this.createShowcaseTShirt(scene);
        this.createGridBackground(scene);
        this.scenes.push({ scene, camera, renderer, type: 'showcase' });
    }
    createShowcaseTShirt(scene) {
        const group = new THREE.Group();
        const bodyGeo = new THREE.BoxGeometry(2.2, 2.8, 0.4);
        const bodyMat = new THREE.MeshPhysicalMaterial({ color: 0x0a0a0a, roughness: 0.7, metalness: 0.05, clearcoat: 0.2 });
        group.add(new THREE.Mesh(bodyGeo, bodyMat));
        const sleeveGeo = new THREE.BoxGeometry(0.9, 0.9, 0.4);
        const ls = new THREE.Mesh(sleeveGeo, bodyMat);
        ls.position.set(-1.3, 0.6, 0);
        ls.rotation.z = Math.PI / 5;
        group.add(ls);
        const rs = new THREE.Mesh(sleeveGeo, bodyMat);
        rs.position.set(1.3, 0.6, 0);
        rs.rotation.z = -Math.PI / 5;
        group.add(rs);
        const collarGeo = new THREE.TorusGeometry(0.55, 0.08, 8, 32, Math.PI);
        const collar = new THREE.Mesh(collarGeo, new THREE.MeshPhysicalMaterial({ color: 0x1a1a1a, roughness: 0.9 }));
        collar.position.set(0, 1.4, 0.2);
        collar.rotation.x = Math.PI / 2;
        group.add(collar);
        group.position.x = 2;
        scene.add(group);
        this.showcaseTShirt = group;
    }
    createGridBackground(scene) {
        const gridGeo = new THREE.PlaneGeometry(30, 30, 30, 30);
        const gridMat = new THREE.MeshBasicMaterial({ color: 0x333333, wireframe: true, transparent: true, opacity: 0.15 });
        const grid = new THREE.Mesh(gridGeo, gridMat);
        grid.position.z = -5;
        scene.add(grid);
    }
    setupEventListeners() {
        window.addEventListener('resize', () => this.onResize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            ScrollTrigger.create({
                trigger: '#hero', start: 'top top', end: 'bottom top',
                onUpdate: (self) => {
                    if (this.heroTShirt) {
                        this.heroTShirt.rotation.x = self.progress * 0.5;
                        this.heroTShirt.rotation.y = self.progress * Math.PI;
                        this.heroTShirt.position.y = -self.progress * 2;
                    }
                }
            });
            ScrollTrigger.create({
                trigger: '#showcase', start: 'top bottom', end: 'bottom top',
                onUpdate: (self) => {
                    if (this.showcaseTShirt) {
                        this.showcaseTShirt.rotation.y = self.progress * Math.PI * 2;
                        this.showcaseTShirt.rotation.x = Math.sin(self.progress * Math.PI) * 0.3;
                    }
                }
            });
        }
    }
    onResize() {
        this.scenes.forEach(({ camera, renderer }) => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    animate() {
        requestAnimationFrame(() => this.animate());
        const time = this.clock.getElapsedTime();
        if (this.heroTShirt) { this.heroTShirt.position.y = Math.sin(time * 0.8) * 0.15; this.heroTShirt.rotation.y += 0.003; }
        if (this.particles) { this.particles.rotation.y += 0.0005; this.particles.rotation.x += 0.0002; }
        if (this.floatingShapes) {
            this.floatingShapes.forEach((shape, i) => {
                const { originalPos, speed, rotSpeed } = shape.userData;
                shape.position.y = originalPos[1] + Math.sin(time * speed + i) * 0.3;
                shape.position.x = originalPos[0] + Math.cos(time * speed * 0.5 + i) * 0.2;
                shape.rotation.x += rotSpeed;
                shape.rotation.y += rotSpeed * 0.7;
            });
        }
        if (this.scenes[0]) {
            const cam = this.scenes[0].camera;
            cam.position.x += (this.mouse.x * 0.3 - cam.position.x) * 0.05;
            cam.position.y += (this.mouse.y * 0.3 - cam.position.y) * 0.05;
            cam.lookAt(0, 0, 0);
        }
        this.scenes.forEach(({ scene, camera, renderer }) => renderer.render(scene, camera));
    }
}
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => { try { window.lmajholScene = new LMAJHOLScene(); } catch(e) { console.warn('3D error:', e); } }, 100);
});
