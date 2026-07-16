# Repository contribution rules

## Pre-commit quality gate

- Husky runs `npm run lint` and Prettier validation for staged files before every commit.
- Run `npm run format` before committing formatting work and `npm run format:check` when validating the whole repository.

## Commit and release-note policy

- If a change is exclusively mechanical Prettier formatting, amend the current relevant commit. Do not create a standalone feature or bug-fix commit, and do not add release notes.
- If a change fixes a lint issue, treat it as a **bug fix**: use a `fix:`-style commit message and add a matching patch release note to `README.md`.
- If a change includes both formatting and functional/lint fixes, keep the formatting with the relevant fix commit and follow the bug-fix release-note rule.
- Do not amend a commit that has already been pushed unless the user explicitly asks for history rewriting. For pushed formatting-only changes, create a `chore:` commit instead.

## UX and validation policy

- Never solve a validation bug by broadly blocking or removing a user interaction merely because it is easier to implement.
- Preserve available input methods, including keyboard, paste, pointer, and assistive technology, unless a restriction is intrinsic to the product requirement and is communicated clearly.
- Prefer immediate, accessible validation feedback that explains the issue and how to resolve it. Validate again on submission as a safety net.
- For every form change, test both successful submission and each invalid field independently. At minimum cover empty required fields, malformed values, boundary values, and invalid option selections.
- Do not claim form validation is complete until those negative paths are automated or explicitly verified in the browser.
- When an invalid field becomes valid, verify that its field-level error and any now-obsolete form-level error clear without requiring another submit.
