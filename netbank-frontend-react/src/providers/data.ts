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
