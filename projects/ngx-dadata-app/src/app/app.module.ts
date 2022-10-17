import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NgxDadataModule } from 'projects/ngx-dadata/src/public-api';

@NgModule({
  imports:      [ BrowserModule, FormsModule, HttpClientModule, NgxDadataModule ],
  declarations: [ AppComponent],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
