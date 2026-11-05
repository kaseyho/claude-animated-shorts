// Measured native speech timings; no time compression.
export const SHOTS = [
  {
    "id": 1,
    "start": 0.0,
    "duration": 6.9,
    "a": 0,
    "b": 207
  },
  {
    "id": 2,
    "start": 6.9,
    "duration": 6.633333333333334,
    "a": 207,
    "b": 406
  },
  {
    "id": 3,
    "start": 13.533333333333333,
    "duration": 8.766666666666667,
    "a": 406,
    "b": 669
  },
  {
    "id": 4,
    "start": 22.3,
    "duration": 5.5,
    "a": 669,
    "b": 834
  },
  {
    "id": 5,
    "start": 27.8,
    "duration": 6.966666666666667,
    "a": 834,
    "b": 1043
  },
  {
    "id": 6,
    "start": 34.766666666666666,
    "duration": 5.766666666666667,
    "a": 1043,
    "b": 1216
  },
  {
    "id": 7,
    "start": 40.53333333333333,
    "duration": 6.466666666666667,
    "a": 1216,
    "b": 1410
  },
  {
    "id": 8,
    "start": 47.0,
    "duration": 8.6,
    "a": 1410,
    "b": 1668
  },
  {
    "id": 9,
    "start": 55.6,
    "duration": 9.166666666666666,
    "a": 1668,
    "b": 1943
  },
  {
    "id": 10,
    "start": 64.76666666666667,
    "duration": 7.466666666666667,
    "a": 1943,
    "b": 2167
  }
];
export const TOTAL = 2167;
export const shotAt = (frame: number) => [...SHOTS].reverse().find((shot) => frame >= shot.a) ?? SHOTS[0];
