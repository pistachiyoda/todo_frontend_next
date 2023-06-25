import { FC, ReactNode } from 'react'
import Head from 'next/head'

type Props = {
  title: string
  children: ReactNode
}

export const Layout: FC<Props> = ({ children, title = 'Nextjs' }) => {
  return (
    <div className="min-h-screeen flex flex-col items-center justify-center">
      <Head>
        <title>{title}</title>
      </Head>
    </div>
  )
}
