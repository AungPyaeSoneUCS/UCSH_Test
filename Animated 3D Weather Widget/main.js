import * as THREE from "https://esm.sh/three";
import { OrbitControls } from "https://esm.sh/three/examples/jsm/controls/OrbitControls.js";

const dateTimeEl = document.getElementById('dateTime');

function updateDateTime() {
    const now = new Date();
    const optionsDate = { weekday: 'long' };
    const optionsTime = { hour: '2-digit', minute: '2-digit', hour12: false };
    if (dateTimeEl) {
        dateTimeEl.textContent = `${now.toLocaleDateString(undefined, optionsDate)}, ${now.toLocaleTimeString([], optionsTime)}`;
    }
}
updateDateTime();
setInterval(updateDateTime, 60000);

const container = document.getElementById('cloud-container');

if (container) {
    const containerRect = container.getBoundingClientRect();
    const scene = new THREE.Scene();
    const cameraAspect = (containerRect.width > 0 && containerRect.height > 0) ? containerRect.width / containerRect.height : 1;
    const camera = new THREE.PerspectiveCamera(60, cameraAspect, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(containerRect.width, containerRect.height);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    camera.position.set(0, 0.5, 4.5);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
    directionalLight.position.set(2, 3, 2);
    scene.add(directionalLight);
    const pointLight = new THREE.PointLight(0xaabbee, 0.8, 15);
    pointLight.position.set(-1, 1, 3);
    scene.add(pointLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.07;
    controls.rotateSpeed = 0.8;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI / 3;
    controls.maxPolarAngle = Math.PI / 1.8;
    controls.target.set(0, 0, 0);

    const cloudGroup = new THREE.Group();
    scene.add(cloudGroup);

    const cloudMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xf0f8ff,
        transparent: true, opacity: 0.85, roughness: 0.6, metalness: 0.0,
        transmission: 0.1,
        ior: 1.3,
        specularIntensity: 0.2,
        sheen: 0.2, sheenColor: 0xffffff, sheenRoughness: 0.5,
        clearcoat: 0.05, clearcoatRoughness: 0.3,
    });

    function createCloudPart(radius, position) {
        const geometry = new THREE.SphereGeometry(radius, 20, 20);
        const mesh = new THREE.Mesh(geometry, cloudMaterial);
        mesh.position.copy(position);
        return mesh;
    }

    function createDetailedCloud(x, y, z, scale) {
        const singleCloudGroup = new THREE.Group();
        singleCloudGroup.position.set(x, y, z);
        singleCloudGroup.scale.set(scale, scale, scale);
        const parts = [
            { radius: 0.8, position: new THREE.Vector3(0, 0, 0) }, { radius: 0.6, position: new THREE.Vector3(0.7, 0.2, 0.1) },
            { radius: 0.55, position: new THREE.Vector3(-0.6, 0.1, -0.2) }, { radius: 0.7, position: new THREE.Vector3(0.1, 0.4, -0.3) },
            { radius: 0.5, position: new THREE.Vector3(0.3, -0.3, 0.2) }, { radius: 0.6, position: new THREE.Vector3(-0.4, -0.2, 0.3) },
            { radius: 0.45, position: new THREE.Vector3(0.8, -0.1, -0.2) }, { radius: 0.5, position: new THREE.Vector3(-0.7, 0.3, 0.3) },
        ];
        parts.forEach(part => singleCloudGroup.add(createCloudPart(part.radius, part.position)));
        singleCloudGroup.userData = {
            isRaining: false, rainColor: Math.random() > 0.5 ? 0x87CEFA : 0xB0E0E6,
            originalPosition: singleCloudGroup.position.clone(), bobOffset: Math.random() * Math.PI * 2,
            bobSpeed: 0.0005 + Math.random() * 0.0003, bobAmount: 0.15 + Math.random() * 0.1,
        };
        return singleCloudGroup;
    }

    const cloud1 = createDetailedCloud(-0.7, 0.2, 0, 1.0);
    const cloud2 = createDetailedCloud(0.7, -0.1, 0.3, 0.9);
    cloudGroup.add(cloud1, cloud2);
    cloudGroup.position.y = -0.2;
    let autoRotateSpeed = 0.002;

    function createRaindropsForCloud(cloud) {
        const rainGroup = new THREE.Group();
        cloud.add(rainGroup);
        cloud.userData.rainGroup = rainGroup;
        const raindropMaterial = new THREE.MeshBasicMaterial({ color: cloud.userData.rainColor, transparent: true, opacity: 0.7 });
        const localRaindrops = [];
        for (let i = 0; i < 30; i++) {
            const raindropGeom = new THREE.CylinderGeometry(0.015, 0.015, 0.25, 6);
            const raindrop = new THREE.Mesh(raindropGeom, raindropMaterial);
            raindrop.position.set( (Math.random() - 0.5) * 1.8, -0.8 - Math.random() * 1.5, (Math.random() - 0.5) * 1.8 );
            raindrop.userData = { originalY: raindrop.position.y - Math.random() * 0.5, speed: 0.08 + Math.random() * 0.05 };
            localRaindrops.push(raindrop);
            rainGroup.add(raindrop);
        }
        rainGroup.visible = false;
        return localRaindrops;
    }

    const raindrops1 = createRaindropsForCloud(cloud1);
    const raindrops2 = createRaindropsForCloud(cloud2);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    renderer.domElement.addEventListener('click', (event) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(cloudGroup.children, true);

        if (intersects.length > 0) {
            let clickedObj = intersects[0].object;
            let physicallyClickedCloud = null;
            while (clickedObj.parent && clickedObj.parent !== cloudGroup) {
                clickedObj = clickedObj.parent;
            }

            if (clickedObj.parent === cloudGroup) {
                physicallyClickedCloud = clickedObj;

                const isCloud1Raining = cloud1.userData.isRaining;
                const isCloud2Raining = cloud2.userData.isRaining;

                let newGlobalRainState;
                if (isCloud1Raining && isCloud2Raining) {
                    newGlobalRainState = false;
                } else {
                    newGlobalRainState = true;
                }

                cloud1.userData.isRaining = newGlobalRainState;
                if (cloud1.userData.rainGroup) {
                    cloud1.userData.rainGroup.visible = newGlobalRainState;
                }

                cloud2.userData.isRaining = newGlobalRainState;
                if (cloud2.userData.rainGroup) {
                    cloud2.userData.rainGroup.visible = newGlobalRainState;
                }

                if (physicallyClickedCloud) {
                    const originalScale = physicallyClickedCloud.scale.clone();
                    physicallyClickedCloud.scale.multiplyScalar(1.15);
                    setTimeout(() => {
                        physicallyClickedCloud.scale.copy(originalScale);
                    }, 150);
                }
            }
        }
    });

    const tooltip = document.getElementById('cloud-tooltip');
    setTimeout(() => {
        if (tooltip) tooltip.classList.add('opacity-100');
        setTimeout(() => { if (tooltip) tooltip.classList.remove('opacity-100'); }, 3500);
    }, 1500);

    function animate() {
        requestAnimationFrame(animate);
        const time = Date.now();
        cloudGroup.rotation.y += autoRotateSpeed;

        [cloud1, cloud2].forEach(cloud => {
            if (cloud) {
                cloud.position.y = cloud.userData.originalPosition.y + Math.sin(time * cloud.userData.bobSpeed + cloud.userData.bobOffset) * cloud.userData.bobAmount;

                if (cloud.userData.isRaining && cloud.userData.rainGroup) {
                    const currentRaindrops = cloud === cloud1 ? raindrops1 : raindrops2;
                    currentRaindrops.forEach(raindrop => {
                        raindrop.position.y -= raindrop.userData.speed;
                        if (raindrop.position.y < -5) {
                            raindrop.position.y = -0.8;
                            raindrop.position.x = (Math.random() - 0.5) * 1.8 * cloud.scale.x;
                            raindrop.position.z = (Math.random() - 0.5) * 1.8 * cloud.scale.z;
                        }
                    });
                }
            }
        });
        controls.update();
        renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
        const newRect = container.getBoundingClientRect();
        if (newRect.width > 0 && newRect.height > 0) {
            camera.aspect = newRect.width / newRect.height;
            camera.updateProjectionMatrix();
            renderer.setSize(newRect.width, newRect.height);
        }
    });

    animate();

} else {
    console.error("Cloud container (id: 'cloud-container') not found! 3D cloud animation will not be initialized.");
}