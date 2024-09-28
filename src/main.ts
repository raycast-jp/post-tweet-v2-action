import * as core from '@actions/core'
import { X } from './x'
import { ApiResponseError } from 'twitter-api-v2'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const x = X({
      appKey: core.getInput('consumer-key'),
      appSecret: core.getInput('consumer-secret'),
      accessToken: core.getInput('access-token'),
      accessSecret: core.getInput('access-token-secret')
    })
    const result = await x(core.getInput('message'))
    core.setOutput('tweetID', result.data.id)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof ApiResponseError) {
      core.setOutput('postFailed', `failed to post tweet: ${error.data.detail}`)
      core.setFailed(error)
    }
    if (error instanceof Error) {
      core.setOutput('postFailed', 'failed to post tweet')
      core.setFailed(error)
    }
  }
}
