import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import TWEEN from '@tweenjs/tween.js';
import { Html, Line } from '@react-three/drei';
import useDeviceOrientation from '../hooks/DeviceOrientation';
import { blockedAreaMaterial, PathShaderMaterial, PulsingMaterial, GradientMaterial, BlockedTileMaterial } from './mapScene/materials';
import MapProductLabel from './mapProductLabel';
import { Toaster, toast } from 'sonner';
import ProximityProductPopup from './ProximirtyProductPopup';

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
;
  
// const BlockedArea = ({ blockedCenterX, blockedCenterY, blockedWidth, blockedHeight }: any) => {
//   return(
//   <mesh position={[blockedCenterX, 0.05, blockedCenterY]} material={blockedAreaMaterial}>
//     <boxGeometry args={[blockedWidth, 0.1, blockedHeight]} />
//     <meshBasicMaterial color={0xffffff} />
//   </mesh>)
// };

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
  points.forEach((point: any)=>{
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

  let closeProduct: any = useRef();

  const CAMERA_MODES = {
    TILTED: 'tilted',
    TOP_DOWN: 'topdown'
  };

  const [cameraMode, setCameraMode] = useState(CAMERA_MODES.TILTED);

  const proximityThreshold = tileSize * 2;

  const HandleProductProximity = () => {
    useFrame(() => {
      if (personRef.current && selectedProducts) {
        selectedProducts.forEach((product: any) => {
          const dx = personRef.current.position.x - product.tile.x * tileSize;
          const dy = personRef.current.position.z - product.tile.y * tileSize; // Assuming Z is the up-down axis in your coordinate system
          const distance = Math.sqrt(dx * dx + dy * dy);
  
          if (distance <= proximityThreshold) {
            closeProduct.current = product.product;
          }
        });
      }
    });

    return (<></>);
  }



  const Tile = ({ x, y, type }: any) => {
    const ref: any = useRef();
    const material: any = useRef();  
    // if (false) {
    //   material.current = new PulsingMaterial();
    // } else {
    //   material.current = new GradientMaterial();
    // }

    if(type === 6 || type === 7) return


    let selectedProduct: any = undefined;

    if(selectedProducts) {
      if(selectedProducts.some(p => p.tile.x == x && p.tile.y == y)) {
        selectedProduct = selectedProducts.find((p: any) => p.tile.x == x && p.tile.y == y);
        material.current = new PulsingMaterial();
      }
      else {
        material.current = new GradientMaterial();
      }
    }
    else {
      material.current = new GradientMaterial();
    }

    if(type === 4 )
    {
      material.current = new BlockedTileMaterial();
    }
  
    useFrame(({ clock }) => {
      TWEEN.update();
      if (material.current.uniforms && type != 4) {
        material.current.uniforms.time.value = clock.getElapsedTime();
      }
    });

    let geometry = new THREE.BoxGeometry(tileSize, tileSize, tileSize);;
  
    if(type === 0 || type === 5) {
      geometry = new THREE.BoxGeometry(tileSize, tileSize * 2, tileSize);
    }
    if(type === 4) {
      geometry = new THREE.BoxGeometry(tileSize, tileSize * 0.5, tileSize);
    }
  
    return (
      <mesh ref={ref} position={[x * tileSize, geometry.parameters.height / 2, y * tileSize]} material={material.current} castShadow receiveShadow>
        <primitive object={geometry} attach="geometry" />
        {selectedProduct && (
          <Html center>
            <MapProductLabel text={selectedProduct.product.name}/>
          </Html>
        )}
      </mesh>
    );
  }

  const Floor = () => {
    return (
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[centerX * tileSize, 0, centerY * tileSize]} receiveShadow>
        <planeGeometry attach="geometry" args={[100, 100]} />
        <meshPhongMaterial attach="material" color="#dfe9f5" side={THREE.DoubleSide} />
      </mesh>
    );
  };

  function CameraControls({ personRef, cameraMode}: any) {
    const [_, displacement] = useDeviceOrientation();
    //const lastHeading = useRef(compassHeading);
    const lastTheta = useRef(0); // To store last frame's theta
    const cameraPositionRef = useRef(new THREE.Vector3(0, 10, -13)); // Default position
    const cameraRotationRef = useRef(new THREE.Euler(0, 0, 0)); // Default rotation


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

    const maxPolarAngle = Math.PI / 2 - 0.1;

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
      const offset = new THREE.Vector3(-10, 10, 0); // Offset for the tilted view
      const tiltedPosition = personRef.current.position.clone().add(offset);
      camera.rotateY(90 * (Math.PI / 180))
      camera.position.copy(tiltedPosition);
      camera.lookAt(personRef.current.position);
      camera.up.set(0, 1, 0); // Reset the up vector to default
    };

    useEffect(() => {
      if (personRef.current) {
        personRef.current.position.x -= displacement.x;
        personRef.current.position.z -= displacement.y; // Assuming y displacement affects z-axis in 3D space
        personRef.current
      }
    }, [displacement])

    useEffect(() => {
      //lastTheta.current = THREE.MathUtils.degToRad(compassHeading); // Initialize with the current heading in radians
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

      if (!personRef.current) {
        return;
    }


    // // Convert the compass heading from degrees to radians and normalize it
    // const currentThetaRad = THREE.MathUtils.degToRad(compassHeading) % (2 * Math.PI);
    // let lastThetaRad = lastTheta.current;

    // // Normalize lastTheta to ensure it's always within the same range as currentThetaRad
    // lastThetaRad = lastThetaRad % (2 * Math.PI);

    // // Determine the shortest path difference
    // let deltaTheta = currentThetaRad - lastThetaRad;
    // if (deltaTheta > Math.PI) {
    //     deltaTheta -= 2 * Math.PI; // Rotate counterclockwise
    // } else if (deltaTheta < -Math.PI) {
    //     deltaTheta += 2 * Math.PI; // Rotate clockwise
    // }

    // // Update the spherical coordinates of the camera
    // const offset = new THREE.Vector3().subVectors(camera.position, personRef.current.position);
    // const spherical = new THREE.Spherical().setFromVector3(offset);
    // spherical.theta += deltaTheta; // Apply the calculated delta directly

    // // Set the phi based on camera mode
    // if (cameraMode === 'TILTED') {
    //     spherical.phi = Math.PI / 3;
    // } else if (cameraMode === 'TOP_DOWN') {
    //     spherical.phi = Math.PI / 2;
    // }
    // spherical.radius = 10;

    // // Apply updates to camera position
    // offset.setFromSpherical(spherical);
    // camera.position.copy(personRef.current.position).add(offset);
    // camera.lookAt(personRef.current.position);

    // // Update lastTheta for the next frame
    // lastTheta.current = spherical.theta;
  });
    

    return null;
}


  return (
    <>
      <Canvas camera={{ position: cameraPosition, fov: 90, near: 0.1, far: 1000 }} shadows="soft">
        <CameraControls personRef={personRef} cameraMode={cameraMode}/>
        <color attach="background" args={['#dfe9f5']} />
        <Floor />
        <Path points={path}/>
        <ambientLight intensity={20} color='#eff5fb'/>
        <directionalLight position={[10, 20, 10]} intensity={1} color='#f2f5fa' castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
        <fog attach="fog" args={['#dfe9f5', 0.1, 50]} />

        {tiles.map((tile: any) => {
            return <Tile key={`${tile.x}-${tile.y}`} type={tile.type} x={tile.x} y={tile.y} />;
        
        })}
        <HandleProductProximity/>
        <ProximityProductPopup product={closeProduct} onProductCollect={()=>{alert('hello')}}/>
        {/* <BlockedArea blockedCenterX={blockedCenterX} blockedCenterY={blockedCenterY} blockedWidth={blockedWidth} blockedHeight={blockedHeight} />  */}

        <mesh ref={personRef} position={[0, 0, 6]}>
          <sphereGeometry args={[tileSize / 2, 32, 32]} /> {/* tileSize / 2 is the radius, 32 segments for smoothness both horizontally and vertically */}
          <meshPhongMaterial color={new THREE.Color("grey")} />
        </mesh>
        

      </Canvas>
      <div className="camera-control-buttons-container">
      <button onClick={() => setCameraMode(CAMERA_MODES.TILTED)}>Отстрани</button>
      <button onClick={() => setCameraMode(CAMERA_MODES.TOP_DOWN)}>Отгоре</button>
      </div>
      <Toaster richColors />
    </>
  )
};

export default Map;