'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../app/FirebaseProvider'
import { Code2, Plus, FolderOpen, Trash2, Loader2, LogOut } from 'lucide-react'

interface Project {
  _id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export default function DashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [newProjectName, setNewProjectName] = useState('')
  const [creating, setCreating] = useState(false)

  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      fetchProjects()
    }
  }, [user])

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/projects`)
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error('Failed to fetch projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProjectName.trim()) return

    setCreating(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newProjectName })
      })
      const project = await response.json()
      setProjects([project, ...projects])
      setNewProjectName('')
      router.push(`/workspace/${project._id}`)
    } catch (error) {
      console.error('Failed to create project:', error)
    } finally {
      setCreating(false)
    }
  }

  const deleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/projects/${id}`, {
        method: 'DELETE'
      })
      setProjects(projects.filter(p => p._id !== id))
    } catch (error) {
      console.error('Failed to delete project:', error)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <Code2 className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold">AmkyawDev Coder AI</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Create New Project */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Create New Project</h2>
          <form onSubmit={createProject} className="flex gap-4">
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Project name..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={creating || !newProjectName.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {creating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Create
            </button>
          </form>
        </div>

        {/* Projects List */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Your Projects</h2>
          </div>
          
          {projects.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <FolderOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No projects yet. Create your first project above!</p>
            </div>
          ) : (
            <div className="divide-y">
              {projects.map((project) => (
                <div key={project._id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex-1">
                    <Link 
                      href={`/workspace/${project._id}`}
                      className="text-lg font-medium text-gray-900 hover:text-blue-600"
                    >
                      {project.name}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      {project.description || 'No description'}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Updated: {new Date(project.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Link
                      href={`/workspace/${project._id}`}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Open
                    </Link>
                    <button
                      onClick={() => deleteProject(project._id)}
                      className="p-2 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}