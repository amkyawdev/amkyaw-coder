import { Router } from 'express'

const router = Router()

// In-memory file storage (replace with database/S3 in production)
const files = new Map()

// Get all files in a project
router.get('/project/:projectId', (req, res) => {
  const { projectId } = req.params
  const projectFiles = Array.from(files.values()).filter(
    (f: any) => f.projectId === projectId
  )
  res.json(projectFiles)
})

// Create new file
router.post('/', (req, res) => {
  const { projectId, name, content, type } = req.body
  
  const file = {
    id: `file_${Date.now()}`,
    projectId,
    name,
    content: content || '',
    type: type || 'text',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  
  files.set(file.id, file)
  res.status(201).json(file)
})

// Get file by ID
router.get('/:id', (req, res) => {
  const { id } = req.params
  const file = files.get(id)
  
  if (!file) {
    return res.status(404).json({ error: 'File not found' })
  }
  
  res.json(file)
})

// Update file
router.put('/:id', (req, res) => {
  const { id } = req.params
  const { content, name } = req.body
  
  const file = files.get(id)
  if (!file) {
    return res.status(404).json({ error: 'File not found' })
  }
  
  file.content = content !== undefined ? content : file.content
  file.name = name || file.name
  file.updatedAt = new Date().toISOString()
  
  files.set(id, file)
  res.json(file)
})

// Delete file
router.delete('/:id', (req, res) => {
  const { id } = req.params
  
  if (!files.has(id)) {
    return res.status(404).json({ error: 'File not found' })
  }
  
  files.delete(id)
  res.status(204).send()
})

export default router