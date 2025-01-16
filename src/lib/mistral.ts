import { Mistral } from '@mistralai/mistralai'

export const mistralAI = new Mistral({ apiKey: process.env.MISTRAL_API_KEY || '' })