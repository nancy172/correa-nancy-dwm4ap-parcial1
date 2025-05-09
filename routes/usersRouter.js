import express from "express";
import {getUsers, getUserById, addUser, deleteUser, updateUser} from "../controllers/userController.js";

const router = express.Router();

// Rutas para usuarios
router.get('/', getUsers)
router.get('/:id', getUserById)
router.post('/', addUser)
router.delete('/:id', deleteUser)
router.put('/:id', updateUser)

export default router;