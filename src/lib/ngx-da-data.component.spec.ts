import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxDaDataComponent } from './ngx-da-data.component';

describe('NgxDaDataComponent', () => {
  let component: NgxDaDataComponent;
  let fixture: ComponentFixture<NgxDaDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxDaDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxDaDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
