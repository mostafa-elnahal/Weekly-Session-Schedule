import { useState, useEffect, useRef, useCallback } from 'react';

export function useLocalStorage<T>(
    key: string,
    defaultValue: T,
    debounceMs: number = 500
): [T, (value: T | ((prev: T) => T)) => void] {
    // Initialize state from localStorage or default
    const [value, setValue] = useState<T>(() => {
        try {
            const stored = localStorage.getItem(key);
            return stored ? JSON.parse(stored) : defaultValue;
        } catch {
            return defaultValue;
        }
    });

    // Debounce timer ref
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Save to localStorage with debounce
    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (error) {
                console.error('Failed to save to localStorage:', error);
            }
        }, debounceMs);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [key, value, debounceMs]);

    // Wrapped setter that handles function updates
    const setValueWrapper = useCallback((newValue: T | ((prev: T) => T)) => {
        setValue((prev) => {
            if (typeof newValue === 'function') {
                return (newValue as (prev: T) => T)(prev);
            }
            return newValue;
        });
    }, []);

    return [value, setValueWrapper];
}

// Immediate save for critical operations (like before export)
export function saveToLocalStorageImmediate<T>(key: string, value: T): void {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Failed to save to localStorage:', error);
    }
}
