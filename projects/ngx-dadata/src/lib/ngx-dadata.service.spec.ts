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
