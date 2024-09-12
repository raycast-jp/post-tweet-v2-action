import { TwitterApi } from 'twitter-api-v2'

type Credentials = {
  appKey: string
  appSecret: string
  accessToken: string
  accessSecret: string
}
export const X = (credentials: Credentials) => {
  const api = new TwitterApi(credentials)
  return (message: string) => {
    return api.v2.tweet(message)
  }
}
