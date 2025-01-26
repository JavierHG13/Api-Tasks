/* Este archivo define los controladores para manejar las operaciones CRUD (Crear, Leer, Actualizar y Eliminar) 
 relacionadas con las tareas en la base de datos. Cada controlador está diseñado para interactuar con el modelo 
 de tarea, proporcionando funcionalidades como obtener todas las tareas, crear una nueva, obtener una tarea específica, 
 actualizarla o eliminarla. Estas funciones se utilizan en las rutas correspondientes. */

import Task from '../models/task.model.js'

export const getTasks = async (req,res)=>{
    try {
        const tasks = await Task.find({
            user:req.user.id
        }).populate('user')
        res.json(tasks)
    } catch (error) {
        return res.status(500).json({message:"Hubo un fallo al crear"})
    }
}

export const createTask=async(req,res)=>{
    try {
        const {title,description,date}= req.body

        console.log(req.user)
    
        const newTask= new Task({
            title,
            description,
            date,
            user:req.user.id
        })
    
        const savedTask= await newTask.save()
        res.json(savedTask)
    } catch (error) {
        return res.status(500).json({message:"Hubo un fallo al crear"})
    }
}

export const getTask = async (req,res)=>{
    try {
        const task=await Task.findById(req.params.id).populate('user')
        if(!task) return res.status(404).json({message:'Tarea no encontrada'})
        res.json(task)
    } catch (error) {
        return res.status(404).json({message:"Tarea no encontrada"})
    }
}

export const deleteTask = async(req,res)=>{
    try {
        const task=await Task.findByIdAndDelete(req.params.id)
        if(!task) return res.status(404).json({message:'Tarea no encontrada'})
        return res.send(204)
    } catch (error) {
        return res.status(401).json({message:"Tarea no encontrada"})
    }
}

export const updateTask = async(req,res)=>{
    try {
        const task=await Task.findByIdAndUpdate(req.params.id,req.body,{new:true})
        if(!task) return res.status(404).json({message:'Tarea no encontrada'})
        res.json(task)
    } catch (error) {
        return res.status(404).json({message:"Tarea no encontrada"})
    }
}