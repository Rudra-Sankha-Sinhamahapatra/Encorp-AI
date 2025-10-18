import z from 'zod'

export const CreatePresentation = z.object({
    prompt: z.string().min(10).max(500),
    numberOfSlides:z.number(),
    presentationStyle:z.string(),
    userId:z.number()
})