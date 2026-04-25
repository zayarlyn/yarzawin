// @ts-nocheck
import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { appModuleMetadata } from 'src/app.module'

describe('Diary (e2e)', () => {
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

  it('POST /api/diaries — creates a diary', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/diaries')
      .send({ title: 'title ' + Date.now(), content: 'content ' + Date.now() })
    id = res.body.id
    expect(res.body.id).toBeDefined()
  })

  it('PUT /api/diaries/:id — updates the diary', async () => {
    const updatedFields = { id, title: 'Updated title', content: 'Updated content' }
    const res = await request(app.getHttpServer()).put(`/api/diaries/${id}`).send(updatedFields)

    expect(res.body).toMatchObject(updatedFields)
  })

  it('DELETE /api/diaries/:id — deletes the diary', async () => {
    const res = await request(app.getHttpServer()).delete(`/api/diaries/${id}`).send({ id })
    expect(res.body).toMatchObject({ id })
  })
})
