import { createSimpleRestDataProvider } from '@refinedev/rest/simple-rest'
import { API_URL, TOKEN_KEY } from './constants'

const kyOptions = {
  hooks: {
    beforeRequest: [
      (request: Request) => {
        const token = localStorage.getItem(TOKEN_KEY)
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
    ],
    afterResponse: [
      async (_request: Request, _options: any, response: Response) => {
        if (response.ok) {
          const text = await response.clone().text()

          if (!text) {
            return new Response(JSON.stringify({}), {
              status: 200,
              headers: response.headers,
            })
          }
        }
        return response
      },
    ],
  },
}

export const { dataProvider, kyInstance } = createSimpleRestDataProvider({
  apiURL: API_URL,
  kyOptions,
})

export const { dataProvider: adminDataProvider } = createSimpleRestDataProvider(
  {
    apiURL: `${API_URL}/admin`,
    kyOptions,
  },
)
