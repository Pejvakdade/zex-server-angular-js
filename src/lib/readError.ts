/** ---------------------------------------------------------------------------------------------------------------------
 * @file readError.ts
 * @fileOverview turns an HttpErrorResponse into the one line a form or toast should show. The backend's
 *               ValidationPipe returns an array of messages; everything else is a single string.
 */
import { HttpErrorResponse } from '@angular/common/http';

export const readError = (error: unknown): string => {
  const message = (error as HttpErrorResponse)?.error?.message;
  if (Array.isArray(message)) return message[0];
  if (typeof message === 'string') return message;
  return 'Something went wrong. Please try again.';
};
