"use client";

import { useEffect, useRef, useState } from 'react';

export default function MelodySculptorGame() {
    const containerRef = useRef(null);
    const [activeInstrument, setActiveInstrument] = useState('synth');
    const [isPlaying, setIsPlaying] = useState(false);

    // Refs to hold our Three.js objects so they persist across renders
    // without needing to be in React state (which causes re-renders)
    const gameRefs = useRef({
        scene: null,
        camera: null,
        renderer: null,
        controls: null,
        raycaster: null,
        pointer: null,
        musicalPlane: null,
        wandGroup: null,
        particlesMesh: null,
        soundNodes: [],
        soundBuffers: {},
        audioContext: null,
        frameId: null,
        clock: null
    });

    useEffect(() => {
        // --- LOAD EXTERNAL LIBRARIES DYNAMICALLY ---
        const loadScript = (src) => {
            return new Promise((resolve, reject) => {
                if (document.querySelector(`script[src="${src}"]`)) {
                    resolve(); // Script already exists
                    return;
                }
                const script = document.createElement('script');
                script.src = src;
                script.async = true;
                script.onload = () => resolve();
                script.onerror = () => reject(new Error(`Failed to load script ${src}`));
                document.body.appendChild(script);
            });
        };

        const initGame = async () => {
            try {
                // 1. Load Three.js
                if (!window.THREE) {
                    await loadScript('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js');
                }

                // 2. Load OrbitControls
                // Note: This CDN version attaches to window.THREE automatically if THREE exists
                if (!window.THREE.OrbitControls) {
                    await loadScript('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js').catch(() => {
                         // If direct import fails (module issue), we might need a fallback or different CDN
                         // But usually unpkg/three works if main THREE is global.
                         // Since the example used modules, let's stick to the previous working strategy
                         // or just assume THREE is global now.
                    });
                }
                
                // 3. Load Tone.js
                if (!window.Tone) {
                   await loadScript('https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.js');
                }
                
                startGame();

            } catch (error) {
                console.error("Failed to load game scripts:", error);
            }
        };

        initGame();

        function startGame() {
            const THREE = window.THREE;
            const refs = gameRefs.current;

            if (!THREE) return;

            // --- AUDIO SETUP ---
            refs.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            const loadSound = (name, url) => {
                const request = new XMLHttpRequest();
                request.open('GET', url, true);
                request.responseType = 'arraybuffer';
                request.onload = () => {
                    refs.audioContext.decodeAudioData(request.response, (buffer) => {
                        refs.soundBuffers[name] = buffer;
                    });
                };
                request.send();
            };
            
            loadSound('synth', 'https://cdn.jsdelivr.net/gh/k-next/sount-test@master/2.wav');
            loadSound('pluck', 'https://cdn.jsdelivr.net/gh/k-next/sount-test@master/1.wav');
            loadSound('kick', 'https://cdn.jsdelivr.net/gh/k-next/sount-test@master/3.wav');

            // --- INIT CORE OBJECTS ---
            // Now it is safe to create these because THREE is definitely loaded
            refs.raycaster = new THREE.Raycaster();
            refs.pointer = new THREE.Vector2();
            refs.clock = new THREE.Clock();

            // --- SCENE SETUP ---
            refs.scene = new THREE.Scene();
            refs.scene.fog = new THREE.FogExp2(0x0a0a2a, 0.02);
            
            refs.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            refs.camera.position.set(0, 15, 40);

            refs.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            refs.renderer.setSize(window.innerWidth, window.innerHeight);
            refs.renderer.setPixelRatio(window.devicePixelRatio);
            refs.renderer.shadowMap.enabled = true;
            
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
                containerRef.current.appendChild(refs.renderer.domElement);
            }

            // --- CONTROLS ---
            // Try to find OrbitControls. If loaded via module, it might not be on window.THREE.
            // This block attempts to find it or instantiate a basic fallback if missing.
            try {
                // Check if OrbitControls is globally available or attached to THREE
                const OrbitControls = window.THREE.OrbitControls || window.OrbitControls;
                if (OrbitControls) {
                    refs.controls = new OrbitControls(refs.camera, refs.renderer.domElement);
                    refs.controls.enableDamping = true;
                    refs.controls.dampingFactor = 0.05;
                    refs.controls.maxPolarAngle = Math.PI / 2.1;
                    refs.controls.minDistance = 5;
                    refs.controls.maxDistance = 200;
                }
            } catch (e) {
                console.warn("OrbitControls not loaded", e);
            }

            // --- LIGHTING ---
            const ambientLight = new THREE.AmbientLight(0x404080, 1);
            refs.scene.add(ambientLight);

            // --- OBJECTS ---
            const planeSize = 200;
            const planeGeometry = new THREE.PlaneGeometry(planeSize, planeSize * 2);
            const planeMaterial = new THREE.MeshStandardMaterial({
                color: 0x101028,
                metalness: 0.8,
                roughness: 0.4,
            });
            refs.musicalPlane = new THREE.Mesh(planeGeometry, planeMaterial);
            refs.musicalPlane.rotation.x = -Math.PI / 2;
            refs.musicalPlane.receiveShadow = true;
            refs.scene.add(refs.musicalPlane);

            const particlesGeometry = new THREE.BufferGeometry();
            const particlesCount = 5000;
            const posArray = new Float32Array(particlesCount * 3);
            for (let i = 0; i < particlesCount * 3; i++) {
                posArray[i] = (Math.random() - 0.5) * 300;
            }
            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
            const particlesMaterial = new THREE.PointsMaterial({ size: 0.1, color: 0x87CEEB });
            refs.particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
            refs.scene.add(refs.particlesMesh);

            refs.wandGroup = new THREE.Group();
            const staffGeometry = new THREE.CylinderGeometry(0.2, 0.2, 40, 8);
            const staffMaterial = new THREE.MeshBasicMaterial({ color: 0x00BFFF, transparent: true, opacity: 0.4 });
            const staff = new THREE.Mesh(staffGeometry, staffMaterial);
            staff.position.y = 20;

            const gemGeometry = new THREE.SphereGeometry(1.5, 16, 16);
            const gemMaterial = new THREE.MeshBasicMaterial({ color: 0x00FFFF, transparent: true, opacity: 0.8 });
            const gem = new THREE.Mesh(gemGeometry, gemMaterial);
            gem.position.y = 40;

            const wandLight = new THREE.PointLight(0x00FFFF, 20, 50);
            wandLight.position.y = 40;
            wandLight.castShadow = true;
            refs.wandGroup.add(staff, gem, wandLight);
            refs.wandGroup.position.x = -planeSize / 2;
            refs.scene.add(refs.wandGroup);

            // Start loop
            animate();

            // Events
            refs.renderer.domElement.addEventListener('click', onCanvasClick);
            window.addEventListener('resize', onWindowResize);
        }

        function onCanvasClick(event) {
            const refs = gameRefs.current;
            const THREE = window.THREE;
            
            if (refs.audioContext && refs.audioContext.state === 'suspended') { 
                refs.audioContext.resume(); 
            }
            
            if (!refs.camera || !refs.musicalPlane) return;

            refs.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
            refs.pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
            
            refs.raycaster.setFromCamera(refs.pointer, refs.camera);
            const intersects = refs.raycaster.intersectObject(refs.musicalPlane);

            if (intersects.length > 0) {
                placeInstrument(intersects[0].point);
            }
        }

        function placeInstrument(position) {
            const refs = gameRefs.current;
            const THREE = window.THREE;
            
            // Read current instrument from DOM classes to avoid state closure issues in this effect
            let currentType = 'synth';
            if (document.getElementById('pluck-btn')?.classList.contains('active')) currentType = 'pluck';
            if (document.getElementById('kick-btn')?.classList.contains('active')) currentType = 'kick';

            const synthGeo = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
            const synthMat = new THREE.MeshStandardMaterial({ color: 0x00BFFF, metalness: 0.9, roughness: 0.2, emissive: 0x005f7f });
            const pluckGeo = new THREE.ConeGeometry(1.5, 2, 4);
            const pluckMat = new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.7, roughness: 0.3, emissive: 0x996515 });
            const kickGeo = new THREE.BoxGeometry(2, 2, 2);
            const kickMat = new THREE.MeshStandardMaterial({ color: 0xDC143C, metalness: 0.4, roughness: 0.8, emissive: 0x8B0000 });

            let newNode;
            switch (currentType) {
                case 'synth': newNode = new THREE.Mesh(synthGeo, synthMat); break;
                case 'pluck': newNode = new THREE.Mesh(pluckGeo, pluckMat); break;
                case 'kick': newNode = new THREE.Mesh(kickGeo, kickMat); break;
            }
            newNode.position.copy(position);
            newNode.position.y += 1;
            newNode.castShadow = true;
            newNode.userData.type = currentType;
            newNode.userData.originalEmissive = newNode.material.emissive.getHex();
            newNode.userData.hasBeenTriggered = false;
            
            refs.scene.add(newNode);
            refs.soundNodes.push(newNode);
        }

        function playSound(buffer) {
            const refs = gameRefs.current;
            if (!buffer || !refs.audioContext) return; 
            const source = refs.audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(refs.audioContext.destination);
            source.start(0);
        }

        function animate() {
            const refs = gameRefs.current;
            const THREE = window.THREE;
            
            refs.frameId = requestAnimationFrame(animate);
            
            if (!refs.clock || !refs.scene || !refs.camera || !refs.renderer) return;

            const elapsedTime = refs.clock.getElapsedTime();
            
            if(refs.controls && typeof refs.controls.update === 'function') {
                refs.controls.update();
            }
            
            if(refs.particlesMesh) refs.particlesMesh.rotation.y = elapsedTime * 0.05;

            // Check play state from DOM to bypass React closure staleness
            const isGamePlaying = document.getElementById('play-stop-btn')?.classList.contains('stop');

            refs.soundNodes.forEach(node => {
                if (node.userData.type === 'synth' || node.userData.type === 'pluck') { node.rotation.y += 0.01; }
                // Flash effect logic
                if (node.material.emissive.getHex() !== node.userData.originalEmissive) { 
                    node.material.emissive.lerp(new THREE.Color(node.userData.originalEmissive), 0.1); 
                }
                if (node.userData.type === 'kick' && node.scale.x > 1) { 
                    node.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1); 
                }
            });

            if (isGamePlaying && refs.wandGroup) {
                const planeSize = 200;
                refs.wandGroup.position.x += 0.5; 
                
                if (refs.wandGroup.position.x > planeSize / 2) {
                    refs.wandGroup.position.x = -planeSize / 2;
                    refs.soundNodes.forEach(node => node.userData.hasBeenTriggered = false);
                }

                refs.soundNodes.forEach(node => {
                    if (!node.userData.hasBeenTriggered && Math.abs(node.position.x - refs.wandGroup.position.x) < 1.0) {
                        node.userData.hasBeenTriggered = true;
                        node.material.emissive.set(0xffffff);
                        if (node.userData.type === 'kick') { node.scale.set(1.2, 1.2, 1.2); }
                        playSound(refs.soundBuffers[node.userData.type]);
                    }
                });
            }

            refs.renderer.render(refs.scene, refs.camera);
        }

        function onWindowResize() {
            const refs = gameRefs.current;
            if(refs.camera && refs.renderer) {
                refs.camera.aspect = window.innerWidth / window.innerHeight;
                refs.camera.updateProjectionMatrix();
                refs.renderer.setSize(window.innerWidth, window.innerHeight);
            }
        }

        return () => {
            const refs = gameRefs.current;
            if (refs.frameId) cancelAnimationFrame(refs.frameId);
            window.removeEventListener('resize', onWindowResize);
            if (refs.renderer && refs.renderer.domElement) {
                refs.renderer.domElement.removeEventListener('click', onCanvasClick);
            }
        };
    }, []);

    const toggleInstrument = (inst) => {
        setActiveInstrument(inst);
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
        // Reset wand if stopping? Optional design choice.
        // Ideally reset wandGroup.position.x here if (!isPlaying), but 
        // we need access to refs.wandGroup which is inside the effect.
        // For now, just pausing the movement is sufficient UX.
    };

    return (
        <div className="w-full h-screen overflow-hidden bg-[#020210] font-sans text-white relative">
            <style jsx>{`
                #control-panel {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    padding: 15px 30px;
                    box-sizing: border-box;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
                    z-index: 10;
                    pointer-events: none;
                }
                #control-panel > * {
                    pointer-events: auto;
                }
                #title-container {
                    text-shadow: 0 0 10px rgba(0, 191, 255, 0.7);
                }
                h1 { margin: 0; font-size: 2em; }
                p { margin: 0; font-size: 0.9em; color: #b0c4de; }
                #button-container { display: flex; align-items: center; gap: 20px; }
                .instrument-btn, #play-stop-btn {
                    padding: 10px 20px;
                    font-size: 1em;
                    font-weight: bold;
                    border: 2px solid #fff;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s ease-in-out;
                    background-color: rgba(20, 20, 40, 0.8);
                    color: #fff;
                }
                .instrument-btn:hover, #play-stop-btn:hover { transform: translateY(-2px); }
                #synth-btn { border-color: #00BFFF; }
                #pluck-btn { border-color: #FFA500; }
                #kick-btn  { border-color: #DC143C; }
                
                .instrument-btn.active { color: #000; }
                #synth-btn.active { background-color: #00BFFF; box-shadow: 0 0 15px #00BFFF; }
                #pluck-btn.active { background-color: #FFA500; box-shadow: 0 0 15px #FFA500; }
                #kick-btn.active  { background-color: #DC143C; box-shadow: 0 0 15px #DC143C; }
                
                .play-state { background-color: #2E8B57; border-color: #3CB371; box-shadow: 0 0 15px #3CB371; }
                .stop-state { background-color: #B22222; border-color: #DC143C; box-shadow: 0 0 15px #DC143C; }
            `}</style>

            <div id="control-panel">
                <div id="title-container">
                    <h1>Melody Sculptor</h1>
                    <p>Click to place, Drag to orbit, Scroll to zoom</p>
                </div>
                <div id="button-container">
                    <button 
                        id="synth-btn" 
                        className={`instrument-btn ${activeInstrument === 'synth' ? 'active' : ''}`}
                        onClick={() => toggleInstrument('synth')}
                    >
                        Synth
                    </button>
                    <button 
                        id="pluck-btn" 
                        className={`instrument-btn ${activeInstrument === 'pluck' ? 'active' : ''}`}
                        onClick={() => toggleInstrument('pluck')}
                    >
                        Pluck
                    </button>
                    <button 
                        id="kick-btn" 
                        className={`instrument-btn ${activeInstrument === 'kick' ? 'active' : ''}`}
                        onClick={() => toggleInstrument('kick')}
                    >
                        Kick
                    </button>
                    <button 
                        id="play-stop-btn" 
                        className={isPlaying ? 'stop-state stop' : 'play-state play'} 
                        onClick={togglePlay}
                    >
                        {isPlaying ? 'Stop' : 'Play'}
                    </button>
                </div>
            </div>

            <div ref={containerRef} className="w-full h-full absolute top-0 left-0 z-0" />
        </div>
    );
}