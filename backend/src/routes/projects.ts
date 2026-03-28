import { Router } from 'express'
import { Project } from '../models/Project'

const router = Router()

// Get all projects for user
router.get('/', async (req, res, next) => {
  try {
    const userId = req.headers['x-user-id'] as string
    
    if (!userId) {
      const projects = await Project.find().sort({ updatedAt: -1 })
      return res.json(projects)
    }
    
    const projects = await Project.find({ userId }).sort({ updatedAt: -1 })
    res.json(projects)
  } catch (error) {
    next(error)
  }
})

// Create new project
router.post('/', async (req, res, next) => {
  try {
    const { name, description, githubRepo } = req.body
    const userId = req.headers['x-user-id'] as string
    
    const project = new Project({
      userId: userId || 'default',
      name,
      description: description || '',
      githubRepo: githubRepo || '',
      files: [],
    })
    
    await project.save()
    res.status(201).json(project)
  } catch (error) {
    next(error)
  }
})

// Get project by ID
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    
    const project = await Project.findById(id)
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }
    
    res.json(project)
  } catch (error) {
    next(error)
  }
})

// Update project
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, description, files, githubRepo } = req.body
    
    const project = await Project.findByIdAndUpdate(
      id,
      { 
        name, 
        description, 
        files, 
        githubRepo,
        updatedAt: new Date() 
      },
      { new: true }
    )
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }
    
    res.json(project)
  } catch (error) {
    next(error)
  }
})

// Delete project
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    
    const project = await Project.findByIdAndDelete(id)
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }
    
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default router