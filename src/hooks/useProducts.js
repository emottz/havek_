import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useProducts({ category } = {}) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = () => {
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
    }

    fetchData()

    const channel = supabase
      .channel(`products-list-${category || 'all'}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, fetchData)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [category])

  return { products, loading, error }
}

export function useProduct(id) {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return

    const fetchData = () => {
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
    }

    fetchData()

    const channel = supabase
      .channel(`product-detail-${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products', filter: `id=eq.${id}` }, fetchData)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [id])

  return { product, loading, error }
}
