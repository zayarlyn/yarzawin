// @ts-nocheck
import request from 'supertest'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { appModuleMetadata } from 'src/app.module'

describe('Auth (e2e)', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule(appModuleMetadata).compile()
    app = moduleRef.createNestApplication()
    app.setGlobalPrefix('/api')
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('POST /api/auth/login — returns an access token', async () => {
    const res = await request(app.getHttpServer()).post('/api/auth/login').send({ username: 'test', password: 'password' })

    expect(res.status).toBe(201)
    expect(res.body.accessToken).toBeDefined()
  })

  it('POST /api/auth/login — returns 401 for invalid credentials', async () => {
    const res = await request(app.getHttpServer()).post('/api/auth/login').send({ username: 'test', password: 'wrong' })

    expect(res.status).toBe(401)
  })
})
