import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { DadataResponse } from './models/dadata-response';
import { DadataSuggestion } from './models/suggestion';
import { DadataConfig } from './dadata-config';

export enum DadataType {
  fio = 'fio',
  address = 'address',
  party = 'party',
  bank = 'bank',
  email = 'email',
}

const API_BASE = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/';

@Injectable({ providedIn: 'root' })
export class NgxDadataService {
  private readonly http = inject(HttpClient);

  getSuggestions(query: string, config: DadataConfig): Observable<DadataSuggestion[]> {
    const type = config.type ?? DadataType.address;
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Token ${config.apiKey}`,
    });
    const body = {
      query,
      count: config.limit ?? 10,
      locations: config.locations ?? undefined,
      locations_boost: config.locationsBoost ?? undefined,
      from_bound: config.bounds?.fromBound ?? undefined,
      to_bound: config.bounds?.toBound ?? undefined,
    };

    return this.http.post<DadataResponse>(API_BASE + type, body, { headers }).pipe(
      map((response) => response.suggestions),
      catchError(() => of([])),
    );
  }
}
