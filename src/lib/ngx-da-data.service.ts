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

  constructor(private http: HttpClient) { }

  getData(value: string, type: DaDataType = DaDataType.address, count: number = 10): Observable<DaDataResponse>{
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type':  'application/json',
        'Authorization': 'Token 2e51c5fbc1a60bd48face95951108560bf03f7d9'
      })
    };
    const body = { query: value, count: count };
    return this.http.post<DaDataResponse>("https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/" + type, body, httpOptions)
  }
}
