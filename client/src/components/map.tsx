import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
// import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import TWEEN from '@tweenjs/tween.js';
// import tiles from './../assets/placement.json'
import { shaderMaterial } from '@react-three/drei';

// extend({ CSS2DRenderer, CSS2DObject });

const calcDimensions = (tiles: Array<any>) => {
  let minX: number = Infinity, minY: number = Infinity, maxX: number = -Infinity, maxY: number = -Infinity;
  let blockedMinX: number = Infinity, blockedMinY: number = Infinity, blockedMaxX: number = -Infinity, blockedMaxY: number = -Infinity;

  tiles.forEach((tile) => {
    if (tile.x < minX) minX = tile.x;
    if (tile.y < minY) minY = tile.y;
    if (tile.x > maxX) maxX = tile.x;
    if (tile.y > maxY) maxY = tile.y;

    if (tile.type === 4) {
      if (tile.x < blockedMinX) blockedMinX = tile.x;
      if (tile.y < blockedMinY) blockedMinY = tile.y;
      if (tile.x > blockedMaxX) blockedMaxX = tile.x;
      if (tile.y > blockedMaxY) blockedMaxY = tile.y;
    }
  });

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const mapWidth = (maxX - minX + 1) * 0.2;
  const mapHeight = (maxY - minY + 1) * 0.2;

  return {
    centerX,
    centerY,
    mapWidth,
    mapHeight,
    blockedWidth: (blockedMaxX - blockedMinX + 1) * 0.2,
    blockedHeight: (blockedMaxY - blockedMinY + 1) * 0.2,
    blockedCenterX: (blockedMinX + blockedMaxX) / 2 * 0.2,
    blockedCenterY: (blockedMinY + blockedMaxY) / 2 * 0.2
  };
};

const GradientMaterial = shaderMaterial(
  {
    color1: new THREE.Color('#bad2e9'),
    color2: new THREE.Color('#f3f8fc'),
    time: 0
  },
  `
    varying vec3 vPosition;
    void main() {
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `
  ,
  `
    uniform vec3 color1;
    uniform vec3 color2;
    varying vec3 vPosition;
    void main() {
      float height = (vPosition.y + 0.25) / 0.5;
      vec3 color = mix(color1, color2, height);
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

const PulsingMaterial = shaderMaterial(
  {
    baseColor: new THREE.Color('#bad2e9'),
    pulseColor: new THREE.Color('#0e0eff'),
    time: 0
  },
  `
    varying vec3 vPosition;
    void main() {
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`
  ,
    `
    uniform vec3 baseColor;
    uniform vec3 pulseColor;
    uniform float time;
    varying vec3 vPosition;
    void main() {
      float height = (vPosition.y + 0.25) / 0.5;
      vec3 color = mix(baseColor, pulseColor, abs(sin(time * 3.0)) * height);
      gl_FragColor = vec4(color, 1.0);
    }
  `
);
  
const BlockedArea = ({ blockedCenterX, blockedCenterY, blockedWidth, blockedHeight }: any) => {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color('#3b4d6b') },
      opacity: { value: 0.5 }
    },
    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    fragmentShader: `
    uniform vec3 color;
    uniform float opacity;
    void main() {
      gl_FragColor = vec4(color, opacity);
    }
    `,
    transparent: true
  });

  return(
  <mesh position={[blockedCenterX, 0.05, blockedCenterY]} material={material}>
    <boxGeometry args={[blockedWidth, 0.1, blockedHeight]} />
    {/* <meshBasicMaterial color={0xffffff} /> */}
  </mesh>)
};

function Map ({tiles, selectedProducts}: {tiles: Array<any>, selectedProducts: Array<any>}) {
  const { centerX, centerY, mapWidth, mapHeight, blockedWidth, blockedHeight, blockedCenterX, blockedCenterY } = calcDimensions(tiles);
  const initialDistance = Math.max(mapWidth, mapHeight) / 2 / Math.tan(THREE.MathUtils.degToRad(20));
  
  const personRef: any = useRef();
  const controlsRef: any = useRef();

  const CAMERA_MODES = {
    TILTED: 'tilted',
    TOP_DOWN: 'topdown'
  };

  const [cameraMode, setCameraMode] = useState(CAMERA_MODES.TILTED);

  const ProductTile = ({ id, x, y, type }: any) => {
    const ref: any = useRef();
    const material: any = useRef();
  
    // if (false) {
    //   material.current = new PulsingMaterial();
    // } else {
    //   material.current = new GradientMaterial();
    // }

    useFrame(() => {
        TWEEN.update();
        updateCamera();
      });

    if(selectedProducts) {
      if(selectedProducts.some(p => p.x == x && p.y == y)) {
        material.current = new PulsingMaterial();
      }
      else {
        material.current = new GradientMaterial();
      }
    }
    else {
      material.current = new GradientMaterial();
    }

  
    useFrame(({ clock }) => {
      if (material.current.uniforms) {
        material.current.uniforms.time.value = clock.getElapsedTime();
      }
    });
  
    const geometry = type === 0 || type === 5 ? new THREE.BoxGeometry(0.2, 0.5, 0.2) : new THREE.BoxGeometry(0.2, 0.2, 0.2);
  
    return (
      <mesh ref={ref} position={[x * 0.2, geometry.parameters.height / 2, y * 0.2]} material={material.current} castShadow receiveShadow>
        <primitive object={geometry} attach="geometry" />
        {/* {isSelected && (
          <CSS2DObject>
            <div className="label" style={{ marginTop: '-1em' }}>
              {name}
            </div>
          </CSS2DObject>
        )} */}
      </mesh>
    );
  };

  const updateCamera = () => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      const offset = new THREE.Vector3(-6, 6, 0);
      const targetPosition = personRef.current.position.clone().add(offset);
      camera.position.lerp(targetPosition, 0.1);
      camera.lookAt(personRef.current.position);
    }
  };

  const Floor = () => {
    return (
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[centerX * 0.2, 0, centerY * 0.2]} receiveShadow>
        <planeGeometry attach="geometry" args={[100, 100]} />
        <meshPhongMaterial attach="material" color="#dfe9f5" side={THREE.DoubleSide} />
      </mesh>
    );
  };

  function CameraControls({ personRef, cameraMode}: any) {
    const { camera, gl: { domElement } } = useThree();
    const touchStart = useRef({ x: 0, y: 0 });
    const mouseStart = useRef({ x: 0, y: 0 });
    const touchStartDistance = useRef(0);
    const touchStartAngle = useRef(0);
    const panStart = useRef({ x: 0, y: 0 });
    const isDragging = useRef(false);
    const isZooming = useRef(false);

    // Damping factors
    const zoomDamping = 0.35;
    const rotateDamping = 0.1;
    const [zoomVelocity, setZoomVelocity] = useState(1);
    const [rotationVelocity, setRotationVelocity] = useState({ theta: 0, phi: 0 });

    const rotationSensitivity = 0.005;  // Adjust this value to reduce sensitivity
    const zoomSensitivity = 0.02;     

    const initialPositionSet = useRef(false);

    const maxPolarAngle = Math.PI / 2 - 0.1;

    const setInitialCameraPosition = () => {
      const offset = new THREE.Vector3(0, 2, -5); // Adjust as needed for your scene
      camera.position.copy(personRef.current.position.clone().add(offset));
      camera.lookAt(personRef.current.position);
      initialPositionSet.current = true;
    };

    const setTopDownView = () => {
      const topDownPosition = new THREE.Vector3(
        personRef.current.position.x,
        10, // height from the top to adequately cover the area
        personRef.current.position.z
      );
      camera.position.copy(topDownPosition); // Use copy instead of lerp for immediate placement
      camera.lookAt(new THREE.Vector3(personRef.current.position.x, personRef.current.position.y, personRef.current.position.z)); // Ensure the camera is looking straight down
      camera.up.set(0, 0, -1); // Correct the camera's up vector to ensure correct orientation
    };
  
    // This function adjusts camera position for tilted view
    const setTiltedView = () => {
      const offset = new THREE.Vector3(0, 2, -5); // Offset for the tilted view
      const tiltedPosition = personRef.current.position.clone().add(offset);
      camera.position.copy(tiltedPosition);
      camera.lookAt(personRef.current.position);
      camera.up.set(0, 1, 0); // Reset the up vector to default
    };

    useEffect(() => {
      if (personRef.current && !initialPositionSet.current) {
        setInitialCameraPosition();
      }
    }, [personRef.current]); 

    useEffect(()=>{
      if (cameraMode == CAMERA_MODES.TOP_DOWN) {
        setTopDownView();
      } else {
        setTiltedView();
      }
      return () => {
        camera.up.set(0, 1, 0); // Reset to default to avoid affecting other components or scenes
      };
    }, [cameraMode])

    const handleMouseDown = (event: any) => {
      if (event.button === 0) { // Left button for rotation
        isDragging.current = true;
        mouseStart.current = { x: event.clientX, y: event.clientY };
      }
    };

    const handleMouseMove = (event: any) => {
      if (isDragging.current) {
        const deltaX = -(event.clientX - mouseStart.current.x) * rotationSensitivity; // Inverted the sign here
        const deltaY = -(event.clientY - mouseStart.current.y) * rotationSensitivity;
        setRotationVelocity({ theta: deltaX, phi: deltaY });
        mouseStart.current = { x: event.clientX, y: event.clientY };
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleWheel = (event: any) => {
      event.preventDefault();
      const delta = -event.deltaY * 0.005; // Normalize wheel to +1 or -1
      const zoomFactor = Math.exp(delta * zoomSensitivity * 50);
      setZoomVelocity(zoomFactor);
    };

    const getTouchDistance = (event: any) => {
      const dx = event.touches[0].clientX - event.touches[1].clientX;
      const dy = event.touches[0].clientY - event.touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const handleTouchStart = (event: any) => {
      if (event.touches.length === 1) {
          if (cameraMode === CAMERA_MODES.TOP_DOWN  ) {
              panStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
          } else {
              touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
          }
      } else if (event.touches.length === 2) {
          const dx = event.touches[0].clientX - event.touches[1].clientX;
          const dy = event.touches[0].clientY - event.touches[1].clientY;
          touchStartDistance.current = Math.sqrt(dx * dx + dy * dy);
          touchStartAngle.current = Math.atan2(dy, dx);
          isZooming.current = true;
          touchStart.current = {
              x: (event.touches[0].clientX + event.touches[1].clientX) / 2,
              y: (event.touches[0].clientY + event.touches[1].clientY) / 2
          };
      }
    };


    const handleTouchMove = (event: any) => {
      event.preventDefault();
      if (cameraMode === CAMERA_MODES.TOP_DOWN) {
          if (event.touches.length === 1 && !isZooming.current) {
              const dx = event.touches[0].clientX - panStart.current.x;
              const dy = event.touches[0].clientY - panStart.current.y;

              // Adjust panning according to camera's current rotation around the Y-axis
              const angle = camera.rotation.z;
              const cosAngle = Math.cos(angle);
              const sinAngle = Math.sin(angle);
              const worldX = dx * cosAngle + dy * sinAngle;
              const worldZ = -dx * sinAngle + dy * cosAngle;

              camera.position.x -= worldX * 0.01;  // Adjust the factor to scale movement sensitivity
              camera.position.z -= worldZ * 0.01;

              panStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
          } else if (event.touches.length === 2 && isZooming.current) {
              const dx = event.touches[0].clientX - event.touches[1].clientX;
              const dy = event.touches[0].clientY - event.touches[1].clientY;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const angle = Math.atan2(dy, dx);

              const zoomFactor = distance / touchStartDistance.current;
              camera.zoom *= zoomFactor;
              camera.updateProjectionMatrix();

              const angleDelta = angle - touchStartAngle.current;
              camera.rotation.z += angleDelta;  // Rotate camera based on two-finger rotation

              touchStartDistance.current = distance;
              touchStartAngle.current = angle;
          }
      } else { // Tilted camera controls
          if (event.touches.length === 1 && !isZooming.current) {
            const deltaX = event.touches[0].clientX - touchStart.current.x;
            const deltaY = event.touches[0].clientY - touchStart.current.y;
            
            const offset = new THREE.Vector3().subVectors(camera.position, personRef.current.position);
            const spherical = new THREE.Spherical().setFromVector3(offset);
            
            // Adjusting rotation around the Y axis
            spherical.theta -= deltaX * 0.005;
            spherical.phi -= deltaY * 0.005;  // Optional: Adjust the vertical angle if needed
            
            spherical.makeSafe();
            offset.setFromSpherical(spherical);
            camera.position.copy(personRef.current.position).add(offset);
            camera.lookAt(personRef.current.position);

            touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
          } else if (event.touches.length === 2) {
              const currentDistance = getTouchDistance(event);
              const zoomFactor = Math.pow(currentDistance / touchStartDistance.current, 0.5);
              camera.zoom *= zoomFactor;
              camera.updateProjectionMatrix();
              touchStartDistance.current = currentDistance;
          }
      }
  };
  

const handleTouchEnd = () => {
  isZooming.current = false; // Reset the zooming flag on finger lift
};

    useEffect(() => {
      domElement.addEventListener('mousedown', handleMouseDown);
      domElement.addEventListener('mousemove', handleMouseMove);
      domElement.addEventListener('mouseup', handleMouseUp);
      domElement.addEventListener('wheel', handleWheel, { passive: false });
      domElement.addEventListener('touchstart', handleTouchStart, { passive: false });
      domElement.addEventListener('touchmove', handleTouchMove, { passive: false });
      domElement.addEventListener('touchend', handleTouchEnd);

      return () => {
        domElement.removeEventListener('mousedown', handleMouseDown);
        domElement.removeEventListener('mousemove', handleMouseMove);
        domElement.removeEventListener('mouseup', handleMouseUp);
        domElement.removeEventListener('wheel', handleWheel);
        domElement.removeEventListener('touchstart', handleTouchStart);
        domElement.removeEventListener('touchmove', handleTouchMove);
        domElement.removeEventListener('touchend', handleTouchEnd);
      };
    }, [domElement]);

    // Apply rotation and zoom based on velocity
    useFrame(({ camera }) => {
      if (Math.abs(rotationVelocity.theta) > 0.0001 || Math.abs(rotationVelocity.phi) > 0.0001) {
          const offset = new THREE.Vector3().subVectors(camera.position, personRef.current.position);
          const spherical = new THREE.Spherical().setFromVector3(offset);
          spherical.theta += rotationVelocity.theta;
  
          // Calculate new phi ensuring it doesn't go below the minimum polar angle
          const newPhi = spherical.phi + rotationVelocity.phi;
          spherical.phi = Math.max(0, Math.min(maxPolarAngle, newPhi)); // Clamping phi within the desired range
  
          spherical.makeSafe();
          offset.setFromSpherical(spherical);
          if(cameraMode === CAMERA_MODES.TILTED) {
            camera.position.copy(personRef.current.position).add(offset);
            camera.lookAt(personRef.current.position);
          }
  
          // Apply damping to rotation velocity
          setRotationVelocity(prev => ({
              theta: prev.theta * (1 - rotateDamping),
              phi: prev.phi * (1 - rotateDamping)
          }));
      }

  
      // Handle zoom
      if (Math.abs(zoomVelocity - 1) > 0.001) {
          camera.zoom *= zoomVelocity;
          camera.updateProjectionMatrix();
          setZoomVelocity(prev => prev + (1 - prev) * zoomDamping);
      }
  });
    

    return null;
}

  


  // const movePerson = (dx, dy) => {
  //   const direction = new THREE.Vector3();
  //   controlsRef.current.object.getWorldDirection(direction);
  //   direction.y = 0;
  //   direction.normalize();

  //   const right = new THREE.Vector3();
  //   right.crossVectors(controlsRef.current.object.up, direction).normalize();

  //   const moveDistance = 0.2;
  //   const moveX = right.multiplyScalar(dx * moveDistance);
  //   const moveZ = direction.multiplyScalar(dy * moveDistance);

  //   new TWEEN.Tween(personRef.current.position)
  //     .to({
  //       x: personRef.current.position.x + moveX.x + moveZ.x,
  //       y: personRef.current.position.y,
  //       z: personRef.current.position.z + moveX.z + moveZ.z,
  //     }, 200)
  //     .easing(TWEEN.Easing.Quadratic.Out)
  //     .onUpdate(updateCamera)
  //     .start();
  // };

  return (
    <>
      <Canvas camera={{ position: [centerX * 0.2 - 6, initialDistance / 3, centerY * 0.2] }} shadows="soft">
        <CameraControls personRef={personRef} cameraMode={cameraMode}/>
        <color attach="background" args={['#dfe9f5']} />
        <Floor />
        <ambientLight intensity={20} color='#eff5fb'/>
        <directionalLight position={[10, 20, 10]} intensity={1} color='#f2f5fa' castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
        <fog attach="fog" args={['#dfe9f5', 5, 15]} />

        {tiles.map((tile: any) => {
          if (tile.type !== 4) {
            return <ProductTile key={`${tile.x}-${tile.y}`} type={tile.type} x={tile.x} y={tile.y} />;
          }
          return null;
        })}
        <BlockedArea blockedCenterX={blockedCenterX} blockedCenterY={blockedCenterY} blockedWidth={blockedWidth} blockedHeight={blockedHeight} />

        <mesh ref={personRef} position={[centerX * 0.2, 0.25, centerY * 0.2]}>
          <boxGeometry args={[0.2, 0.5, 0.2]} />
          <meshBasicMaterial color={0xffffff} />
        </mesh>
        

      </Canvas>
      <button onClick={() => setCameraMode(CAMERA_MODES.TILTED)}>Tilted View</button>
      <button onClick={() => setCameraMode(CAMERA_MODES.TOP_DOWN)}>Top Down View</button>
      <button id="resetButton">Reset View</button>
    </>
  )
};

export default Map;