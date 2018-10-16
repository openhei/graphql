import {
  GraphQLServer
} from "graphql-yoga";
import uuidv4 from "uuid/v4";

// demo user data
let users = [{
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

let posts = [{
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

let comments = [{
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
//type (schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    me: User!
    post: Post!
    comments: [Comment!]!
  }
  type Mutation {
    createUser(data: CreateUserInput!): User!
    createPost(data: CreatePostInput!): Post!
    createComment(data: CreateCommentInput!): Comment!
    deleteUser(id: ID!): User!
    deletePost(id: ID!): Post!
    deleteComment(id: ID!): Comment!

  }
  input CreateUserInput{
    name: String!
    email: String!
    age: Int
  }
  input CreatePostInput{
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }
  input CreateCommentInput{
    text: String!
     author: ID!
     post: ID!
  }
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }
  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }
  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
`;

//resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }
      return users.filter(user => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }
      return posts.filter(post => {
        return (
          post.title.toLowerCase().includes(args.query.toLowerCase()) ||
          post.body.toLowerCase().includes(args.query.toLowerCase())
        );
      });
    },
    me() {
      return {
        id: "123",
        name: "mike",
        email: "example@test.com"
      };
    },
    post() {
      return {
        id: "2234",
        title: "jam",
        body: "hello world",
        published: true
      };
    },
    comments(parent, args, ctx, info) {}
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some(user => {
        return user.email === args.data.email;
      });

      if (emailTaken) {
        throw new Error("Email taken.");
      }

      const user = {
        id: uuidv4(),
        ...args.data
      };
      users.push(user);

      return user;
    },
    deleteUser(parent, args, ctx, info) {
      const userIndex = users.findIndex(user => user.id === args.id);

      if (userIndex === -1) {
        throw new Error("user not found");
      }

      const deletedUsers = users.splice(userIndex, 1);

      posts = posts.filter(post => {
        const match = post.author === args.id;

        if (match) {
          comments = comments.filter(comment => {
            return comment.post !== post.id;
          });
        }
        return !match;
      });
      comments = comments.filter(comment => comment.author !== args.id);
      return deletedUsers[0];
    },

    createPost(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.data.author);

      if (!userExists) {
        throw new Error("User not found");
      }
      const post = {
        id: uuidv4(),
        ...args.data
      };
      posts.push(post);
      return post;
    },
    deletePost(parent, args, ctx, info) {
      const postIndex = posts.findIndex((post) => post.id === args.id)

      if (postIndex === -1) {
        throw new Error('post not found')
      }
      const deletedPosts = posts.slice(postIndex, 1)
      comments = comments.filter((comment) => comment.post !== args.id)

      return deletedPosts[0]
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.data.author);
      const postExists = posts.some(post => {
        return post.id === args.data.post && post.published === true;
      });
      if (!userExists || !postExists) {
        throw new Error("user not found");
      }

      const comment = {
        id: uuidv4(),
        ...args.data
      };
      comments.push(comment);
      return comment;
    },
    deleteComment(parent, args, ctx, info) {
      const commentIndex = comments.findIndex((comment) => comment.id === args.id)

      if (commentIndex === -1) {
        throw new Error('comment not found')
      }

      const deletedComments = comments.slice(commentIndex, 1)
      return deletedComments[0]
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => {
        return post.author === parent.id;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => {
        return comment.author === parent.id;
      });
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => {
        return comment.post === parent.id;
      });
    }
  },

  Comment: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        return user.id === parent.author;
      });
    },
    post(parent, args, ctx, info) {
      return posts.find(post => {
        return post.id === parent.post;
      });
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log("the server is up!");
});