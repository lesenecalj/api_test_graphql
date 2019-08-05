const { gql } = require('apollo-server');

const typeDefs = gql`

  type MembershipRequest {
    userID: Int
    forumID: Int
  }

  type Subscription {
    membershipRequestAdded: MembershipRequest
  }

  type User {
    id: Int
    name: String
    picture: String
    adminOf:[Int]
  }

  type Forum {
    id: Int
    isPrivate: Boolean
    title: String
    creatorID: Int
    joinedUsers: [Int]
  }

  type Message {
    id: Int
    text: String
    sendingTime: String
    userID: Int
    forumID: Int
  }

  type Query {
    getForums: [Forum],
    getForumByID(ForumID: Int) : Forum,
    getForumsByUserID(userID: Int): [Forum],
    getAccessibleforums: [Forum],

    isUserJoinedForum(userID: Int, forumID: Int) : Boolean,
    getUsers: [User],

    getMessagesByForumID(forumID: Int) : [Message],
  }

  type Mutation {
    addForum(userID: Int,isPrivate: Boolean, title: String) : Forum,
    joinForum(userID: Int, forumID: Int): Forum,
    addMessage(userID: Int, forumID: Int, text: String) : Message,
  }
`;

module.exports = typeDefs;
