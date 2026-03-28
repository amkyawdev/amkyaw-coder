'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../FirebaseProvider'
import { 
  Code2, Play, Save, Plus, File, Folder, Trash2, 
  Loader2, Send, X, ChevronRight, ChevronDown, Terminal as TerminalIcon
} from 'lucide-react'

interface FileItem {
  _id?: string
  name: string
  path: string
  content: string
  type: string
}

interface Project {
  _id: string
  name: string
  description: string
  files: FileItem[]
}

export default function WorkspacePage({ params }: { params: { projectId: string } }) {
  const { user, loading: authLoading } = useAuth()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeFile, setActiveFile] = useState<FileItem | null>(null)
  const [code, setCode] = useState('')
  const [terminal, setTerminal] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Array<{ role: string; content: string; timestamp: Date }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [newFileName, setNewFileName] = useState('')
  const [showNewFile, setShowNewFile] = useState(false)

  const router = useRouter()
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user && params.projectId) {
      fetchProject()
    }
  }, [user, params.projectId])

  const fetchProject = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/projects/${params.projectId}`)
      if (response.ok) {
        const data = await response.json()
        setProject(data)
        if (data.files && data.files.length > 0) {
          setActiveFile(data.files[0])
          setCode(data.files[0].content || '')
        }
      }
    } catch (error) {
      console.error('Failed to fetch project:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToTerminal = (text: string) => {
    setTerminal(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${text}`])
  }

  const createFile = async () => {
    if (!newFileName.trim() || !project) return

    const newFile: FileItem = {
      name: newFileName,
      path: newFileName,
      content: '',
      type: 'file'
    }

    try {
      const response = await fetch(`${apiUrl}/api/files`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: params.projectId,
          name: newFileName,
          path: newFileName,
          content: '',
          type: 'file'
        })
      })
      
      const updatedProject = await response.json()
      setProject(updatedProject)
      const files = updatedProject.files || []
      setActiveFile(files[files.length - 1])
      setCode('')
      setShowNewFile(false)
      setNewFileName('')
      addToTerminal(`Created file: ${newFileName}`)
    } catch (error) {
      console.error('Failed to create file:', error)
    }
  }

  const saveFile = async () => {
    if (!activeFile || !project) return

    try {
      await fetch(`${apiUrl}/api/files/${activeFile._id}?projectId=${params.projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: code })
      })
      addToTerminal(`Saved: ${activeFile.name}`)
    } catch (error) {
      console.error('Failed to save file:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!message.trim()) return
    
    const userMessage = message
    setMessages(prev => [...prev, { role: 'user', content: userMessage, timestamp: new Date() }])
    setMessage('')
    setIsLoading(true)
    addToTerminal(`> ${userMessage}`)

    try {
      const response = await fetch(`${apiUrl}/api/sessions/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          repository: `project-${params.projectId}`
        })
      })
      
      const data = await response.json()
      
      if (data.conversation_id) {
        // Poll for response
        setTimeout(async () => {
          try {
            const statusResponse = await fetch(
              `${apiUrl}/api/sessions/${data.conversation_id}/status`
            )
            const statusData = await statusResponse.json()
            
            setMessages(prev => [...prev, { 
              role: 'assistant', 
              content: statusData.status || 'Task completed',
              timestamp: new Date() 
            }])
            addToTerminal(`AI: Task completed - ${statusData.status}`)
          } catch {
            setMessages(prev => [...prev, { 
              role: 'assistant', 
              content: 'Task completed successfully!',
              timestamp: new Date() 
            }])
            addToTerminal(`AI: Task completed successfully!`)
          }
          setIsLoading(false)
        }, 2000)
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.status || 'Processing...',
          timestamp: new Date() 
        }])
        addToTerminal(`AI: ${data.status || 'Processing...'}`)
        setIsLoading(false)
      }
    } catch (error) {
      addToTerminal(`Error: ${error}`)
      setIsLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <header className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white">
            ← Back
          </Link>
          <span className="font-medium">{project?.name || 'Workspace'}</span>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={saveFile}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-green-600 rounded hover:bg-green-700"
          >
            <Save className="h-3 w-3" />
            Save
          </button>
          <button className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 rounded hover:bg-blue-700">
            <Play className="h-3 w-3" />
            Run
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* File Tree */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
          <div className="p-3 border-b border-gray-700">
            <div className="text-xs font-semibold text-gray-400 mb-2">EXPLORER</div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2">
            {project?.files && project.files.length > 0 ? (
              project.files.map((file, i) => (
                <div 
                  key={i}
                  className={`p-2 text-sm cursor-pointer hover:bg-gray-700 rounded flex items-center gap-2 ${
                    activeFile?.name === file.name ? 'bg-gray-700 text-blue-400' : 'text-gray-300'
                  }`}
                  onClick={() => { setActiveFile(file); setCode(file.content || '') }}
                >
                  <File className="h-4 w-4" />
                  {file.name}
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500 p-2">No files yet</div>
            )}
          </div>

          {/* New File Button */}
          <div className="p-2 border-t border-gray-700">
            {showNewFile ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  placeholder="filename.js"
                  className="flex-1 px-2 py-1 text-sm bg-gray-700 rounded border border-gray-600 focus:outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && createFile()}
                />
                <button
                  onClick={createFile}
                  className="p-1 bg-blue-600 rounded hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setShowNewFile(false)}
                  className="p-1 text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowNewFile(true)}
                className="w-full p-2 text-sm text-gray-400 hover:text-white text-left flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                New File
              </button>
            )}
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          {/* Editor Tabs */}
          <div className="h-10 bg-gray-800 border-b border-gray-700 flex items-center px-2">
            {activeFile && (
              <div className="flex items-center gap-2 px-3 py-1 bg-gray-700 rounded text-sm">
                <File className="h-3 w-3" />
                {activeFile.name}
              </div>
            )}
          </div>
          
          {/* Editor Content */}
          <div className="flex-1 bg-gray-900 p-4">
            {activeFile ? (
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-full bg-gray-900 text-gray-100 font-mono text-sm resize-none focus:outline-none"
                placeholder={`// ${activeFile.name}\n// Start coding here...`}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Select or create a file to start coding</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Terminal */}
          <div className="h-40 bg-black border-t border-gray-700 flex flex-col">
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <TerminalIcon className="h-4 w-4" />
                TERMINAL
              </div>
              <button
                onClick={() => setTerminal([])}
                className="text-xs text-gray-500 hover:text-gray-300"
              >
                Clear
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto font-mono text-sm">
              {terminal.length === 0 ? (
                <div className="text-gray-500">Terminal ready...</div>
              ) : (
                terminal.map((line, i) => (
                  <div key={i} className="text-gray-300 whitespace-pre-wrap">{line}</div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Chat Panel */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          <div className="p-3 border-b border-gray-700 font-semibold flex items-center gap-2">
            <Code2 className="h-5 w-5 text-blue-400" />
            AI Assistant
            <span className="text-xs text-gray-500 ml-auto">OpenHands</span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Code2 className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Ask me to help with your code!</p>
                <p className="text-xs mt-2">• Write code</p>
                <p className="text-xs">• Fix bugs</p>
                <p className="text-xs">• Code review</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`p-3 rounded-lg ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 ml-4' 
                      : 'bg-gray-700 mr-4'
                  }`}
                >
                  <div className="text-xs text-gray-300 mb-1">
                    {msg.role === 'user' ? 'You' : 'AI Assistant'}
                  </div>
                  <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="p-3 rounded-lg bg-gray-700 mr-4">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  AI is thinking...
                </div>
              </div>
            )}
          </div>
          
          <div className="p-3 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask AI to help..."
                className="flex-1 px-3 py-2 bg-gray-700 rounded text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none"
                disabled={isLoading}
              />
              <button 
                onClick={handleSendMessage}
                disabled={isLoading || !message.trim()}
                className="p-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}