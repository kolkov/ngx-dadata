import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxDadataComponent } from './ngx-dadata.component';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';


describe('NgxDadataComponent', () => {
  let component: NgxDadataComponent;
  let fixture: ComponentFixture<NgxDadataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxDadataComponent ],
      imports: [ FormsModule, HttpClientModule ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxDadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
