import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useProducts({ category } = {}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
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

  return { products, loading, error }
}

export function useProduct(id) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
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

  return { product, loading, error }
}
