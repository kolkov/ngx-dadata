import {DadataConfigDefault} from './dadata-config';
import {DadataType} from '../public-api';

describe('ngx-dadata-config', () => {
  it('should have sensible default values', () => {
    const config = DadataConfigDefault;

    expect(config.apiKey).toBe('');
    expect(config.type).toBe(DadataType.address);
    expect(config.delay).toBe(500);
    expect(config.limit).toBe(10);
  });
});
