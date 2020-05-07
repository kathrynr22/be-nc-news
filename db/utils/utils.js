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
    const newObj = { ...comment };

    newObj.article_id = articleRef[comment.belongs_to];
    delete newObj.belongs_to;
    newObj.created_at = new Date(newObj.created_at);
    newObj.author = newObj.created_by;
    delete newObj.created_by;
    return newObj;
  });
};
