import { useState } from 'react'
import { supabase } from '../lib/supabase'

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE_MB = 10
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

export function useImageUpload() {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const upload = async (file) => {
    setUploadError('')

    // İstemci tarafı doğrulama
    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError('Sadece JPEG, PNG, WebP veya GIF yüklenebilir.')
      return null
    }
    if (file.size > MAX_SIZE_BYTES) {
      setUploadError(`Görsel ${MAX_SIZE_MB}MB'dan küçük olmalıdır.`)
      return null
    }

    // Tahmin edilemez dosya adı: products/timestamp-random.ext
    const ext = file.name.split('.').pop().toLowerCase()
    const safeName = `products/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`

    setUploading(true)
    const { error } = await supabase.storage
      .from('product-images')
      .upload(safeName, file, {
        cacheControl: '31536000', // 1 yıl cache (değişmeyen görseller)
        upsert: false,            // aynı isimle üzerine yazma
        contentType: file.type,
      })

    setUploading(false)

    if (error) {
      setUploadError(`Yükleme hatası: ${error.message}`)
      return null
    }

    // Public URL al
    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(safeName)

    return data.publicUrl
  }

  const remove = async (url) => {
    // URL'den storage path çıkar
    const match = url.match(/product-images\/(.+)$/)
    if (!match) return
    await supabase.storage.from('product-images').remove([match[1]])
  }

  return { upload, remove, uploading, uploadError, setUploadError }
}
