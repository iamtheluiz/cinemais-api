import { z } from "zod";

export const paginationSchema = z.object({
  page: z.string().optional().default('1'),
  size: z.string().optional().default('10'),
  all: z.string().optional().default('false')
})