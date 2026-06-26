import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NgxDadataService, DadataType } from './ngx-dadata.service';
import { DadataConfig } from './dadata-config';
import { DadataSuggestion } from './models/suggestion';
import { DadataResponse } from './models/dadata-response';
import { DadataAddress } from './models/data';

const API_BASE = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/';

function makeAddressSuggestion(value: string): DadataSuggestion {
  return {
    value,
    unrestricted_value: value,
    data: { city: 'Moscow' } as DadataAddress,
  };
}

function makeResponse(suggestions: DadataSuggestion[]): DadataResponse {
  return { suggestions };
}

describe('NgxDadataService', () => {
  let service: NgxDadataService;
  let httpMock: HttpTestingController;

  const baseConfig: DadataConfig = {
    apiKey: 'test-token-abc123',
    type: DadataType.address,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(NgxDadataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // --- URL construction ---

  it('should send POST to the correct Dadata API URL for address type', () => {
    const config: DadataConfig = { ...baseConfig, type: DadataType.address };
    service.getSuggestions('moscow', config).subscribe();

    const req = httpMock.expectOne(API_BASE + 'address');
    expect(req.request.method).toBe('POST');
    req.flush(makeResponse([]));
  });

  it('should send POST to the correct URL for fio type', () => {
    const config: DadataConfig = { ...baseConfig, type: DadataType.fio };
    service.getSuggestions('Ivan', config).subscribe();

    const req = httpMock.expectOne(API_BASE + 'fio');
    expect(req.request.method).toBe('POST');
    req.flush(makeResponse([]));
  });

  it('should send POST to the correct URL for party type', () => {
    const config: DadataConfig = { ...baseConfig, type: DadataType.party };
    service.getSuggestions('Sber', config).subscribe();

    const req = httpMock.expectOne(API_BASE + 'party');
    expect(req.request.method).toBe('POST');
    req.flush(makeResponse([]));
  });

  it('should send POST to the correct URL for bank type', () => {
    const config: DadataConfig = { ...baseConfig, type: DadataType.bank };
    service.getSuggestions('Sber', config).subscribe();

    const req = httpMock.expectOne(API_BASE + 'bank');
    expect(req.request.method).toBe('POST');
    req.flush(makeResponse([]));
  });

  it('should send POST to the correct URL for email type', () => {
    const config: DadataConfig = { ...baseConfig, type: DadataType.email };
    service.getSuggestions('user@', config).subscribe();

    const req = httpMock.expectOne(API_BASE + 'email');
    expect(req.request.method).toBe('POST');
    req.flush(makeResponse([]));
  });

  it('should default to address type when config.type is undefined', () => {
    const config: DadataConfig = { apiKey: 'test-token' };
    service.getSuggestions('test', config).subscribe();

    const req = httpMock.expectOne(API_BASE + 'address');
    expect(req.request.method).toBe('POST');
    req.flush(makeResponse([]));
  });

  // --- Headers ---

  it('should send Authorization header with token from config', () => {
    service.getSuggestions('test', baseConfig).subscribe();

    const req = httpMock.expectOne(API_BASE + 'address');
    expect(req.request.headers.get('Authorization')).toBe('Token test-token-abc123');
    req.flush(makeResponse([]));
  });

  it('should send Accept application/json header', () => {
    service.getSuggestions('test', baseConfig).subscribe();

    const req = httpMock.expectOne(API_BASE + 'address');
    expect(req.request.headers.get('Accept')).toBe('application/json');
    req.flush(makeResponse([]));
  });

  it('should send Content-Type application/json header', () => {
    service.getSuggestions('test', baseConfig).subscribe();

    const req = httpMock.expectOne(API_BASE + 'address');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    req.flush(makeResponse([]));
  });

  // --- Request body ---

  it('should send query in request body', () => {
    service.getSuggestions('Moscow', baseConfig).subscribe();

    const req = httpMock.expectOne(API_BASE + 'address');
    expect(req.request.body.query).toBe('Moscow');
    req.flush(makeResponse([]));
  });

  it('should send default count of 10 when limit is not specified', () => {
    service.getSuggestions('test', baseConfig).subscribe();

    const req = httpMock.expectOne(API_BASE + 'address');
    expect(req.request.body.count).toBe(10);
    req.flush(makeResponse([]));
  });

  it('should send custom count when limit is specified', () => {
    const config: DadataConfig = { ...baseConfig, limit: 5 };
    service.getSuggestions('test', config).subscribe();

    const req = httpMock.expectOne(API_BASE + 'address');
    expect(req.request.body.count).toBe(5);
    req.flush(makeResponse([]));
  });

  it('should send locations when provided', () => {
    const locations = [{ city: 'Moscow' }, { region: 'Sverdlovsk' }];
    const config: DadataConfig = { ...baseConfig, locations };
    service.getSuggestions('test', config).subscribe();

    const req = httpMock.expectOne(API_BASE + 'address');
    expect(req.request.body.locations).toEqual(locations);
    req.flush(makeResponse([]));
  });

  it('should send locations_boost when provided', () => {
    const locationsBoost = [{ kladr_id: '77' }];
    const config: DadataConfig = { ...baseConfig, locationsBoost };
    service.getSuggestions('test', config).subscribe();

    const req = httpMock.expectOne(API_BASE + 'address');
    expect(req.request.body.locations_boost).toEqual(locationsBoost);
    req.flush(makeResponse([]));
  });

  it('should send from_bound and to_bound when bounds are provided', () => {
    const config: DadataConfig = {
      ...baseConfig,
      bounds: {
        fromBound: { value: 'city' },
        toBound: { value: 'settlement' },
      },
    };
    service.getSuggestions('test', config).subscribe();

    const req = httpMock.expectOne(API_BASE + 'address');
    expect(req.request.body.from_bound).toEqual({ value: 'city' });
    expect(req.request.body.to_bound).toEqual({ value: 'settlement' });
    req.flush(makeResponse([]));
  });

  it('should send undefined for optional fields when not provided', () => {
    service.getSuggestions('test', baseConfig).subscribe();

    const req = httpMock.expectOne(API_BASE + 'address');
    expect(req.request.body.locations).toBeUndefined();
    expect(req.request.body.locations_boost).toBeUndefined();
    expect(req.request.body.from_bound).toBeUndefined();
    expect(req.request.body.to_bound).toBeUndefined();
    req.flush(makeResponse([]));
  });

  // --- Address-specific params ---

  it('should send restrict_value when restrictValue is true', () => {
    const config: DadataConfig = { ...baseConfig, restrictValue: true };
    service.getSuggestions('test', config).subscribe();

    const req = httpMock.expectOne(API_BASE + 'address');
    expect(req.request.body.restrict_value).toBe(true);
    req.flush(makeResponse([]));
  });

  it('should send restrict_value when restrictValue is false', () => {
    const config: DadataConfig = { ...baseConfig, restrictValue: false };
    service.getSuggestions('test', config).subscribe();

    const req = httpMock.expectOne(API_BASE + 'address');
    expect(req.request.body.restrict_value).toBe(false);
    req.flush(makeResponse([]));
  });

  it('should not send restrict_value when restrictValue is not provided', () => {
    service.getSuggestions('test', baseConfig).subscribe();

    const req = httpMock.expectOne(API_BASE + 'address');
    expect(req.request.body).not.toHaveProperty('restrict_value');
    req.flush(makeResponse([]));
  });

  it('should send language "en" in request body', () => {
    const config: DadataConfig = { ...baseConfig, language: 'en' };
    service.getSuggestions('test', config).subscribe();

    const req = httpMock.expectOne(API_BASE + 'address');
    expect(req.request.body.language).toBe('en');
    req.flush(makeResponse([]));
  });

  it('should send language "ru" in request body', () => {
    const config: DadataConfig = { ...baseConfig, language: 'ru' };
    service.getSuggestions('test', config).subscribe();

    const req = httpMock.expectOne(API_BASE + 'address');
    expect(req.request.body.language).toBe('ru');
    req.flush(makeResponse([]));
  });

  it('should not send language when not provided', () => {
    service.getSuggestions('test', baseConfig).subscribe();

    const req = httpMock.expectOne(API_BASE + 'address');
    expect(req.request.body).not.toHaveProperty('language');
    req.flush(makeResponse([]));
  });

  it('should send locations_geo array when locationsGeo is provided', () => {
    const locationsGeo = [
      { lat: 55.75, lon: 37.57, radius_meters: 500 },
      { lat: 59.93, lon: 30.31, radius_meters: 1000 },
    ];
    const config: DadataConfig = { ...baseConfig, locationsGeo };
    service.getSuggestions('test', config).subscribe();

    const req = httpMock.expectOne(API_BASE + 'address');
    expect(req.request.body.locations_geo).toEqual(locationsGeo);
    req.flush(makeResponse([]));
  });

  it('should not send locations_geo when locationsGeo is not provided', () => {
    service.getSuggestions('test', baseConfig).subscribe();

    const req = httpMock.expectOne(API_BASE + 'address');
    expect(req.request.body).not.toHaveProperty('locations_geo');
    req.flush(makeResponse([]));
  });

  it('should send division field when provided', () => {
    const config: DadataConfig = { ...baseConfig, division: 'municipal' };
    service.getSuggestions('test', config).subscribe();

    const req = httpMock.expectOne(API_BASE + 'address');
    expect(req.request.body.division).toBe('municipal');
    req.flush(makeResponse([]));
  });

  it('should not send division when not provided', () => {
    service.getSuggestions('test', baseConfig).subscribe();

    const req = httpMock.expectOne(API_BASE + 'address');
    expect(req.request.body).not.toHaveProperty('division');
    req.flush(makeResponse([]));
  });

  // --- Party-specific params ---

  it('should send type field when entityType is provided', () => {
    const config: DadataConfig = { ...baseConfig, type: DadataType.party, entityType: 'LEGAL' };
    service.getSuggestions('Sber', config).subscribe();

    const req = httpMock.expectOne(API_BASE + 'party');
    expect(req.request.body.type).toBe('LEGAL');
    req.flush(makeResponse([]));
  });

  it('should send type INDIVIDUAL for individual entrepreneurs', () => {
    const config: DadataConfig = { ...baseConfig, type: DadataType.party, entityType: 'INDIVIDUAL' };
    service.getSuggestions('test', config).subscribe();

    const req = httpMock.expectOne(API_BASE + 'party');
    expect(req.request.body.type).toBe('INDIVIDUAL');
    req.flush(makeResponse([]));
  });

  it('should not send type when entityType is not provided', () => {
    const config: DadataConfig = { ...baseConfig, type: DadataType.party };
    service.getSuggestions('test', config).subscribe();

    const req = httpMock.expectOne(API_BASE + 'party');
    expect(req.request.body).not.toHaveProperty('type');
    req.flush(makeResponse([]));
  });

  it('should send status array when provided for party', () => {
    const config: DadataConfig = {
      ...baseConfig,
      type: DadataType.party,
      status: ['ACTIVE', 'LIQUIDATING'],
    };
    service.getSuggestions('test', config).subscribe();

    const req = httpMock.expectOne(API_BASE + 'party');
    expect(req.request.body.status).toEqual(['ACTIVE', 'LIQUIDATING']);
    req.flush(makeResponse([]));
  });

  it('should not send status when not provided', () => {
    service.getSuggestions('test', baseConfig).subscribe();

    const req = httpMock.expectOne(API_BASE + 'address');
    expect(req.request.body).not.toHaveProperty('status');
    req.flush(makeResponse([]));
  });

  it('should send okved array when provided', () => {
    const config: DadataConfig = {
      ...baseConfig,
      type: DadataType.party,
      okved: ['61.10', '62.01'],
    };
    service.getSuggestions('test', config).subscribe();

    const req = httpMock.expectOne(API_BASE + 'party');
    expect(req.request.body.okved).toEqual(['61.10', '62.01']);
    req.flush(makeResponse([]));
  });

  it('should not send okved when not provided', () => {
    service.getSuggestions('test', baseConfig).subscribe();

    const req = httpMock.expectOne(API_BASE + 'address');
    expect(req.request.body).not.toHaveProperty('okved');
    req.flush(makeResponse([]));
  });

  it('should send branch_type when branchType is provided', () => {
    const config: DadataConfig = {
      ...baseConfig,
      type: DadataType.party,
      branchType: 'MAIN',
    };
    service.getSuggestions('test', config).subscribe();

    const req = httpMock.expectOne(API_BASE + 'party');
    expect(req.request.body.branch_type).toBe('MAIN');
    req.flush(makeResponse([]));
  });

  it('should not send branch_type when branchType is not provided', () => {
    service.getSuggestions('test', baseConfig).subscribe();

    const req = httpMock.expectOne(API_BASE + 'address');
    expect(req.request.body).not.toHaveProperty('branch_type');
    req.flush(makeResponse([]));
  });

  // --- Bank-specific params ---

  it('should send type array when bankType is provided for bank', () => {
    const config: DadataConfig = {
      ...baseConfig,
      type: DadataType.bank,
      bankType: ['BANK', 'NKO'],
    };
    service.getSuggestions('test', config).subscribe();

    const req = httpMock.expectOne(API_BASE + 'bank');
    expect(req.request.body.type).toEqual(['BANK', 'NKO']);
    req.flush(makeResponse([]));
  });

  it('should not send type when bankType is not provided', () => {
    const config: DadataConfig = { ...baseConfig, type: DadataType.bank };
    service.getSuggestions('test', config).subscribe();

    const req = httpMock.expectOne(API_BASE + 'bank');
    expect(req.request.body).not.toHaveProperty('type');
    req.flush(makeResponse([]));
  });

  it('should send status array when bankStatus is provided for bank', () => {
    const config: DadataConfig = {
      ...baseConfig,
      type: DadataType.bank,
      bankStatus: ['ACTIVE', 'LIQUIDATED'],
    };
    service.getSuggestions('test', config).subscribe();

    const req = httpMock.expectOne(API_BASE + 'bank');
    expect(req.request.body.status).toEqual(['ACTIVE', 'LIQUIDATED']);
    req.flush(makeResponse([]));
  });

  it('should not send status when bankStatus is not provided', () => {
    const config: DadataConfig = { ...baseConfig, type: DadataType.bank };
    service.getSuggestions('test', config).subscribe();

    const req = httpMock.expectOne(API_BASE + 'bank');
    expect(req.request.body).not.toHaveProperty('status');
    req.flush(makeResponse([]));
  });

  // --- FIO-specific params ---

  it('should send gender field when provided for fio', () => {
    const config: DadataConfig = {
      ...baseConfig,
      type: DadataType.fio,
      gender: 'FEMALE',
    };
    service.getSuggestions('Anna', config).subscribe();

    const req = httpMock.expectOne(API_BASE + 'fio');
    expect(req.request.body.gender).toBe('FEMALE');
    req.flush(makeResponse([]));
  });

  it('should send gender UNKNOWN when specified', () => {
    const config: DadataConfig = {
      ...baseConfig,
      type: DadataType.fio,
      gender: 'UNKNOWN',
    };
    service.getSuggestions('test', config).subscribe();

    const req = httpMock.expectOne(API_BASE + 'fio');
    expect(req.request.body.gender).toBe('UNKNOWN');
    req.flush(makeResponse([]));
  });

  it('should not send gender when not provided', () => {
    service.getSuggestions('test', baseConfig).subscribe();

    const req = httpMock.expectOne(API_BASE + 'address');
    expect(req.request.body).not.toHaveProperty('gender');
    req.flush(makeResponse([]));
  });

  it('should send parts array when provided for fio', () => {
    const config: DadataConfig = {
      ...baseConfig,
      type: DadataType.fio,
      parts: ['SURNAME', 'NAME'],
    };
    service.getSuggestions('Ivan', config).subscribe();

    const req = httpMock.expectOne(API_BASE + 'fio');
    expect(req.request.body.parts).toEqual(['SURNAME', 'NAME']);
    req.flush(makeResponse([]));
  });

  it('should not send parts when not provided', () => {
    service.getSuggestions('test', baseConfig).subscribe();

    const req = httpMock.expectOne(API_BASE + 'address');
    expect(req.request.body).not.toHaveProperty('parts');
    req.flush(makeResponse([]));
  });

  // --- Clean request body ---

  it('should not include undefined keys in the request body', () => {
    service.getSuggestions('test', baseConfig).subscribe();

    const req = httpMock.expectOne(API_BASE + 'address');
    const bodyKeys = Object.keys(req.request.body);
    expect(bodyKeys).toContain('query');
    expect(bodyKeys).toContain('count');
    // All optional keys that were not set should be absent
    expect(bodyKeys).not.toContain('locations');
    expect(bodyKeys).not.toContain('locations_boost');
    expect(bodyKeys).not.toContain('from_bound');
    expect(bodyKeys).not.toContain('to_bound');
    expect(bodyKeys).not.toContain('restrict_value');
    expect(bodyKeys).not.toContain('language');
    expect(bodyKeys).not.toContain('locations_geo');
    expect(bodyKeys).not.toContain('division');
    expect(bodyKeys).not.toContain('type');
    expect(bodyKeys).not.toContain('status');
    expect(bodyKeys).not.toContain('okved');
    expect(bodyKeys).not.toContain('branch_type');
    expect(bodyKeys).not.toContain('gender');
    expect(bodyKeys).not.toContain('parts');
    req.flush(makeResponse([]));
  });

  it('should only include provided params — address with restrictValue and language', () => {
    const config: DadataConfig = {
      ...baseConfig,
      restrictValue: true,
      language: 'en',
    };
    service.getSuggestions('test', config).subscribe();

    const req = httpMock.expectOne(API_BASE + 'address');
    const bodyKeys = Object.keys(req.request.body);
    expect(bodyKeys).toEqual(expect.arrayContaining(['query', 'count', 'restrict_value', 'language']));
    expect(bodyKeys).not.toContain('division');
    expect(bodyKeys).not.toContain('type');
    expect(bodyKeys).not.toContain('gender');
    req.flush(makeResponse([]));
  });

  // --- Response handling ---

  it('should return suggestions array from response', () => {
    const suggestions = [
      makeAddressSuggestion('Moscow, Russia'),
      makeAddressSuggestion('Moscow region'),
    ];

    let result: DadataSuggestion[] = [];
    service.getSuggestions('Moscow', baseConfig).subscribe((data) => {
      result = data;
    });

    const req = httpMock.expectOne(API_BASE + 'address');
    req.flush(makeResponse(suggestions));

    expect(result).toEqual(suggestions);
    expect(result.length).toBe(2);
  });

  it('should return empty array when response has no suggestions', () => {
    let result: DadataSuggestion[] | undefined;
    service.getSuggestions('xyz', baseConfig).subscribe((data) => {
      result = data;
    });

    const req = httpMock.expectOne(API_BASE + 'address');
    req.flush(makeResponse([]));

    expect(result).toEqual([]);
  });

  // --- Error handling ---

  it('should return empty array on HTTP 500 error', () => {
    let result: DadataSuggestion[] | undefined;
    service.getSuggestions('test', baseConfig).subscribe((data) => {
      result = data;
    });

    const req = httpMock.expectOne(API_BASE + 'address');
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });

    expect(result).toEqual([]);
  });

  it('should return empty array on HTTP 401 error', () => {
    let result: DadataSuggestion[] | undefined;
    service.getSuggestions('test', baseConfig).subscribe((data) => {
      result = data;
    });

    const req = httpMock.expectOne(API_BASE + 'address');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(result).toEqual([]);
  });

  it('should return empty array on HTTP 403 error', () => {
    let result: DadataSuggestion[] | undefined;
    service.getSuggestions('test', baseConfig).subscribe((data) => {
      result = data;
    });

    const req = httpMock.expectOne(API_BASE + 'address');
    req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });

    expect(result).toEqual([]);
  });

  it('should return empty array on network error', () => {
    let result: DadataSuggestion[] | undefined;
    service.getSuggestions('test', baseConfig).subscribe((data) => {
      result = data;
    });

    const req = httpMock.expectOne(API_BASE + 'address');
    req.error(new ProgressEvent('error'));

    expect(result).toEqual([]);
  });

  it('should not throw on error — completes normally', () => {
    let completed = false;
    let errored = false;

    service.getSuggestions('test', baseConfig).subscribe({
      complete: () => { completed = true; },
      error: () => { errored = true; },
    });

    const req = httpMock.expectOne(API_BASE + 'address');
    req.flush('Fail', { status: 500, statusText: 'Internal Server Error' });

    expect(errored).toBe(false);
    expect(completed).toBe(true);
  });
});
