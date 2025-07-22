# Security Policy

## Supported Versions

We provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security vulnerability in this project, please report it responsibly.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report security vulnerabilities by:

1. **Email**: Send an email to [security@example.com] with:
   - Subject line: "Security Vulnerability in utils"
   - Detailed description of the vulnerability
   - Steps to reproduce the issue
   - Potential impact assessment
   - Your contact information

2. **Private GitHub Security Advisory**: You can also report vulnerabilities through GitHub's private vulnerability reporting feature by visiting the Security tab of this repository.

### What to Include

When reporting a vulnerability, please include:

- **Type of issue** (e.g., buffer overflow, SQL injection, cross-site scripting)
- **Full paths of source file(s)** related to the manifestation of the issue
- **Location of the affected source code** (tag/branch/commit or direct URL)
- **Step-by-step instructions** to reproduce the issue
- **Proof-of-concept or exploit code** (if possible)
- **Impact assessment** - how an attacker might exploit this issue

### Response Timeline

We will respond to security vulnerability reports according to the following timeline:

- **Initial Response**: Within 48 hours of receiving the report
- **Status Update**: Within 7 days with an initial assessment
- **Resolution**: We aim to resolve critical vulnerabilities within 30 days

### Our Commitment

When you report a security vulnerability:

1. **Acknowledgment**: We will acknowledge receipt of your report within 48 hours
2. **Regular Updates**: We will keep you informed of our progress
3. **Credit**: We will publicly credit you for the discovery (unless you prefer to remain anonymous)
4. **Coordinated Disclosure**: We will work with you to ensure responsible disclosure

## Security Best Practices

### For Contributors

When contributing to this project:

1. **Input Validation**: Always validate and sanitize user inputs
2. **Dependencies**: Keep dependencies up to date and audit regularly
3. **Secrets**: Never commit secrets, API keys, or sensitive data
4. **Error Handling**: Don't expose sensitive information in error messages
5. **Path Traversal**: Validate file paths to prevent directory traversal attacks

### For Users

When using this library:

1. **Keep Updated**: Use the latest version and apply security updates promptly
2. **Dependency Auditing**: Regularly audit your dependencies with `pnpm audit`
3. **Input Sanitization**: Always validate data before passing it to utility functions
4. **Environment Variables**: Store sensitive configuration in environment variables

## Security Features

### Package-Level Security

- **Universal Package**: No dependencies, reducing attack surface
- **Type Safety**: TypeScript provides compile-time type checking
- **Input Validation**: Utilities include runtime type checking where appropriate
- **Sanitization**: String utilities include character filtering options

### Development Security

- **Dependency Scanning**: Automated dependency vulnerability scanning
- **Code Analysis**: ESLint rules help prevent common security issues
- **Test Coverage**: Comprehensive tests help catch security regressions

## Known Security Considerations

### Browser Package

- **DOM Manipulation**: Functions that manipulate DOM should be used carefully to prevent XSS
- **URL Handling**: Be cautious when opening URLs programmatically
- **Local Storage**: Data stored in browser storage is accessible to scripts

### Node Package

- **File System**: File operations should validate paths to prevent traversal attacks
- **Command Execution**: Use exec utilities with caution and validate inputs
- **JWT Tokens**: The JWT utilities are for development only - use production-ready solutions

### Universal Package

- **Regular Expressions**: Some utilities use regex - be aware of ReDoS vulnerabilities
- **Type Coercion**: Be careful with automatic type conversion utilities

## Vulnerability Disclosure Policy

### Scope

This security policy applies to:

- All packages in this monorepo
- Documentation and configuration files
- Build and deployment scripts

### Out of Scope

The following are generally out of scope:

- Vulnerabilities in third-party dependencies (report to the respective maintainers)
- Issues that require physical access to a user's device
- Social engineering attacks
- Issues in outdated or unsupported versions

### Public Disclosure

After a security issue has been fixed:

1. We will publish a security advisory on GitHub
2. The vulnerability will be described in release notes
3. Credit will be given to the reporter (if desired)
4. We may publish a blog post explaining the issue and fix

## Security Updates

Security updates will be:

1. **Prioritized**: Security fixes take precedence over feature development
2. **Backward Compatible**: When possible, security fixes maintain API compatibility
3. **Documented**: All security updates are documented in release notes
4. **Communicated**: Critical security updates are announced through multiple channels

## Contact

For security-related questions that are not vulnerabilities:

- **General Security Questions**: Open a GitHub Discussion
- **Security Policy Questions**: Create a GitHub issue with the "security" label
- **Private Security Concerns**: Email [security@example.com]

## Acknowledgments

We would like to thank the following people for responsibly disclosing security vulnerabilities:

<!-- Future security researchers will be listed here -->

---

**Note**: This security policy is subject to change. Please check back regularly for updates.