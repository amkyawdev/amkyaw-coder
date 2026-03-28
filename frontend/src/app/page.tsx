'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from './FirebaseProvider'
import { Code2, Zap, Shield, Users, LogOut, Loader2 } from 'lucide-react'

export default function Home() {
  const { user, loading, signOut } = useAuth()
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    setSigningOut(true)
    await signOut()
    setSigningOut(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Code2 className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold">AmkyawDev Coder AI</span>
            </div>
            <nav className="flex items-center gap-6">
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              ) : user ? (
                <>
                  <Link href="/dashboard" className="text-sm font-medium hover:text-blue-600">
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    {signingOut ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="h-4 w-4" />
                    )}
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="text-sm font-medium hover:text-blue-600">
                    Login
                  </Link>
                  <Link 
                    href="/auth/signup" 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AI-Powered Coding Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Build faster with AI. Integrated with OpenHands for intelligent code assistance, 
            code review, and automated development workflows.
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/auth/signup"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700"
            >
              Start Building Free
            </Link>
            <Link 
              href="/dashboard"
              className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg text-lg font-medium hover:bg-gray-50"
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border bg-white shadow-sm">
              <Zap className="h-12 w-12 text-yellow-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI Code Assistant</h3>
              <p className="text-gray-600">
                Get intelligent code suggestions, bug fixes, and refactoring help powered by AI.
              </p>
            </div>
            <div className="p-6 rounded-xl border bg-white shadow-sm">
              <Shield className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Code Review</h3>
              <p className="text-gray-600">
                Automated code review with best practices and security recommendations.
              </p>
            </div>
            <div className="p-6 rounded-xl border bg-white shadow-sm">
              <Users className="h-12 w-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
              <p className="text-gray-600">
                Work together with AI agents on complex coding tasks in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t bg-white">
        <div className="max-w-7xl mx-auto text-center text-gray-600">
          <p>© 2024 AmkyawDev Coder AI. Built with OpenHands.</p>
        </div>
      </footer>
    </div>
  )
}