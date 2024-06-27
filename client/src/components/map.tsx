import { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
// import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import TWEEN from '@tweenjs/tween.js';
import { Line, shaderMaterial } from '@react-three/drei';
import useDeviceOrientation from '../hooks/DeviceOrientation';

const tileSize = 1; // Global tile size variable

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
  const mapWidth = (maxX - minX + 1) * tileSize;
  const mapHeight = (maxY - minY + 1) * tileSize;

  return {
    centerX,
    centerY,
    mapWidth,
    mapHeight,
    blockedWidth: (blockedMaxX - blockedMinX + 1) * tileSize,
    blockedHeight: (blockedMaxY - blockedMinY + 1) * tileSize,
    blockedCenterX: (blockedMinX + blockedMaxX) / 2 * tileSize,
    blockedCenterY: (blockedMinY + blockedMaxY) / 2 * tileSize
  };
};

const GradientMaterial = shaderMaterial(
  {
    color1: new THREE.Color('#bad2e9'),
    color2: new THREE.Color('#f3f8fc'),
    time: 0,
    tileSize: tileSize
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
    uniform float tileSize;
    varying vec3 vPosition;
    void main() {
      float height = (vPosition.y + tileSize);
      vec3 color = mix(color1, color2, height);
      gl_FragColor = vec4(color, 1.0);
    }
  `
);

const PulsingMaterial = shaderMaterial(
  {
    baseColor: new THREE.Color('#bad2e9'),
    pulseColor: new THREE.Color('#0e0eff'),
    time: 0,
    tileSize: tileSize
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
    uniform float tileSize;
    varying vec3 vPosition;
    void main() {
      float height = (vPosition.y + tileSize) / 0.5;
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

const PathShaderMaterial = shaderMaterial(
  { time: 0, color: new THREE.Color(0x0000ff) },
  `precision mediump float;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`,
  `precision mediump float;
  uniform float time;
  uniform vec3 color;
  varying vec2 vUv;

  void main() {
    float stripe = sin(vUv.x * 10.0 + time * 2.0);
    gl_FragColor = mix(vec4(color, 1.0), vec4(0.5, 0.7, 1.0, 1.0), stripe);
  }`
);

// Extend the drei components to use this new material
extend({ PathShaderMaterial });

function Path({ points }: {points: any}) {
  const shaderRef = useRef();
  
  // Update shader uniforms
  useFrame(({ clock }) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.time.value = clock.getElapsedTime();
    }
  });

  if(points == null) return null;


  let vertices: Array<THREE.Vector3> = [];
  points.forEach((point)=>{
    vertices.push(new THREE.Vector3(point[1], 0.1, point[0]))
  })


  return (
    <Line
      points={vertices} // Pass points directly
      color="blue"
      lineWidth={10} // Set the thickness of the line
      material={shaderRef} // Use the custom shader
    />
  );
}


function Map ({tiles, selectedProducts, path}: {tiles: Array<any>, selectedProducts: Array<any>, path: Array<any> | null}) {
  const { centerX, centerY, mapWidth, mapHeight, blockedWidth, blockedHeight, blockedCenterX, blockedCenterY } = calcDimensions(tiles);
  const initialDistance = (Math.max(mapWidth, mapHeight) * 2) / Math.tan(THREE.MathUtils.degToRad(45));
  const cameraPosition: any = [centerX * tileSize, initialDistance, centerY * tileSize];
  
  const personRef: any = useRef();
  const controlsRef: any = useRef();

  const CAMERA_MODES = {
    TILTED: 'tilted',
    TOP_DOWN: 'topdown'
  };

  const [cameraMode, setCameraMode] = useState(CAMERA_MODES.TILTED);

  const ProductTile = ({ x, y, type }: any) => {
    const ref: any = useRef();
    const material: any = useRef();
  
    // if (false) {
    //   material.current = new PulsingMaterial();
    // } else {
    //   material.current = new GradientMaterial();
    // }

    useFrame(() => {
        TWEEN.update();
        // updateCamera();
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
  
    const geometry = new THREE.BoxGeometry(tileSize, (type === 0 || type === 5) ? tileSize * 2 : tileSize, tileSize);
  
    return (
      <mesh ref={ref} position={[x * tileSize, geometry.parameters.height / 2, y * tileSize]} material={material.current} castShadow receiveShadow>
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
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[centerX * tileSize, 0, centerY * tileSize]} receiveShadow>
        <planeGeometry attach="geometry" args={[100, 100]} />
        <meshPhongMaterial attach="material" color="#dfe9f5" side={THREE.DoubleSide} />
      </mesh>
    );
  };

  function CameraControls({ personRef, cameraMode}: any) {
    const compassHeading = useDeviceOrientation();
    const lastHeading = useRef(compassHeading);
    const lastTheta = useRef(0); // To store last frame's theta
    const rotationalVelocity = useRef(0); // Rotational velocity

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
      // Adjust only the Y coordinate for the height, keep X and Z the same
      const topDownPosition = new THREE.Vector3(
          camera.position.x, // Preserve current X
          10, // Height from the top to adequately cover the area
          camera.position.z  // Preserve current Z
      );
      camera.position.copy(topDownPosition);
      camera.lookAt(personRef.current.position);
      camera.up.set(0, 1, 0); // Set up vector to default for proper orientation
  };
  
    // This function adjusts camera position for tilted view
    const setTiltedView = () => {
      // Calculate the new position maintaining the current horizontal angle
      const offset = new THREE.Vector3(0, 10, -13); // Vertical offset for the tilted view
      const direction = new THREE.Vector3().subVectors(camera.position, personRef.current.position).normalize();
      const horizontalDistance = direction.multiplyScalar(13); // Assuming 13 is the distance from the player
  
      const tiltedPosition = new THREE.Vector3(
          personRef.current.position.x + horizontalDistance.x,
          personRef.current.position.y + offset.y, // Set height
          personRef.current.position.z + horizontalDistance.z
      );
  
      camera.position.copy(tiltedPosition);
      camera.lookAt(personRef.current.position);
      camera.up.set(0, 1, 0); // Ensure the up vector is correct
  };

    // useEffect(() => {
    //   if (personRef.current && !initialPositionSet.current) {
    //     setInitialCameraPosition();
    //   }
    // }, [personRef.current]); 

    useEffect(() => {
      lastTheta.current = THREE.MathUtils.degToRad(compassHeading); // Initialize with the current heading in radians
    }, []);

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
      // if (Math.abs(rotationVelocity.theta) > 0.0001 || Math.abs(rotationVelocity.phi) > 0.0001) {
      //     const offset = new THREE.Vector3().subVectors(camera.position, personRef.current.position);
      //     const spherical = new THREE.Spherical().setFromVector3(offset);
      //     spherical.theta += rotationVelocity.theta;
  
      //     // Calculate new phi ensuring it doesn't go below the minimum polar angle
      //     const newPhi = spherical.phi + rotationVelocity.phi;
      //     spherical.phi = Math.max(0, Math.min(maxPolarAngle, newPhi)); // Clamping phi within the desired range
  
      //     spherical.makeSafe();
      //     offset.setFromSpherical(spherical);
      //     if(cameraMode === CAMERA_MODES.TILTED) {
      //       camera.position.copy(personRef.current.position).add(offset);
      //       camera.lookAt(personRef.current.position);
      //     }
  
      //     // Apply damping to rotation velocity
      //     setRotationVelocity(prev => ({
      //         theta: prev.theta * (1 - rotateDamping),
      //         phi: prev.phi * (1 - rotateDamping)
      //     }));
      // }

  
      // // Handle zoom
      // if (Math.abs(zoomVelocity - 1) > 0.001) {
      //     camera.zoom *= zoomVelocity;
      //     camera.updateProjectionMatrix();
      //     setZoomVelocity(prev => prev + (1 - prev) * zoomDamping);
      // }

      if (!personRef.current) {
        return;
    }

    const currentThetaRad = THREE.MathUtils.degToRad(compassHeading) % (2 * Math.PI);
        let lastThetaRad = lastTheta.current;

        // Normalize lastTheta to ensure it's always within the same range as currentThetaRad
        lastThetaRad = lastThetaRad % (2 * Math.PI);

        // Determine the shortest path difference
        let deltaTheta = currentThetaRad - lastThetaRad;
        if (deltaTheta > Math.PI) {
            deltaTheta -= 2 * Math.PI; // Rotate counterclockwise
        } else if (deltaTheta < -Math.PI) {
            deltaTheta += 2 * Math.PI; // Rotate clockwise
        }

        // Update the spherical coordinates of the camera
        const offset = new THREE.Vector3().subVectors(camera.position, personRef.current.position);
        const spherical = new THREE.Spherical().setFromVector3(offset);
        spherical.theta += deltaTheta; // Apply the calculated delta directly

        // Set the phi based on camera mode
        if (cameraMode === 'TILTED') {
            spherical.phi = Math.PI / 3;
        } else if (cameraMode === 'TOP_DOWN') {
            spherical.phi = Math.PI / 2;
        }
        spherical.radius = 10;

        // Apply updates to camera position
        offset.setFromSpherical(spherical);
        camera.position.copy(personRef.current.position).add(offset);
        camera.lookAt(personRef.current.position);

        // Update lastTheta for the next frame
        lastTheta.current = spherical.theta;
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
      <Canvas camera={{ position: cameraPosition, fov: 90, near: 0.1, far: 1000 }} shadows="soft">
        <CameraControls personRef={personRef} cameraMode={cameraMode}/>
        <color attach="background" args={['#dfe9f5']} />
        <Floor />
        <Path points={path}/>
        <ambientLight intensity={20} color='#eff5fb'/>
        <directionalLight position={[10, 20, 10]} intensity={1} color='#f2f5fa' castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
        <fog attach="fog" args={['#dfe9f5', 0.1, 200]} />

        {tiles.map((tile: any) => {
          if (tile.type !== 4) {
            return <ProductTile key={`${tile.x}-${tile.y}`} type={tile.type} x={tile.x} y={tile.y} />;
          }
          return null;
        })}
        {/* <BlockedArea blockedCenterX={blockedCenterX} blockedCenterY={blockedCenterY} blockedWidth={blockedWidth} blockedHeight={blockedHeight} /> */}

        <mesh ref={personRef} position={[centerX * tileSize, 0, centerY * tileSize]}>
          <boxGeometry args={[tileSize, 2, tileSize]} />
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