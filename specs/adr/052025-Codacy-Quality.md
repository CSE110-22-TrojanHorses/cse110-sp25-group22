---
status: "{accepted}"
date: { 2025-05-20 }
decision-makers: { Ada He, Andrew Lam }
---

Note: tool was adopted 5/20, this document was commited late

# Use Codacy for Cross-File Quality Checking

## Context and Problem Statement

How do we ensure that the code across files stays readable, organized, and redundancy free post-commit, before we merge anything? Code quality checkers through 3rd party groups visualize

## Decision Drivers

- Is there extensive documentation that we can rely on?
- Can we customize the quality gates (say we want to allow files longer than 50 lines of code)
- Can the tool easily be added into Github Actions, or integrated with our repository to check quality for every pull request?
- Can we check as many pull requests as we put out in a day for quality?

## Considered Options

- DeepSource
- Codacy
- CodeClimate

## Decision Outcome

Chosen option: Codacy, because there was extensive documentation and guidelines on how to customize the quality gates for your project, and because for small teams, you can access all needed functionality with a free plan. It also integrates easily with Github repositories to check across files.

### Consequences

- Good, because of enforced code cleanliness and concision
- Good, because it prompts us to be intentional with the code we write
- Bad, because only a few team members at a time can view the full quality analysis
- Bad, because the code line limit may feel restrictive and there may be a learning curve for understanding why some Codacy checks of code don't pass

### Confirmation

Codacy has been integrated with our repo; it's operationality has been confirmed with the past 3 pull requests we've made. Quality gates are set to block merges if there are any minor errors, and to restrict code files to 200 lines max to enforce readibility. It flags unused lines of code and any duplications, while ESLint and Prettier catch and fix syntax errors.

## Pros and Cons of the Options

### Codacy

- Good, because it's intended to be easy to use with one-click integration
- Good, because it has clear and extensive documentation
- Good, because it can be integrated with Github repositories to run checks on every branch w/o needing to be added to Github actions
- Good, because there's a free plan that covers all the quality checking needs of small teams
- Neutral, because it checks across languages and gathers user analytics data

### DeepSource

- Good, because it's beginner friendly
- Neutral, because there's AI assisted quality-improvement recommendations
- Bad, because we would have to use a 3 week free trial on someone's credit card account to use it
- Bad, because there doesn't seem to be a lot of documentation on its usage

### CodeClimate

- Good, because it offers test coverage analysis AND team performance insights (tracking contributions)
- Good, because it has extensive documentation and a relatively large user community
- Neutral, because it must be integrated with Github Actions to do automated checking
- Bad, because many features are paywalled
- Bad, because the free plan's analysis scope is limited, and the number of checks it can do in a day is limited
