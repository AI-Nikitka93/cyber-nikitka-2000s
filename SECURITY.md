# 🛡️ Security Policy & Architecture Safeguards

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.x     | :white_check_mark: |
| 1.x     | :x:                |

## Security Posture & Defense-in-Depth

The **CyberNikitka 2000s** web portal implements multi-layered security practices to demonstrate production-grade defense-in-depth within a Web 1.0 aesthetic application:

1. **Client-Side Input Sanitization (XSS Protection)**
   - Mandatory HTML entity encoding via `escapeHtml()` across all user inputs (Guestbook reviews, forum posts, search queries, profile bio).
2. **Anti-Spam & Automated Bot Prevention**
   - Arithmetic retro-captcha validation (`2 + 3 = 5`) for interactive submission endpoints.
3. **Authentication & Password Security**
   - PBKDF2 / SHA-256 password hashing with a 1000-iteration work factor and random 8-byte salt per user.
   - Crypto-random 24-byte bearer tokens (`cyb_...`) validated via `X-Cyber-Token` headers.
4. **Data Isolation & Cloud Database Protection**
   - Cloud DB hosted on Turso (libSQL) with encrypted connection streams.
   - Graceful local-fallback resilience (`data_backup.json` / LocalStorage) in case of cloud database connection outages.

## Vulnerability Disclosure Policy

This repository is a pet-project created for fun, nostalgic Web 1.0 reconstruction, and portfolio demonstration. If you discover a potential security vulnerability, please report it responsibly by contacting the maintainer.
