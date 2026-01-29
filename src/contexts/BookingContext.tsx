"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface CartItem {
    id: string;
    type: 'photographer' | 'videographer' | 'equipment' | 'transport';
    name: string;
    image?: string;
    grade?: string;
    price: number;
    priceUnit: 'hour' | 'day';
    quantity: number;
    duration: number;
}

export interface BookingFilters {
    location: string;
    date: string;
    grade: string;
    priceMin: number;
    priceMax: number;
    category: string;
    search: string;
}

interface BookingContextType {
    // Cart
    cart: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity' | 'duration'>) => void;
    removeFromCart: (id: string, type: string) => void;
    updateQuantity: (id: string, type: string, quantity: number) => void;
    updateDuration: (id: string, type: string, duration: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getCartCount: () => number;

    // Filters
    filters: BookingFilters;
    setFilters: (filters: Partial<BookingFilters>) => void;
    resetFilters: () => void;
}

const defaultFilters: BookingFilters = {
    location: '',
    date: '',
    grade: '',
    priceMin: 0,
    priceMax: 0,
    category: '',
    search: '',
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [filters, setFiltersState] = useState<BookingFilters>(defaultFilters);
    const [isHydrated, setIsHydrated] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('hrp-cart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error('Error loading cart:', e);
            }
        }
        setIsHydrated(true);
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (isHydrated) {
            localStorage.setItem('hrp-cart', JSON.stringify(cart));
        }
    }, [cart, isHydrated]);

    const addToCart = (item: Omit<CartItem, 'quantity' | 'duration'>) => {
        setCart((prev) => {
            const existingIndex = prev.findIndex(
                (i) => i.id === item.id && i.type === item.type
            );

            if (existingIndex >= 0) {
                // Item exists, increase quantity
                const updated = [...prev];
                updated[existingIndex].quantity += 1;
                return updated;
            }

            // New item
            return [...prev, { ...item, quantity: 1, duration: 1 }];
        });
    };

    const removeFromCart = (id: string, type: string) => {
        setCart((prev) => prev.filter((item) => !(item.id === id && item.type === type)));
    };

    const updateQuantity = (id: string, type: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(id, type);
            return;
        }

        setCart((prev) =>
            prev.map((item) =>
                item.id === id && item.type === type
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const updateDuration = (id: string, type: string, duration: number) => {
        if (duration < 1) return;

        setCart((prev) =>
            prev.map((item) =>
                item.id === id && item.type === type
                    ? { ...item, duration }
                    : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => {
            return total + (item.price * item.quantity * item.duration);
        }, 0);
    };

    const getCartCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    };

    const setFilters = (newFilters: Partial<BookingFilters>) => {
        setFiltersState((prev) => ({ ...prev, ...newFilters }));
    };

    const resetFilters = () => {
        setFiltersState(defaultFilters);
    };

    return (
        <BookingContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                updateQuantity,
                updateDuration,
                clearCart,
                getCartTotal,
                getCartCount,
                filters,
                setFilters,
                resetFilters,
            }}
        >
            {children}
        </BookingContext.Provider>
    );
}

export function useBooking() {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error('useBooking must be used within a BookingProvider');
    }
    return context;
}
