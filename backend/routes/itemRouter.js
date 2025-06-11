import express from 'express';
import {
    getItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem
  } from '../controllers/itemControllers.js';
  
// Create a router
const router = express.Router();

router.get('/', getItems);

router.get('/:id', getItemById);

router.post('/', createItem);

router.put('/:id', updateItem);

router.delete('/:id', deleteItem);

export default router;

