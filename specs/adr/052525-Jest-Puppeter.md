---
status: "{accepted}"
date: { 2025-05-25 }
decision-makers: { Ada He, Andrew Lam}
---

# Use Jest and Puppeteer for End-to-End Testing

## Context and Problem Statement

How do we ensure that user-facing features of our web application work correctly across real browser environments? Manual testing is slow, still risk human error and overall isnt efficent in this time frame. We need an automated end-to-end (E2E) testing solution allows us to simulate real user interactions in the browser to verify functionality. Jest and Puppeteer offer a fast, scriptable, and headless browser testing framework that integrates easily into modern JavaScript stacks.

## Decision Drivers

- Can simulate realistic user flows in a browser
- Fast execution time in headless mode
- Easy setup and integration with existing JS ecosystem
- Familiar API since we are using Jest for unit testing
- Supports CI/CD integration for automated pull request testing
- Do we have prior experience using it 

## Decision Outcome

Chosen option: **Jest + Puppeteer**, because we had experiences with this in Lab 7 and if needed can refer to that lab for troubleshooting

### Consequences

- ✅ Good, because we can simulate real user behavior in a headless browser to catch issues early
- ✅ Good, because tests can run quickly in CI pipelines using GitHub Actions
- ✅ Good, because the API is well-documented and widely adopted
- ✅ Good, because Jest and Puppeteer are flexible, and we can customize our E2E suite over time
- ⚠️ Bad, because Puppeteer only supports Chromium-based browsers (not Firefox/Safari) without extra setup

### Confirmation

To confirm implementation, leads will create a Jest + Puppeteer setup guide and distribute it to the team. The initial test suite will include a basic login flow and homepage render test. The test suite will be run in CI using GitHub Actions for all pull requests.

## Pros and Cons of the Options

### Cypress

- ✅ Good, because it's fully featured with automatic waiting, a test runner UI, and time travel debugging
- ✅ Good, because it has an excellent developer experience
- ⚠️ Bad, because it’s more heavyweight and less scriptable than Puppeteer
- ⚠️ Bad, because free version has limits for GitHub Actions cloud integration
- ⚠️ Bad, because tests are written differently than unit tests, so there's more context-switching

### Playwright

- ✅ Good, because it supports Chromium, Firefox, and WebKit
- ✅ Good, because of built-in parallelism and auto-waiting
- ⚠️ Bad, because it’s newer and less familiar than Jest for some devs
- ⚠️ Bad, because more boilerplate setup is needed compared to Puppeteer

### Puppeteer with Jest

- ✅ Good, because it’s lightweight and headless by default
- ✅ Good, because Jest is already in use for unit testing
- ✅ Good, because it’s highly scriptable and fast
- ⚠️ Bad, because test writing requires careful async handling
- ⚠️ Bad, because it only supports Chromium browsers out of the box

## More Information
