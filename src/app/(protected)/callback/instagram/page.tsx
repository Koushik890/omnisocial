import { onIntegrate } from '@/actions/integrations'
import { redirect } from 'next/navigation'
import { UserProfile } from '@/types/user'

interface PageProps {
  params: Promise<any>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function Page({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const code = resolvedParams.code as string | undefined

  if (code) {
    console.log(code)
    const response = await onIntegrate(code.split('#_')[0])
    
    if (response.status === 200 && response.data) {
      const { firstname, lastname } = response.data
      if (firstname && lastname) {
        return redirect(`/dashboard/${firstname}${lastname}/integrations`)
      }
    }
  }
  
  return redirect('/sign-up')
}

export default Page