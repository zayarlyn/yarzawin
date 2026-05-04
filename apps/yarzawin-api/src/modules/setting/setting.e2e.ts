// @ts-nocheck
import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import cookieParser from 'cookie-parser'
import { appModuleMetadata } from 'src/app.module'

describe('Setting (e2e)', () => {
  let app: INestApplication
  let cookie: string[]

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule(appModuleMetadata).compile()
    app = moduleRef.createNestApplication()
    app.setGlobalPrefix('/api')
    app.use(cookieParser())
    await app.init()

    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ username: 'test', password: 'password' })
    cookie = res.headers['set-cookie']
  })

  afterAll(async () => {
    await app.close()
  })

  it('GET /api/settings/:feature — returns an array', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/settings/diary')
      .set('Cookie', cookie)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('POST /api/settings/:feature — saves settings by feature', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/settings/diary')
      .set('Cookie', cookie)
      .send({
        feature: 'diary',
        valueByTypeAndName: { theme: { paper: 'cream' } },
      })

    expect(res.status).toBe(201)
  })

  it('GET /api/settings/:feature — returns settings by feature', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/settings/diary')
      .set('Cookie', cookie)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.some((s: { name: string; value: string }) => s.name === 'paper' && s.value === 'cream')).toBe(true)
  })
})
