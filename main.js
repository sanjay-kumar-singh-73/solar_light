
const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('solarCanvas') });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFDB813 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const planetsData = [
        { name: 'Mercury', color: 0xaaaaaa, size: 0.2, distance: 4, speed: 0.02 },
        { name: 'Venus', color: 0xffd700, size: 0.4, distance: 6, speed: 0.015 },
        { name: 'Earth', color: 0x0000ff, size: 0.5, distance: 8, speed: 0.01 },
        { name: 'Mars', color: 0xff4500, size: 0.3, distance: 10, speed: 0.008 },
        { name: 'Jupiter', color: 0xffa500, size: 1, distance: 13, speed: 0.006 },
        { name: 'Saturn', color: 0xffcc00, size: 0.9, distance: 16, speed: 0.005 },
        { name: 'Uranus', color: 0x00ffff, size: 0.7, distance: 19, speed: 0.004 },
        { name: 'Neptune', color: 0x0000ff, size: 0.6, distance: 22, speed: 0.003 },
    ];

    const planets = [];

    planetsData.forEach(data => {
        const geometry = new THREE.SphereGeometry(data.size, 32, 32);
        const material = new THREE.MeshStandardMaterial({ color: data.color });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        planets.push({ ...data, mesh, angle: Math.random() * Math.PI * 2 });
    });

    // Camera Position
    camera.position.z = 30;

    // Controls Panel
    const controlsDiv = document.getElementById('controls');
    planetsData.forEach((planet, index) => {
        const label = document.createElement('label');
        label.innerHTML = `${planet.name} Speed: `;

        const input = document.createElement('input');
        input.type = 'range';
        input.min = 0.001;
        input.max = 0.05;
        input.step = 0.001;
        input.value = planet.speed;
        input.classList.add('planet-slider');
        input.style.setProperty('--slider-color', `#${planet.color.toString(16).padStart(6, '0')}`);

        const updateBackground = () => {
            const percentage = (input.value - input.min) / (input.max - input.min) * 100;
            input.style.backgroundSize = `${percentage}% 100%`;
        };

        input.addEventListener('input', (e) => {
            planets[index].speed = parseFloat(e.target.value);
            updateBackground();
        });

        updateBackground(); // initialize

        label.appendChild(input);
        controlsDiv.appendChild(label);
        controlsDiv.appendChild(document.createElement('br'));
    });

    // Animation
    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();

        planets.forEach(planet => {
            planet.angle += planet.speed;
            planet.mesh.position.set(
                Math.cos(planet.angle) * planet.distance,
                0,
                Math.sin(planet.angle) * planet.distance
            );
            planet.mesh.rotation.y += 0.01;
        });

        renderer.render(scene, camera);
    }
    animate();

    // Responsive
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });