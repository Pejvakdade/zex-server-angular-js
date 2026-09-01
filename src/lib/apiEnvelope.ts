/** ---------------------------------------------------------------------------------------------------------------------
 * @file apiEnvelope.ts
 * @fileOverview the response shape every ZexServer controller returns
 *               (see the backend's src/values/{httpCodeMessage,statusCode}.ts).
 */
export interface ApiEnvelope<TResult> {
  result: TResult;
  message: string;
  httpCode: number;
  statusCode: number;
}
