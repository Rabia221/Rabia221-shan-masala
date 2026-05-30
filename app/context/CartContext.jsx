'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const response = await axios.get('/api/cart');
      setCart(response.data.cart);
    } catch (error) {
      console.error('Fetch cart error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await axios.post('/api/cart', { productId, quantity });
      setCart(response.data.cart);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
      console.error('Add to cart error:', error);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const response = await axios.put('/api/cart', { productId, quantity });
      setCart(response.data.cart);
    } catch (error) {
      toast.error('Failed to update cart');
      console.error('Update cart error:', error);
    }
  };

  const removeItem = async (productId) => {
    await updateQuantity(productId, 0);
    toast.success('Removed from cart');
  };

  const clearCart = () => {
    setCart({ items: [] });
  };

  const getCartTotal = () => {
    return cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cart.items.reduce((sum, item) => sum + item.quantity, 0);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
      getCartTotal,
      getCartCount,
      fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}