import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {DadataResponse} from './models/dadata-response';
import {Locations} from './dadata-config';

export enum DadataType {
  fio = 'fio',
  address = 'address',
  party = 'party',
  bank = 'bank',
  email = 'email'
}

@Injectable({
  providedIn: 'root'
})
export class NgxDadataService {
  apiKey = '';

  constructor(private http: HttpClient) {
  }

  setApiKey(key: string) {
    this.apiKey = key;
  }

  // tslint:disable-next-line:max-line-length
  getData(value: string, type: DadataType = DadataType.address, count: number = 10, locations: Locations[] = null): Observable<DadataResponse> {
    const httpOptions = {
      headers: new HttpHeaders({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Token ' + this.apiKey,
      })
    };
    const body = Object.assign({query: value, count, locations});
    return this.http.post<DadataResponse>('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/' + type, body, httpOptions);
  }
}
