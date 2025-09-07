# @workout-timer/react

## 0.0.2

### Patch Changes

- fix(react): correct countdown display rounding and instant completion
  - Remaining-time displays now use ceiling so the starting time shows for a full second
  - Elapsed-time displays continue to use floor
  - Phase shows "Complete!" immediately when remaining hits 0 to avoid a lingering 00:00 frame
