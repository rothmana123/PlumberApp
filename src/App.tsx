import React, { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Header from './components/Header'
import Auth from './components/Auth'
import PlumbersList from './components/PlumbersList'

function App() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    checkUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
    } catch (error) {
      console.error('Error checking user:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const handleAuthChange = (newUser: any) => {
    setUser(newUser)
  }

  const handleSignOut = () => {
    setUser(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!user ? (
        <Auth onAuthChange={handleAuthChange} />
      ) : (
        <>
          <Header user={user} onSignOut={handleSignOut} />
          <main>
            <PlumbersList user={user} />
          </main>
        </>
      )}
    </div>
  )
}

export default App