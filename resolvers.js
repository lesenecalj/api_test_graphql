const ForumAPI = require('./api/ForumAPI');
const UserAPI = require('./api/UserAPI');
const MessageAPI = require('./api/MessageAPI');

const PubSub = require('./utils/PubSubUtil');
const { withFilter } = require ('graphql-subscriptions');

const REPLY_MEMBERSHIP_REQUEST = true;

module.exports = {
  Subscription: {
    membershipRequestAdded: {
      subscribe: withFilter(() => PubSub.asyncIterator('MEMBERSHIP_REQUEST_ADDED'), async (payload, variables) => {
        const {membershipRequestAdded} = payload;
        if(REPLY_MEMBERSHIP_REQUEST) {
          await ForumAPI.joinForum(membershipRequestAdded.userID, membershipRequestAdded.forumID, true);
          return true;
        }
     }),
    },
  },
  Query: {

    getForums() {
      return ForumAPI.getForums();
    },

    getForumByID(obj, {forumID}) {
      console.log(ForumAPI.getForumByID(forumID));
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

    getMessagesByForumID(obj, {forumID}) {
      return MessageAPI.getMessagesByForumID(forumID);
    } 
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