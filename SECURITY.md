# Security Policy

## Supported Versions

Currently, only the latest `main` branch is receiving security updates.

| Version | Supported          |
| ------- | ------------------ |
| v1.0.x  | :white_check_mark: |
| < v1.0  | :x:                |

## Reporting a Vulnerability

We take the security of TaskFlow AI seriously. If you discover a security vulnerability within this project, please send an e-mail to Om Chaddha at [omchaddha7@gmail.com](mailto:omchaddha7@gmail.com).

Please do **not** disclose the vulnerability publicly in the GitHub Issues tracker until we have had a chance to investigate and release a patch.

### What to include in your report

* A detailed description of the vulnerability.
* The steps to reproduce the vulnerability (proof of concept).
* Any potential impact or risk associated with the vulnerability.

### Response Time
We will strive to acknowledge your report within 48 hours and provide an estimated timeline for the fix. All security vulnerabilities will be treated with the highest priority.

## Safe Handling of API Keys
Please note that this repository does not track `.env` files. If you are forking or running this locally, ensure your `OPENAI_API_KEY` and `MONGO_URI` are never committed to version control.
