import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const DEFAULT = {
  phone: '',
  email: '',
  address: '',
  map_query: '',
  socials: [],
}

export function useSiteSettings() {
  const [settings, setSettings] = useState(DEFAULT)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        if (data) setSettings({ ...DEFAULT, ...data })
        setLoading(false)
      })
  }, [])

  return { settings, loading }
}
