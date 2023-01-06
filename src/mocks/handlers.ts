import { rest } from 'msw';
import * as localForage from "localforage";
import { faker } from '@faker-js/faker';
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('1234567890abcdef', 16);

const noop = () => void 0;

export const handlers = [
  rest.get('/login', async (req, res, ctx) => {
    await localForage.setItem("authenticated", true)
    return res(
      ctx.status(200)
    )
  }),

  rest.get('/users', async (req, res, ctx) => {
    const isAuthenticated = await localForage.getItem("authenticated");

    if (!isAuthenticated) {
      return res(
        ctx.status(403),
        ctx.json({
          message: "You are not authenticated"
        })
      )
    }

    return res(
      ctx.status(201),
      ctx.json({
        data: Array.from({ length: 10 }, () => ({
          id: nanoid(10),
          name: faker.name.fullName(),
          email: faker.internet.email(),
          isAdmin: faker.helpers.arrayElement([true, false]),
        }))
      })
    )
  }),
]
