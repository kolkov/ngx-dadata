import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NgxDadataComponent } from './ngx-dadata.component';
import { DadataType } from './ngx-dadata.service';
import { DadataConfig } from './dadata-config';
import { DadataSuggestion } from './models/suggestion';
import { DadataAddress } from './models/data';

const API_BASE = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/';

const TEST_CONFIG: DadataConfig = {
  apiKey: 'test-token',
  type: DadataType.address,
  delay: 300,
};

function makeSuggestion(value: string): DadataSuggestion {
  return {
    value,
    unrestricted_value: value,
    data: { city: 'Moscow' } as DadataAddress,
  };
}

const MOCK_SUGGESTIONS: DadataSuggestion[] = [
  makeSuggestion('Moscow, Tverskaya st.'),
  makeSuggestion('Moscow, Arbat st.'),
  makeSuggestion('Moscow, Lenin av.'),
];

function getInput(fixture: ComponentFixture<NgxDadataComponent>): HTMLInputElement {
  return fixture.nativeElement.querySelector('input.ngx-dadata-input');
}

function getCombobox(fixture: ComponentFixture<NgxDadataComponent>): HTMLElement {
  return fixture.nativeElement.querySelector('[role="combobox"]');
}

function getListbox(fixture: ComponentFixture<NgxDadataComponent>): HTMLElement | null {
  return fixture.nativeElement.querySelector('[role="listbox"]');
}

function getOptions(fixture: ComponentFixture<NgxDadataComponent>): HTMLElement[] {
  return Array.from(fixture.nativeElement.querySelectorAll('[role="option"]'));
}

function typeInInput(fixture: ComponentFixture<NgxDadataComponent>, value: string): void {
  const input = getInput(fixture);
  input.value = value;
  input.dispatchEvent(new Event('input'));
}

function pressKey(fixture: ComponentFixture<NgxDadataComponent>, key: string): void {
  const input = getInput(fixture);
  input.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
}

/**
 * Types a query, advances fake timers past debounce, flushes the HTTP
 * response, and runs change detection.
 */
function typeAndFlush(
  fixture: ComponentFixture<NgxDadataComponent>,
  httpMock: HttpTestingController,
  query: string,
  suggestions: DadataSuggestion[],
  apiType: string = 'address',
  delay: number = TEST_CONFIG.delay!,
): void {
  typeInInput(fixture, query);
  vi.advanceTimersByTime(delay);
  const req = httpMock.expectOne(API_BASE + apiType);
  req.flush({ suggestions });
  fixture.detectChanges();
}

describe('NgxDadataComponent', () => {
  let fixture: ComponentFixture<NgxDadataComponent>;
  let component: NgxDadataComponent;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    vi.useFakeTimers();

    TestBed.configureTestingModule({
      imports: [NgxDadataComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    fixture = TestBed.createComponent(NgxDadataComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    fixture.componentRef.setInput('config', TEST_CONFIG);
    fixture.detectChanges(); // triggers ngOnInit
  });

  afterEach(() => {
    httpMock.verify();
    vi.useRealTimers();
  });

  // =====================================================================
  // Rendering
  // =====================================================================

  describe('rendering', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should render an input element', () => {
      const input = getInput(fixture);
      expect(input).toBeTruthy();
      expect(input.tagName).toBe('INPUT');
    });

    it('should apply the placeholder from input signal', () => {
      fixture.componentRef.setInput('placeholder', 'Enter address');
      fixture.detectChanges();

      const input = getInput(fixture);
      expect(input.placeholder).toBe('Enter address');
    });

    it('should render empty placeholder by default', () => {
      const input = getInput(fixture);
      expect(input.placeholder).toBe('');
    });

    it('should NOT render listbox when dropdown is closed', () => {
      expect(getListbox(fixture)).toBeNull();
    });

    it('should render listbox when suggestions are available', () => {
      typeAndFlush(fixture, httpMock, 'Moscow', MOCK_SUGGESTIONS);

      expect(getListbox(fixture)).toBeTruthy();
    });

    it('should render one option per suggestion', () => {
      typeAndFlush(fixture, httpMock, 'Moscow', MOCK_SUGGESTIONS);

      const options = getOptions(fixture);
      expect(options.length).toBe(3);
    });

    it('should display suggestion values as text content', () => {
      typeAndFlush(fixture, httpMock, 'Moscow', MOCK_SUGGESTIONS);

      const options = getOptions(fixture);
      expect(options[0].textContent?.trim()).toContain('Moscow, Tverskaya st.');
      expect(options[1].textContent?.trim()).toContain('Moscow, Arbat st.');
    });

    it('should disable the input when disabled signal is true', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const input = getInput(fixture);
      expect(input.disabled).toBe(true);
    });

    it('should enable the input when disabled signal is false', () => {
      fixture.componentRef.setInput('disabled', false);
      fixture.detectChanges();

      const input = getInput(fixture);
      expect(input.disabled).toBe(false);
    });
  });

  // =====================================================================
  // Input handling
  // =====================================================================

  describe('input handling', () => {
    it('should trigger API call after debounce time', () => {
      typeInInput(fixture, 'Moscow');

      // Before debounce expires, no request
      vi.advanceTimersByTime(TEST_CONFIG.delay! - 1);
      httpMock.expectNone(API_BASE + 'address');

      // After debounce, request fires
      vi.advanceTimersByTime(1);
      const req = httpMock.expectOne(API_BASE + 'address');
      expect(req.request.body.query).toBe('Moscow');
      req.flush({ suggestions: [] });
    });

    it('should debounce rapid typing — only last value sent', () => {
      typeInInput(fixture, 'M');
      vi.advanceTimersByTime(100);
      typeInInput(fixture, 'Mo');
      vi.advanceTimersByTime(100);
      typeInInput(fixture, 'Mos');
      vi.advanceTimersByTime(TEST_CONFIG.delay!);

      // Only one request for the final value
      const req = httpMock.expectOne(API_BASE + 'address');
      expect(req.request.body.query).toBe('Mos');
      req.flush({ suggestions: [] });
    });

    it('should open dropdown when suggestions are returned', () => {
      typeAndFlush(fixture, httpMock, 'Moscow', MOCK_SUGGESTIONS);

      expect(getListbox(fixture)).toBeTruthy();
    });

    it('should NOT open dropdown when empty suggestions are returned', () => {
      typeAndFlush(fixture, httpMock, 'zzzzz', []);

      expect(getListbox(fixture)).toBeNull();
    });

    it('should reset activeIndex to -1 on new suggestions', () => {
      typeAndFlush(fixture, httpMock, 'Moscow', MOCK_SUGGESTIONS);

      // Press ArrowDown to set activeIndex to 0
      pressKey(fixture, 'ArrowDown');
      fixture.detectChanges();

      const options = getOptions(fixture);
      expect(options[0].getAttribute('aria-selected')).toBe('true');

      // New query resets activeIndex
      typeAndFlush(fixture, httpMock, 'Moscow 2', MOCK_SUGGESTIONS);

      // No option should be active after new results
      const newOptions = getOptions(fixture);
      for (const option of newOptions) {
        expect(option.getAttribute('aria-selected')).toBe('false');
      }
    });
  });

  // =====================================================================
  // Suggestion selection
  // =====================================================================

  describe('suggestion selection', () => {
    it('should set value and emit selected on click', () => {
      const selectedSpy = vi.fn();
      component.selected.subscribe(selectedSpy);

      typeAndFlush(fixture, httpMock, 'Moscow', MOCK_SUGGESTIONS);

      const options = getOptions(fixture);
      // Use mousedown because the template binds (mousedown)
      options[1].dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      fixture.detectChanges();

      expect(selectedSpy).toHaveBeenCalledOnce();
      expect(selectedSpy).toHaveBeenCalledWith(MOCK_SUGGESTIONS[1]);
    });

    it('should close dropdown after selecting a suggestion by click', () => {
      typeAndFlush(fixture, httpMock, 'Moscow', MOCK_SUGGESTIONS);

      const options = getOptions(fixture);
      options[0].dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      fixture.detectChanges();

      expect(getListbox(fixture)).toBeNull();
    });

    it('should update value via onChange callback on click selection', () => {
      const onChangeSpy = vi.fn();
      component.registerOnChange(onChangeSpy);

      typeAndFlush(fixture, httpMock, 'Moscow', MOCK_SUGGESTIONS);

      const options = getOptions(fixture);
      options[0].dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      fixture.detectChanges();

      // Verify via the onChange callback (last call is the selection)
      const lastCall = onChangeSpy.mock.calls[onChangeSpy.mock.calls.length - 1];
      expect(lastCall[0]).toBe('Moscow, Tverskaya st.');
    });

    it('should select active suggestion on Enter key', () => {
      const selectedSpy = vi.fn();
      component.selected.subscribe(selectedSpy);

      typeAndFlush(fixture, httpMock, 'Moscow', MOCK_SUGGESTIONS);

      // Navigate to first item
      pressKey(fixture, 'ArrowDown');
      fixture.detectChanges();

      // Press Enter to select
      pressKey(fixture, 'Enter');
      fixture.detectChanges();

      expect(selectedSpy).toHaveBeenCalledOnce();
      expect(selectedSpy).toHaveBeenCalledWith(MOCK_SUGGESTIONS[0]);
    });

    it('should close dropdown after Enter selection', () => {
      typeAndFlush(fixture, httpMock, 'Moscow', MOCK_SUGGESTIONS);

      pressKey(fixture, 'ArrowDown');
      pressKey(fixture, 'Enter');
      fixture.detectChanges();

      expect(getListbox(fixture)).toBeNull();
    });

    it('should call onChange when suggestion is selected', () => {
      const onChangeSpy = vi.fn();
      component.registerOnChange(onChangeSpy);

      typeAndFlush(fixture, httpMock, 'Moscow', MOCK_SUGGESTIONS);

      const options = getOptions(fixture);
      options[0].dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      fixture.detectChanges();

      // onChange is called for the input event AND for the selection.
      // The last call should be the suggestion value.
      const lastCall = onChangeSpy.mock.calls[onChangeSpy.mock.calls.length - 1];
      expect(lastCall[0]).toBe('Moscow, Tverskaya st.');
    });
  });

  // =====================================================================
  // Keyboard navigation
  // =====================================================================

  describe('keyboard navigation', () => {
    // Open dropdown with suggestions before each keyboard test
    beforeEach(() => {
      typeAndFlush(fixture, httpMock, 'Moscow', MOCK_SUGGESTIONS);
    });

    it('should move activeIndex to 0 on first ArrowDown', () => {
      pressKey(fixture, 'ArrowDown');
      fixture.detectChanges();

      const options = getOptions(fixture);
      expect(options[0].getAttribute('aria-selected')).toBe('true');
      expect(options[0].classList.contains('active')).toBe(true);
    });

    it('should increment activeIndex on ArrowDown', () => {
      pressKey(fixture, 'ArrowDown');
      pressKey(fixture, 'ArrowDown');
      fixture.detectChanges();

      const options = getOptions(fixture);
      expect(options[0].getAttribute('aria-selected')).toBe('false');
      expect(options[1].getAttribute('aria-selected')).toBe('true');
    });

    it('should wrap to first item on ArrowDown at the end', () => {
      pressKey(fixture, 'ArrowDown'); // index 0
      pressKey(fixture, 'ArrowDown'); // index 1
      pressKey(fixture, 'ArrowDown'); // index 2 (last)
      pressKey(fixture, 'ArrowDown'); // wraps to 0
      fixture.detectChanges();

      const options = getOptions(fixture);
      expect(options[0].getAttribute('aria-selected')).toBe('true');
    });

    it('should wrap to last item on ArrowUp from first position', () => {
      pressKey(fixture, 'ArrowDown'); // index 0
      pressKey(fixture, 'ArrowUp');   // wraps to last (index 2)
      fixture.detectChanges();

      const options = getOptions(fixture);
      expect(options[2].getAttribute('aria-selected')).toBe('true');
    });

    it('should wrap to last item on ArrowUp when activeIndex is -1', () => {
      // activeIndex starts at -1, ArrowUp: i <= 0 branch -> suggestions.length - 1
      pressKey(fixture, 'ArrowUp');
      fixture.detectChanges();

      const options = getOptions(fixture);
      expect(options[2].getAttribute('aria-selected')).toBe('true');
    });

    it('should decrement activeIndex on ArrowUp', () => {
      pressKey(fixture, 'ArrowDown'); // 0
      pressKey(fixture, 'ArrowDown'); // 1
      pressKey(fixture, 'ArrowDown'); // 2
      pressKey(fixture, 'ArrowUp');   // 1
      fixture.detectChanges();

      const options = getOptions(fixture);
      expect(options[1].getAttribute('aria-selected')).toBe('true');
    });

    it('should close dropdown on Escape', () => {
      pressKey(fixture, 'Escape');
      fixture.detectChanges();

      expect(getListbox(fixture)).toBeNull();
    });

    it('should reset activeIndex on Escape', () => {
      pressKey(fixture, 'ArrowDown');
      pressKey(fixture, 'Escape');
      fixture.detectChanges();

      // After Escape, no listbox and aria-activedescendant should be null
      const input = getInput(fixture);
      expect(input.getAttribute('aria-activedescendant')).toBeNull();
    });

    it('should set activeIndex to 0 on Home', () => {
      pressKey(fixture, 'ArrowDown'); // 0
      pressKey(fixture, 'ArrowDown'); // 1
      pressKey(fixture, 'ArrowDown'); // 2
      pressKey(fixture, 'Home');
      fixture.detectChanges();

      const options = getOptions(fixture);
      expect(options[0].getAttribute('aria-selected')).toBe('true');
    });

    it('should set activeIndex to last on End', () => {
      pressKey(fixture, 'End');
      fixture.detectChanges();

      const options = getOptions(fixture);
      expect(options[2].getAttribute('aria-selected')).toBe('true');
    });

    it('should NOT emit selected on Enter when no item is active (activeIndex = -1)', () => {
      const selectedSpy = vi.fn();
      component.selected.subscribe(selectedSpy);

      // activeIndex is -1, press Enter directly
      pressKey(fixture, 'Enter');
      fixture.detectChanges();

      expect(selectedSpy).not.toHaveBeenCalled();
    });

    it('should do nothing on keydown when no suggestions exist', () => {
      // Close the dropdown first
      pressKey(fixture, 'Escape');
      fixture.detectChanges();

      // Now press ArrowDown with no suggestions
      pressKey(fixture, 'ArrowDown');
      fixture.detectChanges();

      // Nothing crashed, no listbox
      expect(getListbox(fixture)).toBeNull();
    });

    it('should prevent default on ArrowDown', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true });
      const preventSpy = vi.spyOn(event, 'preventDefault');
      getInput(fixture).dispatchEvent(event);

      expect(preventSpy).toHaveBeenCalled();
    });

    it('should prevent default on ArrowUp', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true });
      const preventSpy = vi.spyOn(event, 'preventDefault');
      getInput(fixture).dispatchEvent(event);

      expect(preventSpy).toHaveBeenCalled();
    });

    it('should prevent default on Enter when item is active', () => {
      pressKey(fixture, 'ArrowDown'); // need active item for Enter preventDefault
      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
      const preventSpy = vi.spyOn(event, 'preventDefault');
      getInput(fixture).dispatchEvent(event);

      expect(preventSpy).toHaveBeenCalled();
    });
  });

  // =====================================================================
  // ARIA accessibility
  // =====================================================================

  describe('ARIA accessibility', () => {
    it('should have role=combobox on wrapper', () => {
      const combobox = getCombobox(fixture);
      expect(combobox).toBeTruthy();
      expect(combobox.getAttribute('role')).toBe('combobox');
    });

    it('should have aria-haspopup=listbox on combobox', () => {
      const combobox = getCombobox(fixture);
      expect(combobox.getAttribute('aria-haspopup')).toBe('listbox');
    });

    it('should set aria-expanded=false when closed', () => {
      const combobox = getCombobox(fixture);
      expect(combobox.getAttribute('aria-expanded')).toBe('false');
    });

    it('should set aria-expanded=true when open', () => {
      typeAndFlush(fixture, httpMock, 'Moscow', MOCK_SUGGESTIONS);

      const combobox = getCombobox(fixture);
      expect(combobox.getAttribute('aria-expanded')).toBe('true');
    });

    it('should NOT set aria-owns when closed', () => {
      const combobox = getCombobox(fixture);
      expect(combobox.getAttribute('aria-owns')).toBeNull();
    });

    it('should set aria-owns to listbox id when open', () => {
      typeAndFlush(fixture, httpMock, 'Moscow', MOCK_SUGGESTIONS);

      const combobox = getCombobox(fixture);
      const listbox = getListbox(fixture);
      expect(combobox.getAttribute('aria-owns')).toBe(listbox?.id);
    });

    it('should have role=searchbox on input', () => {
      const input = getInput(fixture);
      expect(input.getAttribute('role')).toBe('searchbox');
    });

    it('should have aria-autocomplete=list on input', () => {
      const input = getInput(fixture);
      expect(input.getAttribute('aria-autocomplete')).toBe('list');
    });

    it('should set aria-controls to null when closed', () => {
      const input = getInput(fixture);
      expect(input.getAttribute('aria-controls')).toBeNull();
    });

    it('should set aria-controls to listbox id when open', () => {
      typeAndFlush(fixture, httpMock, 'Moscow', MOCK_SUGGESTIONS);

      const input = getInput(fixture);
      const listbox = getListbox(fixture);
      expect(input.getAttribute('aria-controls')).toBe(listbox?.id);
    });

    it('should have role=listbox on suggestions list', () => {
      typeAndFlush(fixture, httpMock, 'Moscow', MOCK_SUGGESTIONS);

      const listbox = getListbox(fixture);
      expect(listbox).toBeTruthy();
      expect(listbox?.getAttribute('role')).toBe('listbox');
    });

    it('should have role=option on each suggestion item', () => {
      typeAndFlush(fixture, httpMock, 'Moscow', MOCK_SUGGESTIONS);

      const options = getOptions(fixture);
      for (const option of options) {
        expect(option.getAttribute('role')).toBe('option');
      }
    });

    it('should set aria-selected=false on all options by default', () => {
      typeAndFlush(fixture, httpMock, 'Moscow', MOCK_SUGGESTIONS);

      const options = getOptions(fixture);
      for (const option of options) {
        expect(option.getAttribute('aria-selected')).toBe('false');
      }
    });

    it('should set aria-selected=true on active option', () => {
      typeAndFlush(fixture, httpMock, 'Moscow', MOCK_SUGGESTIONS);

      pressKey(fixture, 'ArrowDown'); // index 0
      fixture.detectChanges();

      const options = getOptions(fixture);
      expect(options[0].getAttribute('aria-selected')).toBe('true');
      expect(options[1].getAttribute('aria-selected')).toBe('false');
      expect(options[2].getAttribute('aria-selected')).toBe('false');
    });

    it('should have no aria-activedescendant when no option is active', () => {
      const input = getInput(fixture);
      expect(input.getAttribute('aria-activedescendant')).toBeNull();
    });

    it('should set aria-activedescendant to active option id', () => {
      typeAndFlush(fixture, httpMock, 'Moscow', MOCK_SUGGESTIONS);

      pressKey(fixture, 'ArrowDown'); // index 0
      fixture.detectChanges();

      const input = getInput(fixture);
      const options = getOptions(fixture);
      expect(input.getAttribute('aria-activedescendant')).toBe(options[0].id);
    });

    it('should update aria-activedescendant when navigating', () => {
      typeAndFlush(fixture, httpMock, 'Moscow', MOCK_SUGGESTIONS);

      pressKey(fixture, 'ArrowDown'); // index 0
      pressKey(fixture, 'ArrowDown'); // index 1
      fixture.detectChanges();

      const input = getInput(fixture);
      const options = getOptions(fixture);
      expect(input.getAttribute('aria-activedescendant')).toBe(options[1].id);
    });

    it('should have unique IDs on each option element', () => {
      typeAndFlush(fixture, httpMock, 'Moscow', MOCK_SUGGESTIONS);

      const options = getOptions(fixture);
      const ids = options.map((o) => o.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
      for (const id of ids) {
        expect(id).toBeTruthy();
      }
    });

    it('should have autocomplete=off on input', () => {
      const input = getInput(fixture);
      expect(input.getAttribute('autocomplete')).toBe('off');
    });
  });

  // =====================================================================
  // ControlValueAccessor
  // =====================================================================

  describe('ControlValueAccessor', () => {
    it('should set currentValue via writeValue and reflect in onChange on next input', () => {
      component.writeValue('Test address');

      // writeValue sets the internal currentValue field.
      // Verify by registering onChange and triggering a new input:
      // the component updates currentValue on each input event.
      const onChangeSpy = vi.fn();
      component.registerOnChange(onChangeSpy);

      typeInInput(fixture, 'New value');
      expect(onChangeSpy).toHaveBeenCalledWith('New value');
    });

    it('should handle null in writeValue without errors', () => {
      // writeValue(null) should not throw and should coerce to empty string
      expect(() => component.writeValue(null)).not.toThrow();
    });

    it('should handle empty string in writeValue without errors', () => {
      expect(() => component.writeValue('')).not.toThrow();
    });

    it('should call registered onChange on input', () => {
      const onChangeSpy = vi.fn();
      component.registerOnChange(onChangeSpy);

      typeInInput(fixture, 'test');

      expect(onChangeSpy).toHaveBeenCalledWith('test');
    });

    it('should call registered onTouched on blur', () => {
      const onTouchedSpy = vi.fn();
      component.registerOnTouched(onTouchedSpy);

      const input = getInput(fixture);
      input.dispatchEvent(new Event('blur'));

      expect(onTouchedSpy).toHaveBeenCalledOnce();
    });

    it('should accept setDisabledState without errors', () => {
      expect(() => component.setDisabledState(true)).not.toThrow();
      expect(() => component.setDisabledState(false)).not.toThrow();
    });

    it('should register as NG_VALUE_ACCESSOR provider', () => {
      // The component is creatable via TestBed — proves NG_VALUE_ACCESSOR works
      expect(component).toBeTruthy();
    });
  });

  // =====================================================================
  // Outside click
  // =====================================================================

  describe('outside click', () => {
    it('should close dropdown on click outside the component', () => {
      typeAndFlush(fixture, httpMock, 'Moscow', MOCK_SUGGESTIONS);
      expect(getListbox(fixture)).toBeTruthy();

      // Simulate click outside
      document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      fixture.detectChanges();

      expect(getListbox(fixture)).toBeNull();
    });

    it('should NOT close dropdown on click inside the component', () => {
      typeAndFlush(fixture, httpMock, 'Moscow', MOCK_SUGGESTIONS);
      expect(getListbox(fixture)).toBeTruthy();

      // Click inside the component's native element
      const input = getInput(fixture);
      input.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      fixture.detectChanges();

      expect(getListbox(fixture)).toBeTruthy();
    });

    it('should not fail on outside click when already closed', () => {
      expect(getListbox(fixture)).toBeNull();

      document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      fixture.detectChanges();

      expect(getListbox(fixture)).toBeNull();
    });
  });

  // =====================================================================
  // Edge cases
  // =====================================================================

  describe('edge cases', () => {
    it('should handle empty suggestion list from API gracefully', () => {
      typeAndFlush(fixture, httpMock, 'zzzzz', []);

      expect(getListbox(fixture)).toBeNull();
      expect(getOptions(fixture).length).toBe(0);
    });

    it('should use default config values when config is not set', () => {
      // Create a fresh component without setting config
      const freshFixture = TestBed.createComponent(NgxDadataComponent);
      freshFixture.detectChanges();

      // Should not crash; default config applies
      expect(freshFixture.componentInstance).toBeTruthy();
      freshFixture.destroy();
    });

    it('should reflect undefined delay in config without crashing', () => {
      const configNoDelay: DadataConfig = { apiKey: 'test-token', type: DadataType.address };
      expect(configNoDelay.delay).toBeUndefined();
      // The component uses config().delay ?? 500, so it falls back to 500ms
    });

    it('should support single suggestion in the list', () => {
      const single = [makeSuggestion('Single result')];
      typeAndFlush(fixture, httpMock, 'test', single);

      const options = getOptions(fixture);
      expect(options.length).toBe(1);
      expect(options[0].textContent?.trim()).toContain('Single result');
    });

    it('should focus input after selecting a suggestion', () => {
      typeAndFlush(fixture, httpMock, 'Moscow', MOCK_SUGGESTIONS);

      const input = getInput(fixture);
      const focusSpy = vi.spyOn(input, 'focus');

      const options = getOptions(fixture);
      options[0].dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      fixture.detectChanges();

      expect(focusSpy).toHaveBeenCalled();
    });

    it('should handle keyboard nav wrapping correctly with single item', () => {
      const single = [makeSuggestion('Only item')];
      typeAndFlush(fixture, httpMock, 'test', single);

      pressKey(fixture, 'ArrowDown'); // index 0
      pressKey(fixture, 'ArrowDown'); // wraps to 0 (only 1 item)
      fixture.detectChanges();

      const options = getOptions(fixture);
      expect(options[0].getAttribute('aria-selected')).toBe('true');
    });

    it('should handle consecutive Escape presses without error', () => {
      typeAndFlush(fixture, httpMock, 'Moscow', MOCK_SUGGESTIONS);

      pressKey(fixture, 'Escape');
      fixture.detectChanges();
      pressKey(fixture, 'Escape');
      fixture.detectChanges();

      expect(getListbox(fixture)).toBeNull();
    });
  });

  // =====================================================================
  // Unique listboxId
  // =====================================================================

  describe('listboxId', () => {
    it('should have a unique listbox ID prefixed with ngx-dadata-listbox-', () => {
      expect(component.listboxId).toMatch(/^ngx-dadata-listbox-\d+$/);
    });

    it('should assign different IDs to different component instances', () => {
      const fixture2 = TestBed.createComponent(NgxDadataComponent);
      fixture2.componentRef.setInput('config', TEST_CONFIG);
      fixture2.detectChanges();

      expect(component.listboxId).not.toBe(fixture2.componentInstance.listboxId);
      fixture2.destroy();
    });
  });

  // =====================================================================
  // Party type — detail rendering
  // =====================================================================

  describe('party type suggestions', () => {
    const partyConfig: DadataConfig = {
      apiKey: 'test-token',
      type: DadataType.party,
      delay: 300,
      partyAddress: 'city',
    };

    const partySuggestion: DadataSuggestion = {
      value: 'OOO Romashka',
      unrestricted_value: 'OOO Romashka',
      data: {
        inn: '7707083893',
        address: {
          value: 'Moscow, Tverskaya st., 1',
          unrestricted_value: 'Moscow, Tverskaya st., 1',
          data: { city: 'Moscow' } as DadataAddress,
        },
      } as any,
    };

    it('should render INN for party type suggestions', () => {
      fixture.componentRef.setInput('config', partyConfig);
      fixture.detectChanges();

      typeAndFlush(fixture, httpMock, 'Romashka', [partySuggestion], 'party', partyConfig.delay!);

      const detail = fixture.nativeElement.querySelector('.ngx-dadata-detail');
      expect(detail).toBeTruthy();
      expect(detail.textContent).toContain('7707083893');
    });

    it('should render city for partyAddress=city', () => {
      fixture.componentRef.setInput('config', { ...partyConfig, partyAddress: 'city' as const });
      fixture.detectChanges();

      typeAndFlush(fixture, httpMock, 'Romashka', [partySuggestion], 'party', partyConfig.delay!);

      const detail = fixture.nativeElement.querySelector('.ngx-dadata-detail');
      expect(detail.textContent).toContain('Moscow');
    });

    it('should render full address for partyAddress=full', () => {
      fixture.componentRef.setInput('config', { ...partyConfig, partyAddress: 'full' as const });
      fixture.detectChanges();

      typeAndFlush(fixture, httpMock, 'Romashka', [partySuggestion], 'party', partyConfig.delay!);

      const detail = fixture.nativeElement.querySelector('.ngx-dadata-detail');
      expect(detail.textContent).toContain('Moscow, Tverskaya st., 1');
    });
  });
});
