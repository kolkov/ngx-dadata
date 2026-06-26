import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { DadataResponse, DadataIplocateResponse } from './models/dadata-response';
import { DadataSuggestion } from './models/suggestion';
import { DadataConfig, GeolocateOptions, IplocateOptions } from './dadata-config';
import { NGX_DADATA_CONFIG } from './provide';

export enum DadataType {
  // Primary suggestion types
  address = 'address',
  fio = 'fio',
  party = 'party',
  bank = 'bank',
  email = 'email',
  fias = 'fias',
  country = 'country',
  postal_unit = 'postal_unit',
  // International
  party_by = 'party_by',
  party_kz = 'party_kz',
  // Reference/classifiers
  currency = 'currency',
  okved2 = 'okved2',
  okpd2 = 'okpd2',
  oktmo = 'oktmo',
  mktu = 'mktu',
  metro = 'metro',
  fms_unit = 'fms_unit',
  fns_unit = 'fns_unit',
  fts_unit = 'fts_unit',
  court = 'court',
  car_brand = 'car_brand',
  okpdtr_profession = 'okpdtr_profession',
  okpdtr_position = 'okpdtr_position',
  medical_position = 'medical_position',
}

const API_BASE = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/';

@Injectable({ providedIn: 'root' })
export class NgxDadataService {
  private readonly http = inject(HttpClient);
  private readonly defaultConfig = inject(NGX_DADATA_CONFIG, { optional: true });

  private buildHeaders(apiKey: string): HttpHeaders {
    return new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Token ${apiKey}`,
    });
  }

  private resolveConfig(config?: DadataConfig): DadataConfig {
    const resolved = config ?? this.defaultConfig;
    if (!resolved) {
      throw new Error(
        'NgxDadata: No config provided. Either pass a config parameter or use provideNgxDadata() in your application providers.',
      );
    }
    return resolved;
  }

  private static stripUndefined(body: Record<string, unknown>): Record<string, unknown> {
    for (const key of Object.keys(body)) {
      if (body[key] === undefined) {
        delete body[key];
      }
    }
    return body;
  }

  getSuggestions(query: string, config?: DadataConfig): Observable<DadataSuggestion[]> {
    const resolvedConfig = this.resolveConfig(config);
    const type = resolvedConfig.type ?? DadataType.address;
    const headers = this.buildHeaders(resolvedConfig.apiKey);
    const body: Record<string, unknown> = NgxDadataService.stripUndefined({
      query,
      count: resolvedConfig.limit ?? 10,
      // Common params
      locations: resolvedConfig.locations,
      locations_boost: resolvedConfig.locationsBoost,
      from_bound: resolvedConfig.bounds?.fromBound,
      to_bound: resolvedConfig.bounds?.toBound,
      // Address params
      restrict_value: resolvedConfig.restrictValue,
      language: resolvedConfig.language,
      locations_geo: resolvedConfig.locationsGeo,
      division: resolvedConfig.division,
      // Party params
      type: resolvedConfig.entityType,
      status: resolvedConfig.status,
      okved: resolvedConfig.okved,
      branch_type: resolvedConfig.branchType,
      // Bank params (share 'type' and 'status' API field names with party)
      ...(resolvedConfig.bankType != null ? { type: resolvedConfig.bankType } : {}),
      ...(resolvedConfig.bankStatus != null ? { status: resolvedConfig.bankStatus } : {}),
      // FIO params
      gender: resolvedConfig.gender,
      parts: resolvedConfig.parts,
    });

    return this.http.post<DadataResponse>(`${API_BASE}suggest/${type}`, body, { headers }).pipe(
      map((response) => response.suggestions),
      catchError(() => of([])),
    );
  }

  findById(query: string, type: DadataType, config?: DadataConfig): Observable<DadataSuggestion[]> {
    const resolvedConfig = this.resolveConfig(config);
    const headers = this.buildHeaders(resolvedConfig.apiKey);
    const body: Record<string, unknown> = NgxDadataService.stripUndefined({
      query,
      count: resolvedConfig.limit,
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
