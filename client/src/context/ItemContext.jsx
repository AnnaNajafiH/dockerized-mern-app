import React, { createContext, useContext, useReducer, useEffect } from 'react';
import * as api from '../services/api';

// Create context
const ItemContext = createContext();

// Initial state
const initialState = {
  items: [],
  loading: false,
  error: null
};

// Reducer function
const itemReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_ITEMS_REQUEST':
      return { ...state, loading: true, error: null };
    case 'FETCH_ITEMS_SUCCESS':
      return { ...state, items: action.payload, loading: false };
    case 'FETCH_ITEMS_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item => 
          item._id === action.payload._id ? action.payload : item
        )
      };
    case 'DELETE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload)
      };
    default:
      return state;
  }
};

// Provider component
export const ItemProvider = ({ children }) => {
  const [state, dispatch] = useReducer(itemReducer, initialState);

  // Fetch items on initial load
  useEffect(() => {
    fetchItems();
  }, []);

  // Fetch all items
  const fetchItems = async () => {
    dispatch({ type: 'FETCH_ITEMS_REQUEST' });
    try {
      const res = await api.getItems();
      dispatch({ type: 'FETCH_ITEMS_SUCCESS', payload: res.data });
    } catch (err) {
      dispatch({ 
        type: 'FETCH_ITEMS_ERROR', 
        payload: err.message || 'Failed to fetch items'
      });
    }
  };

  // Add new item
  const addItem = async (item) => {
    try {
      const res = await api.createItem(item);
      dispatch({ type: 'ADD_ITEM', payload: res.data });
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  // Update item
  const updateItem = async (id, item) => {
    try {
      const res = await api.updateItem(id, item);
      dispatch({ type: 'UPDATE_ITEM', payload: res.data });
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  // Delete item
  const deleteItem = async (id) => {
    try {
      await api.deleteItem(id);
      dispatch({ type: 'DELETE_ITEM', payload: id });
    } catch (err) {
      throw err;
    }
  };

  return (
    <ItemContext.Provider
      value={{
        ...state,
        fetchItems,
        addItem,
        updateItem,
        deleteItem
      }}
    >
      {children}
    </ItemContext.Provider>
  );
};

// Custom hook to use the item context
export const useItems = () => useContext(ItemContext);

export default ItemContext;
