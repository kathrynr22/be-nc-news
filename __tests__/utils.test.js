//const connection = require('../connection');

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
test('it does not mutate the original input testing an empty array', () => {
  const input = [];
  formatDates(input);
  expect(input).toEqual([]);
});

test('it does not mutate the original input testing actual data', () => {
  const input = [{
    title: 'Who Will Manage Your Club in 2021?',
    topic: 'football',
    author: 'happyamy2016',
    body:
      'Managerial changes are too common in the modern day game. Already in the 16/17 season, we have seen 14 managers lose their job from the Premier League to League Two. Swansea’s Francesco Guidolin became the first top division manager to lose his job but already question marks are raised regarding the future of the likes of David Moyes and Mike Phelan.',
    created_at: 1472144905177,
  },];
  formatDates(input);
  expect(input).toEqual([{
    title: 'Who Will Manage Your Club in 2021?',
    topic: 'football',
    author: 'happyamy2016',
    body:
      'Managerial changes are too common in the modern day game. Already in the 16/17 season, we have seen 14 managers lose their job from the Premier League to League Two. Swansea’s Francesco Guidolin became the first top division manager to lose his job but already question marks are raised regarding the future of the likes of David Moyes and Mike Phelan.',
    created_at: 1472144905177,
  },]);
});


describe('makeRefObj', () => { });

describe('formatComments', () => { });
