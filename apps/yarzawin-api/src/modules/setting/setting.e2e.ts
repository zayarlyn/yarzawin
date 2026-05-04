// @ts-nocheck
import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { appModuleMetadata } from 'src/app.module'

describe('Setting (e2e)', () => {
  let app: INestApplication
  let token: string

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

  it('GET /api/settings/:feature — returns an array', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/settings/diary')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('POST /api/settings/:feature — saves settings by feature', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/settings/diary')
      .set('Authorization', `Bearer ${token}`)
      .send({
        feature: 'diary',
        valueByTypeAndName: { theme: { paper: 'cream' } },
      })

    expect(res.status).toBe(201)
  })

  it('GET /api/settings/:feature — returns settings by feature', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/settings/diary')
      .set('Authorization', `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.some((s: { name: string; value: string }) => s.name === 'paper' && s.value === 'cream')).toBe(true)
  })
})
