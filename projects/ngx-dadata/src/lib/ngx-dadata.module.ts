import { NgModule } from '@angular/core';
import { NgxDadataComponent } from './ngx-dadata.component';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [NgxDadataComponent],
  exports: [NgxDadataComponent]
})
export class NgxDadataModule { }
