import { onIntegrate } from '@/actions/integrations'
import { redirect } from 'next/navigation'

type PageProps = {
  params: { [key: string]: string | string[] | undefined }
  searchParams: { [key: string]: string | string[] | undefined }
}

async function Page({ searchParams }: PageProps) {
  const code = searchParams.code as string | undefined
  if (code) {
    console.log(code)
    const user = await onIntegrate(code.split('#_')[0])
    if (user.status === 200) {
      return redirect(
        `/dashboard/${user.data?.firstname}${user.data?.lastname}/integrations`
      )
    }
  }
  return redirect('/sign-up')
}

export default Page