import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxDaDataComponent } from './ngx-da-data.component';
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";

describe('NgxDaDataComponent', () => {
  let component: NgxDaDataComponent;
  let fixture: ComponentFixture<NgxDaDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, HttpClientModule],
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
