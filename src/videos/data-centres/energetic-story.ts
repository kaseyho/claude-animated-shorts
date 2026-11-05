// Measured energetic narration timing.
export const SHOTS = [
  {
    "id": 1,
    "start": 0.0,
    "duration": 5.266666666666667,
    "a": 0,
    "b": 158
  },
  {
    "id": 2,
    "start": 5.266666666666667,
    "duration": 5.633333333333334,
    "a": 158,
    "b": 327
  },
  {
    "id": 3,
    "start": 10.9,
    "duration": 4.8,
    "a": 327,
    "b": 471
  },
  {
    "id": 4,
    "start": 15.7,
    "duration": 4.6,
    "a": 471,
    "b": 609
  },
  {
    "id": 5,
    "start": 20.3,
    "duration": 6.933333333333334,
    "a": 609,
    "b": 817
  },
  {
    "id": 6,
    "start": 27.233333333333334,
    "duration": 5.566666666666666,
    "a": 817,
    "b": 984
  },
  {
    "id": 7,
    "start": 32.8,
    "duration": 5.466666666666667,
    "a": 984,
    "b": 1148
  },
  {
    "id": 8,
    "start": 38.266666666666666,
    "duration": 6.966666666666667,
    "a": 1148,
    "b": 1357
  },
  {
    "id": 9,
    "start": 45.233333333333334,
    "duration": 7.033333333333333,
    "a": 1357,
    "b": 1568
  },
  {
    "id": 10,
    "start": 52.266666666666666,
    "duration": 5.733333333333333,
    "a": 1568,
    "b": 1740
  }
];
export const TOTAL = 1740;
export const shotAt = (frame: number) => [...SHOTS].reverse().find((shot) => frame >= shot.a) ?? SHOTS[0];
