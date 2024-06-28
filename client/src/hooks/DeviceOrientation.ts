import { useState, useEffect, useRef } from 'react';

const useDeviceOrientation = () => {
    const [compassHeading, setCompassHeading] = useState(0);
    const [displacement, setDisplacement] = useState({x: 0, y: 0})
    const lastHeading = useRef(0); // Store the last heading to compare against
    const prevDistance = useRef({x: 0, y: 0});

    useEffect(() => {
        const handleOrientation = (event: DeviceOrientationEvent) => {
            const { alpha } = event; // alpha represents the compass heading
            if (alpha !== null) {
                const difference = Math.abs(lastHeading.current - alpha);
                // Only update the heading if the change exceeds a certain degree, e.g., 5 degrees
                if (difference > 5) {
                    setCompassHeading(alpha);
                    lastHeading.current = alpha; // Update the last heading
                }
            }
        };

        const handleMotion = (event: DeviceMotionEvent) => {
            const acceleration = event.acceleration;
            const dt = event.interval / 1000; // Convert interval to seconds

            if (acceleration && acceleration.x != null && acceleration.y != null) {
                // Assuming the device is held in portrait mode
                const distX = 0.5 * acceleration.y * dt * dt * 3000; // Compute displacement on x-axis (forward/backward motion)
                const distY = 0.5 * acceleration.x * dt * dt * 3000; // Compute displacement on y-axis (left/right motion)

                // Check if significant movement has occurred
                if (Math.abs(distX - prevDistance.current.x) > 0.5 || Math.abs(distY - prevDistance.current.y) > 0.5) {
                    // Calculate new position based on compass heading
                    const radian = Math.PI / 180 * compassHeading;
                    const newX = distX * Math.cos(radian) - distY * Math.sin(radian);
                    const newY = distX * Math.sin(radian) + distY * Math.cos(radian);

                    setDisplacement({x: newX, y: newY});
                    prevDistance.current = {x: distX, y: distY};
                }
            }
        };

        window.addEventListener('deviceorientation', handleOrientation);
        window.addEventListener('devicemotion', handleMotion);
        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
            window.removeEventListener('devicemotion', handleMotion);
        };
    }, []);

    return [compassHeading, displacement] as const;
};

export default useDeviceOrientation;
