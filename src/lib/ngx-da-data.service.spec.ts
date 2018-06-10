import { TestBed, inject } from '@angular/core/testing';

import { NgxDaDataService } from './ngx-da-data.service';
import {HttpClientModule} from "@angular/common/http";

describe('NgxDaDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [NgxDaDataService]
    });
  });

  it('should be created', inject([NgxDaDataService], (service: NgxDaDataService) => {
    expect(service).toBeTruthy();
  }));
});
