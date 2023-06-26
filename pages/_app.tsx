import '@/styles/globals.css'
import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import { MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import axios from 'axios'

// reqctQueryを使用できるようにするために、queryClientを作成
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // restAPIへのfetchに失敗した場合自動的に３回りトライする機能の設定
      retry: false,
      // ユーザがブラウザにfocusした時にrestapiへのfetchを行うかどうかの設定
      refetchOnWindowFocus: false,
    },
  },
})

export default function App({ Component, pageProps }: AppProps) {
  // frontとbackのcookieを共有するための設定
  axios.defaults.withCredentials = true
  // バックエンドの${process.env.NEXT_PUBLIC_API_URL}/auth/csrfエンドポイントから
  // CSRFトークンを取得し、クライアントのヘッダに設定している。
  useEffect(() => {
    const getCsrfToken = async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/csrf`
      )
      axios.defaults.headers.common['csrf-token'] = data.csrfToken
    }
    getCsrfToken()
  }, [])
  return (
    // プロジェクト全体でリアクトクエリを使えるようにするために
    // QueryClientProvider
    <QueryClientProvider client={queryClient}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: 'dark',
          fontFamily: 'Verdana, sans-serif',
        }}
      >
        <Component {...pageProps} />
      </MantineProvider>
      {/* ReactQueryDevtoolsを使えるようにする設定 */}
      <ReactQueryDevtools />
    </QueryClientProvider>
  )
}
