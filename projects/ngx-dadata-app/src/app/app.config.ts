import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideNgxDadata, DadataType } from '@kolkov/ngx-dadata';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideNgxDadata({
      apiKey: '2e51c5fbc1a60bd48face95951108560bf03f7d9',
      type: DadataType.address,
    }),
  ],
};
