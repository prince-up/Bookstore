import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface CartContextType {
    cart: any[];
    addToCart: (book: any) => void;
    removeFromCart: (bookId: string) => void;
    clearCart: () => void;
    total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<any[]>(() => {
        try {
            const saved = localStorage.getItem('cart');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Failed to parse cart from local storage", e);
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (book: any) => {
        setCart((prev) => {
            const existing = prev.find((item) => item._id === book._id);
            if (existing) {
                return prev.map((item) =>
                    item._id === book._id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...book, quantity: 1 }];
        });
    };

    const removeFromCart = (bookId: string) => {
        setCart((prev) => prev.filter((item) => item._id !== bookId));
    };

    const clearCart = () => setCart([]);

    const total = cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, total }}>
            {children}
        </CartContext.Provider>
    );
};
