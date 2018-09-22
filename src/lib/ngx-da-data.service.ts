import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {DaDataResponse} from "./models/da-data-response";

export enum DaDataType {
  fio = "fio",
  address = "address",
  party = "party",
  bank = "bank",
  email = "email"
}

@Injectable({
  providedIn: 'root'
})
export class NgxDaDataService {
  apiKey = '';

  constructor(private http: HttpClient) { }

  setApiKey(key: string) {
    this.apiKey = key;
  }

  getData(value: string, type: DaDataType = DaDataType.address, count: number = 10, options: any = null): Observable<DaDataResponse>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type':  'application/json',
        'Authorization': 'Token ' + this.apiKey,
      })
    };
    const body = Object.assign({ query: value, count: count }, options);
    return this.http.post<DaDataResponse>("https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/" + type, body, httpOptions)
  }
}
