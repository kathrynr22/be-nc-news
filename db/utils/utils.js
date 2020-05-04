// This utility function should be able to take an array(`list`) of objects and return a new array.Each item in the new array must have its timestamp converted into a Javascript date object.Everything else in each item must be maintained.

//   _hint: Think carefully about how you can test that this has worked - it's not by copying and pasting a sql timestamp from the terminal into your test_

//NB MAY HAVE TO REARRANGE IN RIGHT ORDER NOT SURE IF IT WILL WORK IN THIS ORDER TRY AND SEE

exports.formatDates = list => {

  const newArray = list.map(obj => ({
    title: obj.title,
    body: obj.body,
    votes: obj.votes,
    topic: obj.topic,
    author: obj.author,
    created_at: new Date(obj.created_at),
  }));
  return newArray;
};


// This utility function should be able to take an array(`list`) of objects and return a reference object.The reference object must be keyed by each item's title, with the values being each item's corresponding id.e.g.

// `[{ article_id: 1, title: 'A' }]`

// will become

//   `{ A: 1 }`

// ---

exports.makeRefObj = list => { };

// This utility function should be able to take an array of comment objects(`comments`) and a reference object, and return a new array of formatted comments.

// Each formatted comment must have:

// - Its`created_by` property renamed to an`author` key
//   - Its`belongs_to` property renamed to an`article_id` key
//     - The value of the new `article_id` key must be the id corresponding to the original title value provided
//       - Its`created_at` value converted into a javascript date object
//         - The rest of the comment's properties must be maintained

exports.formatComments = (comments, articleRef) => { };
