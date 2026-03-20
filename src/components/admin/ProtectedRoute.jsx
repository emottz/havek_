import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setSession(session)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  if (session === undefined) return <div style={{ padding: '4rem', textAlign: 'center' }}>Yükleniyor...</div>
  if (!session) return <Navigate to="/admin" replace />
  return children
}

export default ProtectedRoute
