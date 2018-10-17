const users = [
  {
    id: "1",
    name: "chris",
    email: "chris@test.com"
  },
  {
    id: "2",
    name: "mike",
    email: "mike@test.com"
  },
  {
    id: "3",
    name: "sara",
    email: "sara@test.com",
    age: 27
  }
];

const posts = [
  {
    id: "1",
    title: "titel1",
    body: "body1",
    published: true,
    author: "1"
  },
  {
    id: "2",
    title: "titel2",
    body: "body2",
    published: false,
    author: "1"
  },
  {
    id: "3",
    title: "titel3",
    body: "body3",
    published: true,
    author: "2"
  }
];

const comments = [
  {
    id: "1",
    text: "hello comment 1",
    author: "2",
    post: "2"
  },
  {
    id: "2",
    text: "hello comment 2",
    author: "1",
    post: "1"
  },
  {
    id: "3",
    text: "hello comment 3",
    author: "2",
    post: "3"
  },
  {
    id: "4",
    text: "hello comment 4",
    author: "1",
    post: "1"
  }
];

const db = {
  users,
  posts,
  comments
};

export { db as default };
