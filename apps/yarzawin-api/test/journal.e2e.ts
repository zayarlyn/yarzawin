import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { appModuleMetadata } from '../src/app.module'

describe('Journal (e2e)', () => {
  let app: INestApplication
  let id: string

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule(appModuleMetadata).compile()
    app = moduleRef.createNestApplication()
    app.setGlobalPrefix('/api')
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('POST /api/journals — creates a journal', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/journals')
      .send({ title: 'title ' + Date.now(), content: 'content ' + Date.now() })
    id = res.body.id
    expect(res.body.id).toBeDefined()
  })

  it('PUT /api/journals/:id — updates the journal', async () => {
    const updatedFields = { id, title: 'Updated title', content: 'Updated content' }
    const res = await request(app.getHttpServer()).put(`/api/journals/${id}`).send(updatedFields)

    expect(res.body).toMatchObject(updatedFields)
  })

  it('DELETE /api/journals/:id — deletes the journal', async () => {
    const res = await request(app.getHttpServer()).delete(`/api/journals/${id}`).send({ id })
    expect(res.body).toMatchObject({ id })
  })
})
