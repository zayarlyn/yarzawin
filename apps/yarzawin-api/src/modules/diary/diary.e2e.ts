// @ts-nocheck
import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { appModuleMetadata } from 'src/app.module'

describe('Diary (e2e)', () => {
  let app: INestApplication
  let token: string
  let id: string

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule(appModuleMetadata).compile()
    app = moduleRef.createNestApplication()
    app.setGlobalPrefix('/api')
    await app.init()

    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: 'test', password: 'password' })
    token = res.body.accessToken
  })

  afterAll(async () => {
    await app.close()
  })

  it('GET /api/diaries — returns a list of diaries', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/diaries')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('POST /api/diaries — creates a diary', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/diaries')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'title ' + Date.now(), content: 'content ' + Date.now() })
    id = res.body.id
    expect(res.body.id).toBeDefined()
  })

  it('PUT /api/diaries/:id — updates the diary', async () => {
    const updatedFields = { id, title: 'Updated title', content: 'Updated content' }
    const res = await request(app.getHttpServer())
      .put(`/api/diaries/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedFields)

    expect(res.body).toMatchObject(updatedFields)
  })

  it('DELETE /api/diaries/:id — deletes the diary', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/api/diaries/${id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(res.body).toMatchObject({ id })
  })
})
