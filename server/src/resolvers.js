const ForumAPI = require('./api/ForumAPI');
const UserAPI = require('./api/UserAPI');
const MessageAPI = require('./api/MessageAPI');

const PubSub = require('./utils/PubSubUtil');
const { withFilter } = require ('graphql-subscriptions');
const POST_ADDED = 'POST_ADDED';

module.exports = {
  Subscription: {
    postAdded: {

      subscribe: withFilter(() => PubSub.asyncIterator('POST_ADDED'), async (payload, variables) => {
        const {postAdded} = payload;
        const forum = await ForumAPI.joinForum(postAdded.userID, postAdded.forumID, true);
        return true;
     }),
    },
  },
  Query: {

    getForums() {
      return ForumAPI.getForums();
    },

    getForumByID({forumID}) {
      return ForumAPI.getForumByID(forumID);
    },

    getForumsByUserID(obj, {userID}) {
      return ForumAPI.getForumsByUserID(userID);
    },
    getAccessibleforums() {
      return ForumAPI.getAccessibleforums();
    },
    
    isUserJoinedForum(obj, {userID, forumID}) {
      return UserAPI.isUserJoinedForum(userID, forumID);
    },

    getUsers: () => UserAPI.getUsers(),

    getMessagesByForumID: () => MessageAPI.getMessagesByForumID(forumID),
  },
  Mutation: {
    addForum(obj, {userID, title, isPrivate}) {
      return ForumAPI.addForum(userID, title, isPrivate);
    },
    async joinForum(obj, {userID, forumID}) {
      return await ForumAPI.joinForum(userID, forumID);
    },
    addMessage(obj, {userID, forumID, text}) {
      return MessageAPI.addMessage(userID, forumID, text);
    }
  }
}