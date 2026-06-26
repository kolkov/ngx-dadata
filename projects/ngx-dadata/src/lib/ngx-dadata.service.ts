import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { DadataResponse, DadataIplocateResponse } from './models/dadata-response';
import { DadataSuggestion } from './models/suggestion';
import { DadataConfig, GeolocateOptions, IplocateOptions } from './dadata-config';

export enum DadataType {
  fio = 'fio',
  address = 'address',
  party = 'party',
  bank = 'bank',
  email = 'email',
}

const API_BASE = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/';

@Injectable({ providedIn: 'root' })
export class NgxDadataService {
  private readonly http = inject(HttpClient);

  private buildHeaders(apiKey: string): HttpHeaders {
    return new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Token ${apiKey}`,
    });
  }

  private static stripUndefined(body: Record<string, unknown>): Record<string, unknown> {
    for (const key of Object.keys(body)) {
      if (body[key] === undefined) {
        delete body[key];
      }
    }
    return body;
  }

  getSuggestions(query: string, config: DadataConfig): Observable<DadataSuggestion[]> {
    const type = config.type ?? DadataType.address;
    const headers = this.buildHeaders(config.apiKey);
    const body: Record<string, unknown> = NgxDadataService.stripUndefined({
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
    });

    return this.http.post<DadataResponse>(`${API_BASE}suggest/${type}`, body, { headers }).pipe(
      map((response) => response.suggestions),
      catchError(() => of([])),
    );
  }

  findById(query: string, type: DadataType, config: DadataConfig): Observable<DadataSuggestion[]> {
    const headers = this.buildHeaders(config.apiKey);
    const body: Record<string, unknown> = NgxDadataService.stripUndefined({
      query,
      count: config.limit,
    });

    return this.http.post<DadataResponse>(`${API_BASE}findById/${type}`, body, { headers }).pipe(
      map((response) => response.suggestions),
      catchError(() => of([])),
    );
  }

  geolocate(lat: number, lon: number, options: GeolocateOptions): Observable<DadataSuggestion[]> {
    const headers = this.buildHeaders(options.apiKey);
    const body: Record<string, unknown> = NgxDadataService.stripUndefined({
      lat,
      lon,
      count: options.count,
      radius_meters: options.radius_meters,
      language: options.language,
    });

    return this.http.post<DadataResponse>(`${API_BASE}geolocate/address`, body, { headers }).pipe(
      map((response) => response.suggestions),
      catchError(() => of([])),
    );
  }

  iplocate(ip: string, options: IplocateOptions): Observable<DadataSuggestion | null> {
    const headers = this.buildHeaders(options.apiKey);
    const body: Record<string, unknown> = NgxDadataService.stripUndefined({
      ip,
      language: options.language,
    });

    return this.http.post<DadataIplocateResponse>(`${API_BASE}iplocate/address`, body, { headers }).pipe(
      map((response) => response.location),
      catchError(() => of(null)),
    );
  }
}
