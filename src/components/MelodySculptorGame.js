"use client";

import { useEffect, useRef, useState } from 'react';

// --- Main Game Component ---
export default function MelodySculptorGame() {
    const mountRef = useRef(null);
    const [activeInstrument, setActiveInstrument] = useState('synth');
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        // Dynamically load the necessary libraries
        const threeScript = document.createElement('script');
        threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        document.body.appendChild(threeScript);

        const toneScript = document.createElement('script');
        toneScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/tone/14.7.77/Tone.js';
        document.body.appendChild(toneScript);

        let scene, camera, renderer, playheadWand, synths, soundNodes = [];
        let isDragging = false, lastMouseClickTime = 0, previousMousePosition = { x: 0, y: 0 };
        let cameraRadius = 25, cameraAngleX = 0.6, cameraAngleY = 0.5;

        const init = () => {
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0x0a0a1a);
            scene.fog = new THREE.Fog(0x0a0a1a, 20, 60);

            camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
            updateCameraPosition();
            
            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            mountRef.current.appendChild(renderer.domElement);
            
            // --- NEW VISUALS: Lighting ---
            scene.add(new THREE.AmbientLight(0xffffff, 0.5));
            const directionalLight = new THREE.DirectionalLight(0x87ceeb, 1);
            directionalLight.position.set(5, 10, 7.5);
            scene.add(directionalLight);

            // --- NEW VISUALS: Musical Plane ---
            const textureLoader = new THREE.TextureLoader();
            const groundTexture = textureLoader.load('https://i.imgur.com/vB1d2a2.png'); // Nebula texture
            groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
            groundTexture.repeat.set(5, 5);
            const groundMaterial = new THREE.MeshStandardMaterial({ map: groundTexture, transparent: true, opacity: 0.6 });
            const groundMesh = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), groundMaterial);
            groundMesh.rotation.x = -Math.PI / 2;
            scene.add(groundMesh);

            // --- NEW VISUALS: Playhead Wand ---
            playheadWand = new THREE.Group();
            const staffGeo = new THREE.CylinderGeometry(0.1, 0.15, 20, 8);
            const staffMat = new THREE.MeshBasicMaterial({ color: 0x9999ff, transparent: true, opacity: 0.5 });
            const staff = new THREE.Mesh(staffGeo, staffMat);
            const gemGeo = new THREE.IcosahedronGeometry(0.5, 0);
            const gemMat = new THREE.MeshBasicMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 1 });
            const gem = new THREE.Mesh(gemGeo, gemMat);
            gem.position.y = 10.2;
            playheadWand.add(staff);
            playheadWand.add(gem);
            playheadWand.position.x = -10;
            scene.add(playheadWand);

            // --- SOUND SETUP ---
            synths = {
                synth: new Tone.Synth({ oscillator: { type: 'fatsawtooth' } }).toDestination(),
                pluck: new Tone.PluckSynth().toDestination(),
                kick: new Tone.MembraneSynth({ octaves: 4, pitchDecay: 0.1 }).toDestination(),
            };

            // Event Listeners
            renderer.domElement.addEventListener('mousedown', onMouseDown);
            renderer.domElement.addEventListener('mousemove', onMouseMove);
            renderer.domElement.addEventListener('mouseup', onMouseUp);
            renderer.domElement.addEventListener('wheel', onMouseWheel);
            window.addEventListener('resize', onWindowResize);

            animate();
        };

        const onWindowResize = () => {
            if(!mountRef.current) return;
            camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        };
        
        const updateCameraPosition = () => {
             camera.position.x = cameraRadius * Math.sin(cameraAngleY) * Math.cos(cameraAngleX);
             camera.position.y = cameraRadius * Math.sin(cameraAngleX);
             camera.position.z = cameraRadius * Math.cos(cameraAngleY) * Math.cos(cameraAngleX);
             camera.lookAt(new THREE.Vector3(0, 0, 0));
        };

        const onMouseDown = (e) => {
            isDragging = false;
            lastMouseClickTime = Date.now();
            previousMousePosition = { x: e.clientX, y: e.clientY };
        };
        const onMouseUp = (e) => {
            if (!isDragging) {
                onClick(e); // Register as click if mouse didn't drag
            }
        };
        const onMouseMove = (e) => {
            if (Date.now() - lastMouseClickTime < 100) return; // Drag threshold
            isDragging = true;
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;
            cameraAngleY -= deltaX * 0.005;
            cameraAngleX += deltaY * 0.005;
            cameraAngleX = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, cameraAngleX));
            updateCameraPosition();
            previousMousePosition = { x: e.clientX, y: e.clientY };
        };
        const onMouseWheel = (e) => { cameraRadius += e.deltaY * 0.01; cameraRadius = Math.max(5, Math.min(50, cameraRadius)); updateCameraPosition(); };
        
        const onClick = (e) => {
             const mouse = new THREE.Vector2();
             const rect = renderer.domElement.getBoundingClientRect();
             mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
             mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

             const raycaster = new THREE.Raycaster();
             raycaster.setFromCamera(mouse, camera);

             const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
             const intersectPoint = new THREE.Vector3();
             if (raycaster.ray.intersectPlane(plane, intersectPoint)) {
                let geometry, material;
                const size = 0.5;
                // --- NEW VISUALS: Unique geometry for each instrument ---
                switch(activeInstrument) {
                    case 'pluck': 
                        geometry = new THREE.ConeGeometry(size * 0.8, size * 1.5, 4); // Pyramid
                        material = new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xffaa00, emissiveIntensity: 0.3 });
                        break;
                    case 'kick':
                        geometry = new THREE.BoxGeometry(size, size, size);
                        material = new THREE.MeshStandardMaterial({ color: 0xff0055, emissive: 0xff0055, emissiveIntensity: 0.3 });
                        break;
                    default:
                        geometry = new THREE.SphereGeometry(size * 0.8, 16, 16);
                        material = new THREE.MeshStandardMaterial({ color: 0x00aaff, emissive: 0x00aaff, emissiveIntensity: 0.3 });
                }
                const nodeMesh = new THREE.Mesh(geometry, material);
                nodeMesh.position.copy(intersectPoint);
                scene.add(nodeMesh);
                soundNodes.push({ mesh: nodeMesh, instrument: activeInstrument, triggered: false, time: Date.now() });
             }
        };

        let lastPlayheadPosition = -10;
        const animate = () => {
            requestAnimationFrame(animate);
            if (!renderer || !scene || !camera) return;

            if (isPlaying) {
                playheadWand.position.x += 0.05;
                if (playheadWand.position.x > 10) {
                    playheadWand.position.x = -10;
                    soundNodes.forEach(node => node.triggered = false);
                }

                soundNodes.forEach(node => {
                    // --- NEW VISUALS: Animation loops ---
                    if(node.instrument === 'pluck') node.mesh.rotation.y += 0.02;
                    if(node.instrument === 'kick' && node.isPulsing) {
                        const elapsed = (Date.now() - node.pulseTime) / 150;
                        const scale = elapsed < 1 ? 1 + 0.5 * Math.sin(elapsed * Math.PI) : 1;
                        node.mesh.scale.set(scale, scale, scale);
                        if(elapsed >= 1) node.isPulsing = false;
                    }

                    if (!node.triggered && lastPlayheadPosition < node.mesh.position.x && playheadWand.position.x >= node.mesh.position.x) {
                        const pitches = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
                        const pitchIndex = Math.floor(node.mesh.position.y) % 7;
                        const octave = Math.floor(node.mesh.position.y / 7) + 3;
                        const pitch = pitches[pitchIndex] + octave;
                        
                        const volume = -25 + (node.mesh.position.z + 10) * 2;
                        
                        if (node.instrument === 'kick') {
                            synths.kick.triggerAttackRelease('C1', '8n');
                            node.isPulsing = true;
                            node.pulseTime = Date.now();
                        } else {
                            synths[node.instrument].triggerAttackRelease(pitch, '8n', Tone.now(), volume);
                        }
                        node.triggered = true;
                    }
                });
                lastPlayheadPosition = playheadWand.position.x;
            }
            renderer.render(scene, camera);
        };
        
        threeScript.onload = () => {
            toneScript.onload = () => {
                if (mountRef.current && mountRef.current.children.length === 0) {
                    init();
                }
            }
        };

        return () => {
            window.removeEventListener('resize', onWindowResize);
            if(renderer && mountRef.current) {
                 mountRef.current.removeChild(renderer.domElement);
            }
            document.body.removeChild(threeScript);
            document.body.removeChild(toneScript);
        };
    }, []);

    const handlePlayClick = () => {
        // --- SOUND FIX: Start audio context on user interaction ---
        if (window.Tone && window.Tone.context.state !== 'running') {
            window.Tone.start();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="w-full h-screen bg-black flex flex-col">
            <div className="p-4 bg-gray-900/80 text-white flex justify-between items-center z-10">
                <div>
                    <h2 className="text-2xl font-bold text-sky-400">Melody Sculptor</h2>
                    <p className="text-gray-400">Click to place a sound. Drag to orbit. Scroll to zoom.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                        <button onClick={() => setActiveInstrument('synth')} className={`px-3 py-2 rounded ${activeInstrument === 'synth' ? 'bg-blue-500' : 'bg-gray-700'}`}>Synth (Sphere)</button>
                        <button onClick={() => setActiveInstrument('pluck')} className={`px-3 py-2 rounded ${activeInstrument === 'pluck' ? 'bg-orange-500' : 'bg-gray-700'}`}>Pluck (Pyramid)</button>
                        <button onClick={() => setActiveInstrument('kick')} className={`px-3 py-2 rounded ${activeInstrument === 'kick' ? 'bg-red-500' : 'bg-gray-700'}`}>Kick (Cube)</button>
                    </div>
                    <button onClick={handlePlayClick} className={`px-4 py-2 rounded w-24 ${isPlaying ? 'bg-red-600' : 'bg-green-600'}`}>{isPlaying ? 'Stop' : 'Play'}</button>
                </div>
            </div>
            <div ref={mountRef} className="flex-grow w-full h-full" />
        </div>
    );
}

