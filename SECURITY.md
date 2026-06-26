# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.0.x   | :white_check_mark: |
| 1.0.x   | :x: (legacy)       |

## Reporting a Vulnerability

**DO NOT** open a public GitHub issue for security vulnerabilities.

Instead, please report security issues via:

1. **Private Security Advisory** (preferred):
   https://github.com/kolkov/ngx-dadata/security/advisories/new

2. **Email**: a.kolkov@gmail.com

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Affected versions
- Potential impact

### Response Timeline

- **Initial Response**: Within 72 hours
- **Fix & Disclosure**: Coordinated with reporter

## Security Considerations

ngx-dadata communicates with the Dadata.ru external API. Users should be aware of:

1. **API Keys** -- never hardcode API keys in source code. Use environment variables or runtime configuration.
2. **HTTPS** -- all API communication uses HTTPS. Do not override or proxy through insecure connections.
3. **Input Sanitization** -- suggestion values are rendered as text content, not innerHTML. XSS risk is minimal.
4. **CORS** -- the Dadata suggestions API supports CORS for browser-side usage. The cleaning API does not (server-side only).

## Security Contact

- **GitHub Security Advisory**: https://github.com/kolkov/ngx-dadata/security/advisories/new
- **Email**: a.kolkov@gmail.com
