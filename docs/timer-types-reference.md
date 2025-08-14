# Timer Types Reference

## Popular Workout Timer Formats

### 1. AMRAP (As Many Rounds As Possible)
**Description:** Complete as many rounds of prescribed movements as possible within a time limit.

**Example:** 20-minute AMRAP of:
- 5 Pull-ups
- 10 Push-ups  
- 15 Squats

**Configuration:**
```typescript
{
  type: 'amrap',
  duration: 1200, // 20 minutes
  countdown: 10,
  movements: [
    { name: 'Pull-ups', reps: 5 },
    { name: 'Push-ups', reps: 10 },
    { name: 'Squats', reps: 15 }
  ]
}
```

### 2. EMOM (Every Minute On the Minute)
**Description:** Start a new round every minute. Rest the remainder of the minute after completing work.

**Example:** 10-minute EMOM:
- Even minutes: 10 Burpees
- Odd minutes: 15 Kettlebell Swings

**Configuration:**
```typescript
{
  type: 'emom',
  rounds: 10,
  interval: 60,
  alternating: [
    { name: 'Burpees', reps: 10 },
    { name: 'Kettlebell Swings', reps: 15 }
  ]
}
```

### 3. Tabata
**Description:** 8 rounds of 20 seconds work, 10 seconds rest (4 minutes total).

**Example:** Tabata Squats

**Configuration:**
```typescript
{
  type: 'tabata',
  workTime: 20,
  restTime: 10,
  rounds: 8,
  movements: [{ name: 'Squats' }]
}
```

### 4. For Time
**Description:** Complete prescribed work as fast as possible, often with a time cap.

**Example:** For Time (20-minute cap):
- 21-15-9 reps of:
  - Thrusters
  - Pull-ups

**Configuration:**
```typescript
{
  type: 'forTime',
  timeCapMinutes: 20,
  rounds: [
    { reps: 21, movements: ['Thrusters', 'Pull-ups'] },
    { reps: 15, movements: ['Thrusters', 'Pull-ups'] },
    { reps: 9, movements: ['Thrusters', 'Pull-ups'] }
  ]
}
```

### 5. Intervals
**Description:** Custom work/rest intervals with configurable durations.

**Example:** 
- 3 rounds of:
  - 90 seconds work
  - 60 seconds rest

**Configuration:**
```typescript
{
  type: 'intervals',
  rounds: 3,
  intervals: [
    { name: 'Work', duration: 90, type: 'work' },
    { name: 'Rest', duration: 60, type: 'rest' }
  ]
}
```

### 6. E2MOM / E3MOM (Every 2/3 Minutes On the Minute)
**Description:** Similar to EMOM but with longer intervals.

**Configuration:**
```typescript
{
  type: 'emom',
  rounds: 5,
  interval: 120, // 2 minutes
  movements: [{ name: '400m Run' }]
}
```

### 7. Death By / Ascending Ladder
**Description:** Add reps each minute until failure.

**Example:** Death By Burpees (1 rep minute 1, 2 reps minute 2, etc.)

**Configuration:**
```typescript
{
  type: 'deathBy',
  movement: 'Burpees',
  startReps: 1,
  increment: 1,
  interval: 60
}
```

### 8. Fight Gone Bad
**Description:** 3 rounds of 5 stations, 1 minute each, with 1 minute rest between rounds.

**Configuration:**
```typescript
{
  type: 'stations',
  rounds: 3,
  workTime: 60,
  restBetweenRounds: 60,
  stations: [
    'Wall Balls',
    'Sumo Deadlift High Pull',
    'Box Jumps',
    'Push Press',
    'Row for Calories'
  ]
}
```

### 9. Chipper
**Description:** Complete a list of movements in order, chipping away at the total.

**Configuration:**
```typescript
{
  type: 'chipper',
  timeCapMinutes: 30,
  movements: [
    { name: 'Pull-ups', reps: 50 },
    { name: 'Push-ups', reps: 100 },
    { name: 'Sit-ups', reps: 150 },
    { name: 'Squats', reps: 200 }
  ]
}
```

### 10. Rounds for Time (RFT)
**Description:** Complete a specific number of rounds as fast as possible.

**Configuration:**
```typescript
{
  type: 'roundsForTime',
  rounds: 5,
  timeCapMinutes: 15,
  movements: [
    { name: 'Deadlifts', reps: 10 },
    { name: 'Box Jumps', reps: 15 },
    { name: 'Pull-ups', reps: 5 }
  ]
}
```

## Triathlon-Specific Timers

### 1. Brick Workout Timer
**Description:** Bike-to-run transition practice.

**Configuration:**
```typescript
{
  type: 'brick',
  segments: [
    { name: 'Bike', duration: 1800, type: 'work' }, // 30 min
    { name: 'Transition', duration: 60, type: 'transition' },
    { name: 'Run', duration: 900, type: 'work' } // 15 min
  ]
}
```

### 2. Swim Interval Timer
**Description:** Pool swim intervals with rest.

**Configuration:**
```typescript
{
  type: 'swimIntervals',
  sets: 8,
  workDistance: 100, // meters
  paceTime: 90, // seconds
  restTime: 20
}
```

### 3. Track Workout Timer
**Description:** Running track intervals.

**Configuration:**
```typescript
{
  type: 'track',
  warmup: 600, // 10 min
  sets: [
    { distance: 400, targetTime: 90, rest: 90 },
    { distance: 400, targetTime: 90, rest: 90 },
    { distance: 800, targetTime: 210, rest: 120 },
    { distance: 400, targetTime: 90, rest: 90 },
    { distance: 400, targetTime: 90, rest: 90 }
  ],
  cooldown: 600 // 10 min
}
```

## Audio Cue Patterns

### Standard Cues
- **Start countdown:** "3... 2... 1... Go!"
- **Halfway:** "Halfway!"
- **Last 10 seconds:** Beep each second
- **Last 3 seconds:** Triple beep
- **Finish:** Long beep or bell

### EMOM-Specific Cues
- **10 seconds warning:** Single beep
- **5 seconds warning:** Double beep
- **New minute:** "Go!"

### Tabata-Specific Cues
- **Work starting:** "Work!"
- **Rest starting:** "Rest!"
- **Round announcement:** "Round 3 of 8"

## Display Modes

### 1. Count Up
Show elapsed time (0:00 → target)

### 2. Count Down
Show remaining time (target → 0:00)

### 3. Split Display
Show both elapsed and remaining

### 4. Round Display
Show current round and total rounds

### 5. Interval Display
Show current interval name and time

## User Preferences

### Visual Preferences
```typescript
interface VisualPreferences {
  displayMode: 'countUp' | 'countDown' | 'split';
  showMilliseconds: boolean;
  showProgressBar: boolean;
  showRoundCounter: boolean;
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
}
```

### Audio Preferences
```typescript
interface AudioPreferences {
  enabled: boolean;
  volume: number; // 0-100
  countdown: boolean;
  intervalAlerts: boolean;
  halfwayAlert: boolean;
  lastTenSeconds: boolean;
  voice: 'male' | 'female' | 'beeps';
}
```

### Haptic Preferences (Mobile)
```typescript
interface HapticPreferences {
  enabled: boolean;
  intensity: 'light' | 'medium' | 'heavy';
  intervalVibration: boolean;
  countdownVibration: boolean;
}
```