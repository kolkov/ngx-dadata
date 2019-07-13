import { TestBed } from '@angular/core/testing';

import { NgxDadataService } from './ngx-dadata.service';
import {HttpClientModule} from '@angular/common/http';

describe('NgxDadataService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientModule ],
    providers: [NgxDadataService]
  }));

  it('should be created', () => {
    const service: NgxDadataService = TestBed.get(NgxDadataService);
    expect(service).toBeTruthy();
  });
});
