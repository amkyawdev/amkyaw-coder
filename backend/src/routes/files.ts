import { Router } from 'express'
import { Project } from '../models/Project'

const router = Router()

// Get all files in a project
router.get('/project/:projectId', async (req, res, next) => {
  try {
    const { projectId } = req.params
    
    const project = await Project.findById(projectId)
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }
    
    res.json(project.files || [])
  } catch (error) {
    next(error)
  }
})

// Create new file in a project
router.post('/', async (req, res, next) => {
  try {
    const { projectId, name, path, content, type } = req.body
    
    const project = await Project.findById(projectId)
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }
    
    const newFile = {
      name,
      path: path || name,
      content: content || '',
      type: type || 'file',
    }
    
    project.files.push(newFile)
    await project.save()
    
    res.status(201).json(newFile)
  } catch (error) {
    next(error)
  }
})

// Update file
router.put('/:id', async (req, res, next) => {
  try {
    const { projectId } = req.query as { projectId: string }
    const { content, name } = req.body
    
    const project = await Project.findOneAndUpdate(
      { _id: projectId, 'files._id': req.params.id },
      {
        $set: {
          'files.$.content': content,
          'files.$.name': name,
        },
      },
      { new: true }
    )
    
    if (!project) {
      return res.status(404).json({ error: 'File not found' })
    }
    
    const file = (project.files as any).find((f: any) => f._id.toString() === req.params.id)
    res.json(file)
  } catch (error) {
    next(error)
  }
})

// Delete file
router.delete('/:id', async (req, res, next) => {
  try {
    const { projectId } = req.query as { projectId: string }
    
    const project = await Project.findOneAndUpdate(
      { _id: projectId },
      { $pull: { files: { _id: req.params.id } } },
      { new: true }
    )
    
    if (!project) {
      return res.status(404).json({ error: 'File not found' })
    }
    
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default router