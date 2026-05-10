import {
  TwitterApi,
  type TweetV2PostTweetResult,
  type TwitterApiReadWrite
} from 'twitter-api-v2'

type Credentials = {
  appKey: string
  appSecret: string
  accessToken: string
  accessSecret: string
}

type ThreadOptions = {
  message: string
  mediaUrl?: string
}

const uploadMedia = async (
  api: TwitterApiReadWrite,
  mediaUrl: string
): Promise<string> => {
  const response = await fetch(mediaUrl)
  const arrayBuffer = await response.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  return api.v1.uploadMedia(buffer, {
    mimeType: response.headers.get('content-type') || 'application/octet-stream'
  })
}

export const X = (credentials: Credentials) => {
  const api = new TwitterApi(credentials)

  const post = async (
    message: string,
    mediaUrl?: string,
    inReplyToTweetId?: string
  ): Promise<TweetV2PostTweetResult> => {
    const mediaIds = mediaUrl
      ? [await uploadMedia(api.readWrite, mediaUrl)]
      : []
    return api.v2.tweet(message, {
      ...(mediaIds.length > 0 && {
        media: { media_ids: mediaIds as [string] }
      }),
      ...(inReplyToTweetId && {
        reply: { in_reply_to_tweet_id: inReplyToTweetId }
      })
    })
  }

  return async (message: string, mediaUrl?: string, thread?: ThreadOptions) => {
    console.log('mediaUrl', mediaUrl)
    const main = await post(message, mediaUrl)

    if (thread?.message) {
      console.log('thread.mediaUrl', thread.mediaUrl)
      await post(thread.message, thread.mediaUrl, main.data.id)
    }

    return main
  }
}
