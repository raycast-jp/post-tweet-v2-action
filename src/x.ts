import { TwitterApi } from 'twitter-api-v2'

type Credentials = {
  appKey: string
  appSecret: string
  accessToken: string
  accessSecret: string
}

export const X = (credentials: Credentials) => {
  const api = new TwitterApi(credentials)
  
  return async (message: string, imageUrl?: string) => {
    if (!imageUrl) {
      return api.v2.tweet(message)
    }

    const response = await fetch(imageUrl)
    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const mediaId = await api.v1.uploadMedia(buffer, { mimeType: response.headers.get('content-type') || 'image/jpeg' })

    return api.v2.tweet(message, {
      media: {
        media_ids: [mediaId]
      }
    })
  }
}
