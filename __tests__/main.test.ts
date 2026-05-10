/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import { vi } from 'vitest'
import { type TweetV2PostTweetResult } from 'twitter-api-v2'

vi.mock('@actions/core')
vi.mock('../src/x.js')

const core = await import('@actions/core')
const XAPI = await import('../src/x.js')
const main = await import('../src/main.js')

describe('action', () => {
  const xMock = vi.fn(
    async (message: string) =>
      ({ data: { id: '123', text: message } }) as TweetV2PostTweetResult
  )

  beforeEach(() => {
    vi.clearAllMocks()

    vi.mocked(core.getInput).mockReturnValue('')
    vi.mocked(XAPI.X).mockReturnValue(xMock)
  })

  it('sets the time output', async () => {
    vi.mocked(core.getInput).mockImplementation(message => {
      switch (message) {
        case 'message':
          return 'whoa!!'
        default:
          return ''
      }
    })

    await main.run()

    expect(XAPI.X).toHaveBeenCalledWith({
      accessSecret: '',
      accessToken: '',
      appKey: '',
      appSecret: ''
    })

    expect(core.error).not.toHaveBeenCalled()
  })

  it('passes thread options when thread-message is provided', async () => {
    vi.mocked(core.getInput).mockImplementation(name => {
      switch (name) {
        case 'message':
          return 'main tweet'
        case 'media':
          return 'https://example.com/main.png'
        case 'thread-message':
          return 'reply tweet'
        case 'thread-media':
          return 'https://example.com/reply.png'
        default:
          return ''
      }
    })

    await main.run()

    expect(xMock).toHaveBeenCalledWith(
      'main tweet',
      'https://example.com/main.png',
      {
        message: 'reply tweet',
        mediaUrl: 'https://example.com/reply.png'
      }
    )
    expect(core.error).not.toHaveBeenCalled()
  })

  it('omits thread options when thread-message is empty', async () => {
    vi.mocked(core.getInput).mockImplementation(name =>
      name === 'message' ? 'main tweet' : ''
    )

    await main.run()

    expect(xMock).toHaveBeenCalledWith('main tweet', '', undefined)
  })
})
