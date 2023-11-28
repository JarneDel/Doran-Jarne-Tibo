import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'

describe('AppController (e2e)', () => {
  let app: INestApplication
  let dummyJwtToken = ''

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  describe('vacationRequests', () => {
    it('should return an array of vacation requests', () => {
      return request(app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${dummyJwtToken}`)
        .send({
          query: `
            query {
              vacationRequests {
                id
              }
            }
          `,
        })
        .expect(200)
        .expect(res => {
          expect(res.body.data.vacationRequests).toEqual([
            {
              id: '5f9c1a7c1c9d440000b7d8c0',
            },
            {
              id: '5f9c1a7c1c9d440000b7d8c1',
            },
          ])
        })
    })
  })

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!')
  })

  afterAll(async () => {
    await app.close()
  })
})
