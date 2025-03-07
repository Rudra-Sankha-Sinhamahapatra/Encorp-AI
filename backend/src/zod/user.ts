import z from "zod";

export const Signup = z.object({
  name: z.string().min(1).max(30),
  email: z.string().email().min(1).max(40),
  password: z.string().min(1).max(50),
});

export const Signin = z.object({
  email: z.string().email().min(1).max(40),
  password: z.string().min(1).max(50),
});