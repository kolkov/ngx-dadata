import { InjectionToken, Provider } from '@angular/core';
import { DadataConfig } from './dadata-config';

/**
 * InjectionToken for providing a global DadataConfig via DI.
 *
 * Consumers can provide this token at the application level so that
 * every NgxDadataComponent and NgxDadataService instance picks it up
 * automatically, without passing config to each component or service call.
 */
export const NGX_DADATA_CONFIG = new InjectionToken<DadataConfig>('NgxDadataConfig');

/**
 * Provides a global DadataConfig for the entire application.
 *
 * @example
 * ```typescript
 * // app.config.ts
 * import { provideNgxDadata, DadataType } from '@kolkov/ngx-dadata';
 *
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideHttpClient(),
 *     provideNgxDadata({ apiKey: 'my-api-key', type: DadataType.address }),
 *   ],
 * };
 * ```
 */
export function provideNgxDadata(config: DadataConfig): Provider {
  return { provide: NGX_DADATA_CONFIG, useValue: config };
}
