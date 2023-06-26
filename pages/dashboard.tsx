import { Layout } from '@/components/Layout'
import { useRouter } from 'next/router'
import axios from 'axios'
import { LogoutIcon } from '@heroicons/react/solid'

const Dashboard = () => {
  const router = useRouter()
  const logout = async () => {
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`)
    router.push('/')
  }
  return (
    <Layout title="Task Board">
      <LogoutIcon
        className="mb-6 h-6 w-6 text-blue-500"
        onClick={logout}
      ></LogoutIcon>
    </Layout>
  )
}

export default Dashboard
