# 新店申请转老店升级 Demo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a runnable Ant Design 5 React demo plus supporting docs for the “new store application -> old store upgrade” exam task.

**Architecture:** Create a single-page React + TypeScript app with an enterprise SaaS layout, a records table, a conversion modal, and a prefilled upgrade form. Drive all states from mock data so the demo can show both normal and exceptional flows without a backend.

**Tech Stack:** Vite, React, TypeScript, Ant Design 5, Vitest, Testing Library

---

### Task 1: Scaffold the demo app

**Files:**
- Create: `package.json`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`
- Create: `vitest.config.ts`

- [ ] Step 1: Scaffold a Vite React TypeScript app.
- [ ] Step 2: Install Ant Design, icons, and test dependencies.
- [ ] Step 3: Confirm the generated app starts before custom work begins.

### Task 2: Lock core behavior with failing tests

**Files:**
- Create: `src/__tests__/app.test.tsx`

- [ ] Step 1: Write a failing test that only eligible records show the `转老店升级` action.
- [ ] Step 2: Write a failing test that mismatched addresses block conversion and show an error.
- [ ] Step 3: Write a failing test that successful conversion opens the old-store-upgrade form with carried-over data.
- [ ] Step 4: Run the tests and confirm they fail for the expected reasons.

### Task 3: Build the application records experience

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

- [ ] Step 1: Implement the merchant console shell and filter area.
- [ ] Step 2: Implement the application records table with conditional row actions and status tags.
- [ ] Step 3: Add the conversion confirmation modal with address validation and empty-state handling.
- [ ] Step 4: Run the tests to verify the new behavior now passes where implemented.

### Task 4: Build the old-store-upgrade form

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

- [ ] Step 1: Implement the page header, source summary, and validation guidance.
- [ ] Step 2: Implement the prefilled form sections and required-field validation.
- [ ] Step 3: Implement submit success behavior that creates a new record and closes the original one.
- [ ] Step 4: Re-run the app tests and confirm they pass.

### Task 5: Write submission docs

**Files:**
- Create: `README.md`
- Create: `docs/design-rationale.md`
- Create: `docs/ai-workflow.md`

- [ ] Step 1: Document how to run the demo and what flows it covers.
- [ ] Step 2: Write the design rationale with key interaction rules and difficult points.
- [ ] Step 3: Write the AI workflow note with prompts, iterations, and manual refinements.

### Task 6: Verify handoff quality

**Files:**
- Modify: `README.md`
- Modify: `docs/design-rationale.md`
- Modify: `docs/ai-workflow.md`

- [ ] Step 1: Run the test suite.
- [ ] Step 2: Run the production build.
- [ ] Step 3: Review the deliverables against the exam checklist and patch any gaps.
