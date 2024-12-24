import { INTEGRATION_CARDS } from '@/constants/integrations'
import IntegrationCard from './_components/integration-card/page'
import React from 'react'

type Props = {}

const IntegrationsPage = (props: Props) => {
  return (
    <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full lg:flex lg:justify-center">
        <div className="grid gap-4 sm:gap-6 w-full lg:w-10/12">
          {INTEGRATION_CARDS.map((card, key) => (
            <IntegrationCard key={key} {...card} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default IntegrationsPage
