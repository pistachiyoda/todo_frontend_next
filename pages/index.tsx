import type { NextPage } from 'next'
import { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import * as Yup from 'yup'
import { IconDatabase } from '@tabler/icons'
import { ShieldCheckIcon } from '@heroicons/react/solid'
import { ExclamationCircleIcon } from '@heroicons/react/outline'
import {
  Anchor,
  TextInput,
  Button,
  Group,
  PasswordInput,
  Alert,
} from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import { Layout } from '@/components/Layout'
import { AuthForm } from '@/types'

const schema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('No email provided'),
  password: Yup.string()
    .required('No password provided')
    .min(5, 'Password should be min 5 characters long'),
})

const Home: NextPage = () => {
  const router = useRouter()
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState('')
  const form = useForm<AuthForm>({
    // yupResoleverでchemaを設定する
    validate: yupResolver(schema),
    initialValues: {
      email: '',
      password: '',
    },
  })
  // サブミットボタンが押された時のログイン、またはレジスター時のAPIとの通信の処理
  const handleSubmit = async () => {
    try {
      // レジスター時はauth/signupにユーザが入力したemailとpasswordを送信する
      if (isRegister) {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
          // DTOとしてバックエンドに送信される
          email: form.values.email,
          password: form.values.password,
        })
      }
      // ログイン時はauth/loginにユーザが入力したemailとpasswordを送信する
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        email: form.values.email,
        password: form.values.password,
      })
      // フォームの値をリセットする
      form.reset()
      // /dashboardにリダイレクトする
      router.push('/dashboard')
    } catch (e: any) {
      // エラーが発生したらエラーメッセージを表示する
      setError(e.response.data.message)
    }
  }
  return (
    <Layout title="Auth">
      <ShieldCheckIcon className="h-16 w-16 text-blue-500" />
      {error && (
        <Alert
          my="md"
          variant="filled"
          icon={<ExclamationCircleIcon />}
          title="Authorization Error"
          color="red"
          radius="md"
        >
          {error}
        </Alert>
      )}
      {/* mantineではform.onSubmitで関数をラップすることで、form送信時の
      リロードを防止するpreventdefaultの処理を書く必要がなくなる */}
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          mt="md"
          id="email"
          label="Email*"
          placeholder="example@gmail.com"
          // 通常のreactHooksだとvalueとonchangeを設定する必要があるが、
          // mantineではform.getInputPropsを使うことで、valueとonchangeを設定する必要がなくなる
          {...form.getInputProps('email')}
        />
        <PasswordInput
          mt="md"
          id="password"
          placeholder="Your password"
          label="Password*"
          description="Password should be min 5 characters long"
          {...form.getInputProps('password')}
        />
        <Group position="apart" mt="xl">
          <Anchor
            component="button"
            type="button"
            size="xs"
            className="text-gray-300"
            onClick={() => {
              setIsRegister(!isRegister)
              setError('')
            }}
          >
            {isRegister ? 'Have an account? Login' : 'No account? Register'}
          </Anchor>
          <Button
            leftIcon={<IconDatabase size={14} />}
            color="cyan"
            type="submit"
          >
            {isRegister ? 'Register' : 'Login'}
          </Button>
        </Group>
      </form>
    </Layout>
  )
}
export default Home
