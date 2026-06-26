import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { provideHttpClient } from '@angular/common/http';
import { EnvironmentProviders, Provider } from '@angular/core';
import { NgxDadataComponent } from '@kolkov/ngx-dadata';
import { DadataConfig, provideNgxDadata } from '@kolkov/ngx-dadata';

/**
 * Options for registering the ngx-dadata Custom Element.
 */
export interface NgxDadataElementOptions {
  /** Global DadataConfig applied to the element via DI. */
  readonly config?: DadataConfig;
}

/**
 * Registers `<ngx-dadata>` as a Custom Element (Web Component).
 *
 * This bootstraps a minimal Angular application behind the scenes
 * and defines the custom element in the browser's CustomElementRegistry.
 * Once registered, `<ngx-dadata>` can be used in any HTML page,
 * React, Vue, or other framework without Angular knowledge.
 *
 * Calling this function multiple times is safe -- subsequent calls
 * are no-ops if the element is already defined.
 *
 * @example
 * ```typescript
 * import { registerNgxDadataElement } from '@kolkov/ngx-dadata/elements';
 *
 * await registerNgxDadataElement({
 *   config: { apiKey: 'your-dadata-api-key', type: 'address' },
 * });
 *
 * // Now <ngx-dadata></ngx-dadata> works in any HTML
 * ```
 */
export async function registerNgxDadataElement(options?: NgxDadataElementOptions): Promise<void> {
  if (customElements.get('ngx-dadata')) {
    return;
  }

  const providers: (Provider | EnvironmentProviders)[] = [provideHttpClient()];

  if (options?.config) {
    providers.push(provideNgxDadata(options.config));
  }

  const app = await createApplication({ providers });
  const NgxDadataElement = createCustomElement(NgxDadataComponent, { injector: app.injector });
  customElements.define('ngx-dadata', NgxDadataElement);
}
