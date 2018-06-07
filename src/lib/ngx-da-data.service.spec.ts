import { TestBed, inject } from '@angular/core/testing';

import { NgxDaDataService } from './ngx-da-data.service';

describe('NgxDaDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgxDaDataService]
    });
  });

  it('should be created', inject([NgxDaDataService], (service: NgxDaDataService) => {
    expect(service).toBeTruthy();
  }));
});
