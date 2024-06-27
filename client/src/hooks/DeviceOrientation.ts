import { useState, useEffect, useRef } from 'react';

const useDeviceOrientation = () => {
    const [compassHeading, setCompassHeading] = useState(0);
    const lastHeading = useRef(0); // Store the last heading to compare against

    useEffect(() => {
        const handleOrientation = (event) => {
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

        window.addEventListener('deviceorientation', handleOrientation);
        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, []);

    return compassHeading;
};


export default useDeviceOrientation;
