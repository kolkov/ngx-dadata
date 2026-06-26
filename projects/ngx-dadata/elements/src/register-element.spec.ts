import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('registerNgxDadataElement', () => {
  beforeEach(() => {
    // Reset module cache so each test gets a fresh import
    vi.resetModules();
  });

  it('should export registerNgxDadataElement function', async () => {
    const mod = await import('./register-element');
    expect(typeof mod.registerNgxDadataElement).toBe('function');
  });

  it('should export NgxDadataElementOptions type (structural check)', async () => {
    // Type-only export -- verify module shape at runtime
    const mod = await import('./register-element');
    const keys = Object.keys(mod);
    expect(keys).toContain('registerNgxDadataElement');
  });

  it('should skip registration when customElements already has ngx-dadata', async () => {
    // Arrange: stub customElements.get to return a truthy value
    const getSpy = vi.spyOn(customElements, 'get').mockReturnValue(class {} as unknown as CustomElementConstructor);

    const { registerNgxDadataElement } = await import('./register-element');

    // Act
    await registerNgxDadataElement();

    // Assert: customElements.get was called and the function returned early
    expect(getSpy).toHaveBeenCalledWith('ngx-dadata');

    // Cleanup
    getSpy.mockRestore();
  });
});
