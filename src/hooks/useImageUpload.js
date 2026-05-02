import { useState } from 'react'
import { supabase } from '../lib/supabase'

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
const ALLOWED_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES]
const MAX_IMAGE_BYTES = 10 * 1024 * 1024   // 10 MB
const MAX_VIDEO_BYTES = 500 * 1024 * 1024  // 500 MB

export function useImageUpload() {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const upload = async (file) => {
    setUploadError('')

    const isVideo = file.type.startsWith('video/')
    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError('Sadece JPEG, PNG, WebP, GIF veya MP4/WebM yüklenebilir.')
      return null
    }
    const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES
    if (file.size > maxBytes) {
      setUploadError(`${isVideo ? 'Video 500MB' : 'Görsel 10MB'}'dan küçük olmalıdır.`)
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
    // URL'den bucket adı ve path çıkar — hem product-images hem products bucket'ını destekler
    const match = url.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/)
    if (!match) return
    const [, bucket, path] = match
    await supabase.storage.from(bucket).remove([path])
  }

  return { upload, remove, uploading, uploadError, setUploadError }
}
