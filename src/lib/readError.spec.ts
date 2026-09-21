import { HttpErrorResponse } from '@angular/common/http';

import { readError } from './readError';

const httpError = (error: unknown) => new HttpErrorResponse({ status: 400, error });

describe('readError', () => {
  it('takes the first message of a ValidationPipe array', () => {
    expect(
      readError(httpError({ message: ['email must be an email', 'password too short'] })),
    ).toBe('email must be an email');
  });

  it('passes a plain backend message through', () => {
    expect(readError(httpError({ message: 'Email or password is incorrect' }))).toBe(
      'Email or password is incorrect',
    );
  });

  it('falls back to a generic line for network errors and unknown shapes', () => {
    expect(readError(new HttpErrorResponse({ status: 0 }))).toBe(
      'Something went wrong. Please try again.',
    );
    expect(readError(undefined)).toBe('Something went wrong. Please try again.');
    expect(readError(httpError({ message: { nested: true } }))).toBe(
      'Something went wrong. Please try again.',
    );
  });
});
