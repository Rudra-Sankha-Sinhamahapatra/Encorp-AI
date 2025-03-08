import z from 'zod'

export const CreatePresentation = z.object({
    prompt: z.string().min(5).max(100),
    userId:z.number()
})