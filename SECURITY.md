# Security Policy

## Supported Versions

We release patches for security vulnerabilities in the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| 0.x.x   | :white_check_mark: (current development) |

## Reporting a Vulnerability

We take the security of Workout Timer seriously. If you discover a security vulnerability, please follow these steps:

### 1. Do NOT create a public GitHub issue

Security vulnerabilities should be reported privately to prevent malicious exploitation.

### 2. Email us directly

Send vulnerability reports to: security@workoutimer.dev

Include:
- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Suggested fix (if available)

### 3. Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 5 business days
- **Resolution Target**: Within 30 days for critical issues

### 4. Disclosure Process

1. **Report received**: We'll acknowledge receipt within 48 hours
2. **Validation**: We verify and assess the vulnerability
3. **Fix development**: We develop and test a fix
4. **Security advisory**: We'll create a GitHub Security Advisory
5. **Patch release**: Fix deployed in a new version
6. **Public disclosure**: After patch is available, we'll publicly disclose the issue

## Security Best Practices

When using Workout Timer in your applications:

1. **Keep dependencies updated**: Regularly update to the latest version
2. **Input validation**: Always validate user inputs when using timer configurations
3. **Environment security**: Secure your deployment environment
4. **HTTPS only**: Always serve your application over HTTPS in production

## Security Features

Our library includes:
- No external API calls or data transmission
- No use of eval() or dynamic code execution
- Strict TypeScript typing for type safety
- Regular dependency audits
- Automated security scanning in CI/CD

## Acknowledgments

We appreciate responsible disclosure and will acknowledge security researchers who:
- Follow this security policy
- Allow reasonable time for fixes
- Don't exploit vulnerabilities beyond proof of concept

Thank you for helping keep Workout Timer and its users safe!