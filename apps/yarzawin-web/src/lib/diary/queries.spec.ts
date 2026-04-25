import { diaryListQueryOptions } from './queries'

describe('diaryListQueryOptions', () => {
  it('returns queryKey ["diary", "list"]', () => {
    const options = diaryListQueryOptions()
    expect(options.queryKey).toEqual(['diary', 'list'])
  })

  it('has a queryFn', () => {
    const options = diaryListQueryOptions()
    expect(typeof options.queryFn).toBe('function')
  })
})
