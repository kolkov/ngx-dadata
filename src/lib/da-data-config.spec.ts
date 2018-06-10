import {DaDataConfigDefault} from "./da-data-config";
import {DaDataType} from "../public_api";


describe('ngx-dadata-config', () => {
  it('should have sensible default values', () => {
    const config = DaDataConfigDefault;

    expect(config.apiKey).toBe("");
    expect(config.type).toBe(DaDataType.address);
    expect(config.delay).toBe(500);
    expect(config.limit).toBe(10);
  });
});
