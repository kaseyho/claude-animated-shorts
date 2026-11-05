// Measured narration timing; regenerate from production/data-centres/timeline.json.
export const FPS = 30;
export const SHOTS = [
  {
    "id": 1,
    "start": 0.0,
    "duration": 6.566666666666666,
    "a": 0,
    "b": 197
  },
  {
    "id": 2,
    "start": 6.566666666666666,
    "duration": 6.5,
    "a": 197,
    "b": 392
  },
  {
    "id": 3,
    "start": 13.066666666666666,
    "duration": 6.1,
    "a": 392,
    "b": 575
  },
  {
    "id": 4,
    "start": 19.166666666666668,
    "duration": 6.5,
    "a": 575,
    "b": 770
  },
  {
    "id": 5,
    "start": 25.666666666666668,
    "duration": 7.166666666666667,
    "a": 770,
    "b": 985
  },
  {
    "id": 6,
    "start": 32.833333333333336,
    "duration": 4.7,
    "a": 985,
    "b": 1126
  },
  {
    "id": 7,
    "start": 37.53333333333333,
    "duration": 6.5,
    "a": 1126,
    "b": 1321
  },
  {
    "id": 8,
    "start": 44.03333333333333,
    "duration": 7.433333333333334,
    "a": 1321,
    "b": 1544
  },
  {
    "id": 9,
    "start": 51.46666666666667,
    "duration": 7.133333333333334,
    "a": 1544,
    "b": 1758
  },
  {
    "id": 10,
    "start": 58.6,
    "duration": 6.4,
    "a": 1758,
    "b": 1950
  }
];
export const TOTAL = 1950;
export const shotAt = (frame: number) => [...SHOTS].reverse().find((shot) => frame >= shot.a) ?? SHOTS[0];
