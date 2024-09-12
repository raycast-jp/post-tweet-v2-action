import * as core from '@actions/core'
import { X } from './x'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const x = X({
      appKey: core.getInput('appKey'),
      appSecret: core.getInput('appSecret'),
      accessToken: core.getInput('accessToken'),
      accessSecret: core.getInput('accessSecret')
    })
    const result = await x(core.getInput('message'))
    core.setOutput('tweetID', result.data.id)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
