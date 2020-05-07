exports.formatDates = (list) => {
  const newArray = list.map((obj) => ({
    title: obj.title,
    topic: obj.topic,
    author: obj.author,
    body: obj.body,
    created_at: new Date(obj.created_at),
    votes: obj.votes,
  }));
  return newArray;
};

exports.makeRefObj = (list, stringKey, stringProp) => {
  let refObj = {};
  list.forEach((article) => (refObj[article[stringKey]] = article[stringProp]));
  return refObj;
};

exports.formatComments = (comments, articleRef) => {
  return comments.map((comment) => {
    const newArray = { ...comment };

    newArray.article_id = articleRef[comment.belongs_to];
    delete newArray.belongs_to;
    newArray.created_at = new Date(newArray.created_at);
    newArray.author = newArray.created_by;
    delete newArray.created_by;
    return newArray;
  });
};
