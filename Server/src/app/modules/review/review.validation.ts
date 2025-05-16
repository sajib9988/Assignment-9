import * as z from 'zod';

export const reviewValidation = z.object({

    mediaId: z.string({ required_error: 'Media ID is required' }),
    comment: z.string().min(1, 'Comment is required'),
  });

export const reviewUpdateValidation = z.object({
 comment: z.string().min(1, 'Comment is required'),
});
