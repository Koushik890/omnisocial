declare module '@mistralai/mistralai' {
  export class Mistral {
    constructor(options: { apiKey: string })
    chat: {
      complete: (params: {
        model: string
        messages: Array<{
          role: string
          content: string
        }>
      }) => Promise<{
        choices: Array<{
          message: {
            content: string
          }
        }>
      }>
    }
  }
} 