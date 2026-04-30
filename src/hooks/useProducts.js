import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useProducts({ category } = {}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(() => {
    let query = supabase
      .from('products')
      .select('*')
      .order('display_order', { ascending: true })

    if (category !== undefined) {
      query = query.contains('categories', [category])
    }

    query.then(({ data, error }) => {
      if (error) setError(error)
      else setProducts(data || [])
      setLoading(false)
    })
  }, [category])

  useEffect(() => {
    fetchData()

    const channel = supabase
      .channel(`products-list-${category || 'all'}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, fetchData)
      .subscribe()

    window.addEventListener('focus', fetchData)

    return () => {
      supabase.removeChannel(channel)
      window.removeEventListener('focus', fetchData)
    }
  }, [fetchData])

  return { products, loading, error }
}

export function useProduct(id) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(() => {
    if (!id) return
    supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error) setError(error)
        else setProduct(data)
        setLoading(false)
      })
  }, [id])

  useEffect(() => {
    if (!id) return

    fetchData()

    const channel = supabase
      .channel(`product-detail-${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, fetchData)
      .subscribe()

    window.addEventListener('focus', fetchData)

    return () => {
      supabase.removeChannel(channel)
      window.removeEventListener('focus', fetchData)
    }
  }, [fetchData, id])

  return { product, loading, error }
}
