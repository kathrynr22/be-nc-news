const {
  formatDates,
  makeRefObj,
  formatComments,
} = require('../db/utils/utils');

// This utility function should be able to take an array(`list`) of objects and return a new array.Each item in the new array must have its timestamp converted into a Javascript date object.Everything else in each item must be maintained.

//   _hint: Think carefully about how you can test that this has worked - it's not by copying and pasting a sql timestamp from the terminal into your test_

describe('formatDates', () => {
  test('returns an empty array when passed an empty array', () => {
    expect(formatDates([])).toEqual([]);
  })
  test('returns a new array', () => {
    const input = [];
    expect(formatDates(input)).not.toBe(input)
  })
});

describe('makeRefObj', () => { });

describe('formatComments', () => { });
