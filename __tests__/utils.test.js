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
  })
  test('reformats the date', () => {
    const input = [{
      title: 'Who Will Manage Your Club in 2021?',
      topic: 'football',
      author: 'happyamy2016',
      body:
        'Managerial changes are too common in the modern day game. Already in the 16/17 season, we have seen 14 managers lose their job from the Premier League to League Two. Swansea’s Francesco Guidolin became the first top division manager to lose his job but already question marks are raised regarding the future of the likes of David Moyes and Mike Phelan.',
      created_at: 1472144905177,
    },];
    const formattedInput = formatDates(input);
    expect(typeof formattedInput[0].created_at).not.toEqual('number');
    expect(typeof formattedInput[0].created_at).toEqual('object');
    expect(formattedInput[0].created_at).toEqual(new Date(input[0].created_at));
  })
})
describe('makeRefObj', () => {
  test('returns an empty object, when passed an empty array', () => {
    const list = [];
    const actual = makeRefObj(list);
    const expected = {};
    expect(actual).toEqual(expected);
  });
  test('it does not mutate the original input', () => {
    const list = [];
    makeRefObj(list, 'article_id', 'title');
    expect(list).toEqual([]);
  });
  test('it creates a reference object', () => {
    const list =
      [{ article_id: 1, title: 'A' }];
    expect(makeRefObj(list, 'title', 'article_id')).toEqual({ A: 1 })
  });
})

describe('formatComments', () => {
  test('returns an empty array when passed an empty array', () => {
    expect(formatComments([])).toEqual([]);
  })
  test('returns a new array', () => {
    const input = [];
    expect(formatComments(input)).not.toBe(input)
  })
  test('it does not mutate the original input testing an empty array', () => {
    const input = [];
    formatComments(input);
    expect(input).toEqual([]);
  });
  test('returns a new empty array, when passed an empty array', () => {
    const comments = [];
    const articleRef = {};
    const actual = formatComments(comments, articleRef);
    const expected = [];
    expect(actual).toEqual(expected);
    expect(actual).not.toBe(comments);
  });
  test('it does not mutate the original comments and articleRef input', () => {
    const comments = [
      {
        body: ' I carry a log — yes. Is it funny to you? It is not to me.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: -100,
        created_at: 1416746163389,
      },
    ];
    const articleRef = {
      A: 1
    };
    formatComments(comments, articleRef);
    expect(comments).toEqual([
      {
        body: ' I carry a log — yes. Is it funny to you? It is not to me.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: -100,
        created_at: 1416746163389,
      },
    ]);
    expect(articleRef).toEqual({
      A: 1
    })
  })
  test('it changes certain keys in each object within the comments array and references the lookup object', () => {
    const comments = [
      {
        body: ' I carry a log — yes. Is it funny to you? It is not to me.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'icellusedkars',
        votes: -100,
        created_at: 1416746163389,
      },
    ];
    const articleRef = {
      'Living in the shadow of a great man': 1
    };

    expect(formatComments(comments, articleRef)).toEqual([
      {
        body: ' I carry a log — yes. Is it funny to you? It is not to me.',
        votes: -100,
        created_at: new Date(1416746163389),
        article_id: 1,
        author: 'icellusedkars'
      },

    ]);
  })
})
