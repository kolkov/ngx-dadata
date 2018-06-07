# ngx-dadata
Angular 6+ DaData implementation

## Getting Started

### Installation

Install via [npm][npm] package manager

```bash
npm install @kolkov/ngx-dadata --save
```

### Usage

Import `ngx-dadata` module

```typescript
import { NgxDaDataModule } from '@kolkov/ngx-dadata';

@NgModule({
  imports: [ NgxDaDataModule ]
})
```

Then in HTML

```html
<ngx-da-data [type]="config.type" [(ngModel)]="currentAddress"></ngx-da-data>
```

or

```html
<angular-editor formControlName="currentAddress" [config]="config"></angular-editor>
```

where

```typescript
import { DaDataConfig } from 'ngx-dadata';

...

config: DaDataConfig = {
    type: DaDataType.address
  };
```

For `ngModel` to work, you must import `FormsModule` from `@angular/forms`, or for `formControlName`, you must import `ReactiveFormsModule` from `@angular/forms`

## Demo
Demo is here [demo][demo]

Working code for this demo at stackblitz [example][example]

[npm]: https://www.npmjs.com/
[demo]: https://ngx-dadata.stackblitz.io/
[example]: https://stackblitz.com/edit/ngx-dadata
