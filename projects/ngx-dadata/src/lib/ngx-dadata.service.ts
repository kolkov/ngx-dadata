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
    const body: Record<string, unknown> = {
      query,
      count: config.limit ?? 10,
      // Common params
      locations: config.locations,
      locations_boost: config.locationsBoost,
      from_bound: config.bounds?.fromBound,
      to_bound: config.bounds?.toBound,
      // Address params
      restrict_value: config.restrictValue,
      language: config.language,
      locations_geo: config.locationsGeo,
      division: config.division,
      // Party params
      type: config.entityType,
      status: config.status,
      okved: config.okved,
      branch_type: config.branchType,
      // Bank params (share 'type' and 'status' API field names with party)
      ...(config.bankType != null ? { type: config.bankType } : {}),
      ...(config.bankStatus != null ? { status: config.bankStatus } : {}),
      // FIO params
      gender: config.gender,
      parts: config.parts,
    };

    // Remove undefined keys to keep request body clean
    for (const key of Object.keys(body)) {
      if (body[key] === undefined) {
        delete body[key];
      }
    }

    return this.http.post<DadataResponse>(API_BASE + type, body, { headers }).pipe(
      map((response) => response.suggestions),
      catchError(() => of([])),
    );
  }
}
