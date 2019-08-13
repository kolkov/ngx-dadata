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
import {DadataType, NgxDadataService} from './ngx-dadata.service';
import {Subject, timer} from 'rxjs';
import {debounce} from 'rxjs/operators';
import {DadataResponse} from './models/dadata-response';
import {DadataSuggestion} from './models/suggestion';
import {DadataConfig, DadataConfigDefault} from './dadata-config';
import {ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR} from '@angular/forms';

/*const NGX_DADATA_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => NgxDadataComponent),
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
  selector: 'ngx-dadata',
  templateUrl: './ngx-dadata.component.html',
  styleUrls: ['./ngx-dadata.component.scss'],
  providers: [
    {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NgxDadataComponent),
    multi: true
  }, /*NGX_DADATA_VALIDATOR*/]
})
export class NgxDadataComponent implements OnInit, ControlValueAccessor, OnChanges {
  private v: any = '';
  currentFocus = -1;

  data: DadataSuggestion[] = [];

  @Input() config: DadataConfig = DadataConfigDefault;
  @Input() apiKey: string;
  @Input() disabled = null;
  @Input() type = DadataType.address;
  @Input() limit = DadataConfigDefault.limit;
  @Input() placeholder = '';

  @Output() selectedSuggestion: DadataSuggestion;
  @Output() selected: EventEmitter<DadataSuggestion> = new EventEmitter<DadataSuggestion>();
  // @Output() selectedData = new EventEmitter<DaDataAddress | DaDataFIO | DaDataBank | DaDataParty | DaDataEmail>();
  // @Output() selectedString = new EventEmitter<string>();

  @ViewChild('inputValue', { static: true }) inputValue: ElementRef;

  private inputString$ = new Subject<string>();

  // onSuggestionSelected = (value: string) => {};
  onTouched = () => {};
  propagateChange: any = () => {};
  validateFn: any = () => {};

  constructor(private dataService: NgxDadataService, private r: Renderer2) {
  }

  get value(): any {
    return this.v;
  }

  set value(v: any) {
    if (v !== this.v) {
      this.v = v;
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
      this.dataService.getData(x, this.type, this.limit).subscribe((y: DadataResponse) => {
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

  onClick(e: MouseEvent, item: DadataSuggestion) {
    // e.preventDefault();
    this.inputValue.nativeElement.value = item.value;
    this.propagateChange(item.value);
    this.inputValue.nativeElement.focus();
    this.selectedSuggestion = item;
    this.data = [];
    this.currentFocus = -1;

    // this.writeValue(item.value);
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
    const activeEl = document.getElementById(id + 'item');
    this.r.addClass(activeEl, 'active');
  }

  removeFocus(id: number) {
    if (id !== -1) {
      const activeEl = document.getElementById(id + 'item');
      this.r.removeClass(activeEl, 'active');
    }
  }

  writeValue(value: any): void {
    if (value !== undefined) {
      this.v = value;
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
   * @param isDisabled Disabled state flag
   */
  setDisabledState(isDisabled: boolean): void {
    alert('disabled!');
    this.disabled = isDisabled;
  }
}
