// @ts-nocheck
import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import cookieParser from 'cookie-parser'
import { appModuleMetadata } from 'src/app.module'

describe('Auth (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule(appModuleMetadata).compile()
    app = moduleRef.createNestApplication()
    app.setGlobalPrefix('/api')
    app.use(cookieParser())
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('POST /api/auth/login — returns an access token and sets access_token cookie', async () => {
    const res = await request(app.getHttpServer()).post('/api/auth/login').send({ username: 'test', password: 'password' })

    expect(res.status).toBe(201)
    expect(res.body.accessToken).toBeDefined()
    expect(res.headers['set-cookie']).toBeDefined()
    expect(res.headers['set-cookie'][0]).toMatch(/access_token=/)
    expect(res.headers['set-cookie'][0]).toMatch(/HttpOnly/)
  })

  it('POST /api/auth/login — returns 401 for invalid credentials', async () => {
    const res = await request(app.getHttpServer()).post('/api/auth/login').send({ username: 'test', password: 'wrong' })

    expect(res.status).toBe(401)
  })
})
