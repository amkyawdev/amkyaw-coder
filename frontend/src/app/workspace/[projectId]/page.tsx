'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

export default function WorkspacePage({ params }: { params: { projectId: string } }) {
  const [files, setFiles] = useState<Array<{ name: string; type: string; content?: string }>>([])
  const [activeFile, setActiveFile] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [terminal, setTerminal] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [isLoading, setIsLoading] = useState(false)

  const addToTerminal = (text: string) => {
    setTerminal(prev => [...prev, text])
  }

  const handleSendMessage = async () => {
    if (!message.trim()) return
    
    const userMessage = message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setMessage('')
    setIsLoading(true)
    addToTerminal(`> ${userMessage}`)

    try {
      const response = await fetch('/api/proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          projectId: params.projectId 
        })
      })
      
      const data = await response.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.response || 'Processing...' }])
      addToTerminal(`AI: ${data.response || 'Processing...'}`)
    } catch (error) {
      addToTerminal(`Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <header className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-white">
            ← Back
          </Link>
          <span className="font-medium">Workspace: {params.projectId}</span>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-sm bg-blue-600 rounded hover:bg-blue-700">
            Run
          </button>
          <button className="px-3 py-1 text-sm bg-green-600 rounded hover:bg-green-700">
            Save
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* File Tree */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs font-semibold text-gray-400 mb-2">FILES</div>
            {files.length === 0 ? (
              <div className="text-sm text-gray-500 p-2">No files yet</div>
            ) : (
              files.map((file, i) => (
                <div 
                  key={i}
                  className={`p-2 text-sm cursor-pointer hover:bg-gray-700 ${activeFile === file.name ? 'bg-gray-700' : ''}`}
                  onClick={() => { setActiveFile(file.name); setCode(file.content || '') }}
                >
                  📄 {file.name}
                </div>
              ))
            )}
            <button 
              className="w-full mt-2 p-2 text-sm text-gray-400 hover:text-white text-left"
              onClick={() => setFiles([...files, { name: `file${files.length + 1}.txt`, type: 'file' }])}
            >
              + New File
            </button>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-gray-900 p-4">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-gray-900 text-gray-100 font-mono text-sm resize-none focus:outline-none"
              placeholder="// Write your code here..."
            />
          </div>
          
          {/* Terminal */}
          <div className="h-40 bg-black p-4 overflow-y-auto font-mono text-sm">
            <div className="text-gray-400 mb-2">TERMINAL</div>
            {terminal.map((line, i) => (
              <div key={i} className="text-gray-300">{line}</div>
            ))}
          </div>
        </div>

        {/* Chat Panel */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          <div className="p-3 border-b border-gray-700 font-semibold">
            AI Assistant
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`p-2 rounded ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
                <div className="text-xs text-gray-300 mb-1">{msg.role === 'user' ? 'You' : 'AI'}</div>
                <div className="text-sm">{msg.content}</div>
              </div>
            ))}
            {isLoading && <div className="text-sm text-gray-400">Thinking...</div>}
          </div>
          <div className="p-3 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask AI..."
                className="flex-1 px-3 py-2 bg-gray-700 rounded text-sm focus:outline-none"
                disabled={isLoading}
              />
              <button 
                onClick={handleSendMessage}
                disabled={isLoading}
                className="px-3 py-2 bg-blue-600 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}