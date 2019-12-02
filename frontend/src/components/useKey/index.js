import { useState, useEffect } from 'react';

function useKey(key) {
    // Keep track of key state
    const [pressed, setPressed] = useState(false);

    // Check if event matches to a event we're listening to
    const match = event => key.toLowerCase() === event.key.toLowerCase()

    // Handle events
    const onDown = event => {
        if (match(event)) setPressed(true)
    }

    const onUp = event => {
        if (match(event)) setPressed(false)
    }

    // Bind and unbind events
    useEffect(() => {
        window.addEventListener("keydown", onDown)
        window.addEventListener("keyup", onUp)
        return () => {
            window.removeEventListener("keydown", onDown)
            window.removeEventListener("keyup", onUp)
        }
    }, [key])

    return pressed
}

export default useKey;