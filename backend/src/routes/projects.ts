import { Router } from 'express'

const router = Router()

// In-memory storage (replace with database in production)
const projects = new Map()

// Get all projects for user
router.get('/', (req, res) => {
  const userId = req.headers['x-user-id'] as string
  const userProjects = Array.from(projects.values()).filter(
    (p: any) => p.userId === userId
  )
  res.json(userProjects)
})

// Create new project
router.post('/', (req, res) => {
  const { name, description } = req.body
  const userId = req.headers['x-user-id'] as string
  
  const project = {
    id: `proj_${Date.now()}`,
    name,
    description: description || '',
    userId,
    createdAt: new Date().toISOString(),
    files: [],
  }
  
  projects.set(project.id, project)
  res.status(201).json(project)
})

// Get project by ID
router.get('/:id', (req, res) => {
  const { id } = req.params
  const project = projects.get(id)
  
  if (!project) {
    return res.status(404).json({ error: 'Project not found' })
  }
  
  res.json(project)
})

// Update project
router.put('/:id', (req, res) => {
  const { id } = req.params
  const { name, description } = req.body
  
  const project = projects.get(id)
  if (!project) {
    return res.status(404).json({ error: 'Project not found' })
  }
  
  project.name = name || project.name
  project.description = description || project.description
  project.updatedAt = new Date().toISOString()
  
  projects.set(id, project)
  res.json(project)
})

// Delete project
router.delete('/:id', (req, res) => {
  const { id } = req.params
  
  if (!projects.has(id)) {
    return res.status(404).json({ error: 'Project not found' })
  }
  
  projects.delete(id)
  res.status(204).send()
})

export default router