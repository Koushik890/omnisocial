import { InstagramDuoToneBlue, SalesForceDuoToneBlue } from "@/icons"

type Props = {
  title: string
  icon: React.ReactNode
  description: string
  strategy: 'INSTAGRAM' | 'CRM'
}

export const INTEGRATION_CARDS: Props[] = [
  {
    title: 'Connect Instagram',
    description:
      'Seamlessly integrate your Instagram account to manage posts, analyze engagement, and grow your audience.',
    icon: <InstagramDuoToneBlue />,
    strategy: 'INSTAGRAM',
    
  },

]