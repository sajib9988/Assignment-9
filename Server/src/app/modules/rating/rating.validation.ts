import { z } from 'zod';

export const ratingSchema = z.object({
 mediaId: z.string(),
    rating: z.number().min(1).max(5),
  })
   




export const ratingUpdateSchema = z.object({
  rating: z.number().min(1).max(5),
});