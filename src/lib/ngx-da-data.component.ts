import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {DaDataType, NgxDaDataService} from "./ngx-da-data.service";
import {Subject, timer} from "rxjs";
import {debounce} from "rxjs/operators";
import {DaDataResponse} from "./models/da-data-response";
import {DaDataSuggestion} from "./models/suggestion";
import {DaDataConfig, DaDataConfigDefault} from "./da-data-config";
import {ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR} from "@angular/forms";
import {DaDataAddress, DaDataBank, DaDataEmail, DaDataFIO, DaDataParty} from "./models/data";

const NGX_DADATA_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NgxDaDataComponent),
  multi: true
};

/*const NGX_DADATA_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => NgxDaDataComponent),
  multi: true,
};*/

export function createDaDataValidator(value) {
  return (c: FormControl) => {
    const err = {
      rangeError: {
        given: c.value,
        expected: value,
      }
    };

    return (c.value !== value) ? err : null;
  };
}

@Component({
  selector: 'ngx-da-data',
  templateUrl: './ngx-da-data.component.html',
  styleUrls: ['./ngx-da-data.component.scss'],
  providers: [NGX_DADATA_VALUE_ACCESSOR, /*NGX_DADATA_VALIDATOR*/]
})
export class NgxDaDataComponent implements OnInit, ControlValueAccessor, OnChanges {
  private _value: any = '';
  currentFocus = -1;

  data: DaDataSuggestion[] = [];

  @Input() config: DaDataConfig = DaDataConfigDefault;
  @Input() apiKey: string;
  @Input() disabled = null;
  @Input() type = DaDataType.address;
  @Input() limit = DaDataConfigDefault.limit;
  @Input() placeholder = '';

  @Output() selectedSuggestion: DaDataSuggestion;
  @Output() selected = new EventEmitter<DaDataSuggestion>();
  // @Output() selectedData = new EventEmitter<DaDataAddress | DaDataFIO | DaDataBank | DaDataParty | DaDataEmail>();
  // @Output() selectedString = new EventEmitter<string>();

  @ViewChild('inputValue') inputValue: ElementRef;

  private inputString$ = new Subject<string>();

  // onSuggestionSelected = (value: string) => {};
  onTouched = () => {};
  propagateChange: any = () => {};
  validateFn: any = () => {};

  constructor(private dataService: NgxDaDataService, private _r: Renderer2) {
  }

  get value(): any {
    return this._value;
  }

  set value(v: any) {
    if (v !== this._value) {
      this._value = v;
      this.propagateChange(v);
    }
  }

  ngOnInit() {
    /*this.validateFn = createDaDataValidator(this._value);
    this.propagateChange(this._value);*/
    this.type = this.config.type;
    this.dataService.setApiKey(this.apiKey ? this.apiKey : this.config.apiKey);
    this.inputString$.pipe(
      debounce(() => timer(this.config.delay ? this.config.delay : 500)),
    ).subscribe(x => {
      this.dataService.getData(x, this.type, this.limit).subscribe((y: DaDataResponse) => {
        this.data = y.suggestions;
      });
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.value) {

    }
  }

  getData(value: string) {
    this.inputString$.next(value);
    this.currentFocus = -1;
  }

  onClick(e: MouseEvent, item: DaDataSuggestion) {
    //e.preventDefault();
    this.inputValue.nativeElement.value = item.value;
    this.propagateChange(item.value);
    this.inputValue.nativeElement.focus();
    this.selectedSuggestion = item;
    this.data = [];
    this.currentFocus = -1;

    //this.writeValue(item.value);
    this.selected.emit(item);
    // this.selectedData.emit(item.data);
    // this.selectedString.emit(item.value);
  }

  @HostListener('document:click')
  onOutsideClick() {
    this.data = [];
  }

  onArrowDown() {
    this.removeFocus(this.currentFocus);
    if (this.currentFocus >= this.data.length - 1) {
      this.currentFocus = 0;
    } else {
      this.currentFocus++;
    }
    this.setFocus(this.currentFocus);
  }

  onArrowUp() {
    this.removeFocus(this.currentFocus);
    if (this.currentFocus === 0) {
      this.currentFocus = this.data.length - 1;
    } else {
      this.currentFocus--;
    }
    this.setFocus(this.currentFocus);
  }

  onEnter() {
    this.selectedSuggestion = this.data[this.currentFocus];
    this.inputValue.nativeElement.value = this.selectedSuggestion.value;
    this.data = [];
    this.currentFocus = -1;
    this.propagateChange(this.selectedSuggestion.value);
    // this.writeValue(this.selectedSuggestion.value);
    this.selected.emit(this.selectedSuggestion);
    // this.selectedData.emit(this.selectedSuggestion.data);
    // this.selectedString.emit(this.selectedSuggestion.value);
  }

  setFocus(id: number) {
    const activeEl = document.getElementById(id + "item");
    this._r.addClass(activeEl, "active");
  }

  removeFocus(id: number) {
    if (id !== -1) {
      const activeEl = document.getElementById(id + "item");
      this._r.removeClass(activeEl, "active");
    }
  }

  writeValue(value: any): void {
    if (value !== undefined) {
      this._value = value;
    }
    // this.onSuggestionSelected(value);
  }

  /**
   * Set the function to be called
   * when the control receives a change event.
   *
   * @param fn a function
   */
  registerOnChange(fn: any): void {
    // this.onSuggestionSelected = fn;
    this.propagateChange = fn;
  }

  /**
   * Set the function to be called
   * when the control receives a touch event.
   *
   * @param fn a function
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Implements disabled state for this element
   *
   * @param isDisabled
   */
  setDisabledState(isDisabled: boolean): void {
    alert("disabled!");
    this.disabled = isDisabled;
  }
}
