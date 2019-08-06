const { UserInputError } = require('apollo-server');
const {forums} = require('./../mock/forums.json');
const UserAPI = require('./UserAPI');

const PubSub = require('./../utils/PubSubUtil');
/**
 * @class
 * @name ForumAPI 
 */
class ForumAPI {
  constructor() {
  }


  /**
   * @function
   * @name getForumsByUserID
   * @description récupérer la liste des forums par l'id de l'utilisateur
   * @param {Int} userID 
   */
  getForumsByUserID(userID) {
    return forums.filter(forum => {
      for (const joinedUser of forum.joinedUsers) {
        if(joinedUser === userID) {
          return forum;
        }
      } 
    })
  }

  /**
   * @function
   * @name getForums
   * @description récupérer l'ensemble des forums
   */
  getForums() {
    return forums;
  }

  getForumByID(forumID) {
    return forums.find(forum => forum.id === forumID);
  }

  /**
   * @function
   * @name getAccessibleforums
   * @description récupérer les forums accessibles
   */
  getAccessibleforums() {
    return forums.filter(forum => {
     if (!forum.isPrivate) {
      return forum;
     } 
    });
  }

  /**
   * @function
   * @name addForum
   * @description ajouter un forum
   * @param {Int} userID 
   * @param {String} title
   * @param {Boolean} isPrivate
   */
  async addForum(userID, title, isPrivate) {
    const forum = {
      id: (forums.length + 1),
      isPrivate: isPrivate,
      title: title,
      creatorID: userID,
      joinedUsers: [userID],
      messages: []
    };
    const foundForum = await forums.find(forum => forum.title === title);

    if(foundForum) {
      throw new UserInputError('Le title existe déjà');
    }

    if(forum.isPrivate) {
      const users = await UserAPI.getUsers();
      const user = users.find(user => user.id === userID);
      user.adminOf.push(forum.id);
    }

    await forums.push(forum);
    return forum;
  }

  /**
   * @function
   * @name joinForum
   * @description rejoindre un forum
   * @param {Int} userID 
   * @param {Int} forumID
   */
  async joinForum(userID, forumID, isAsked) {
    const foundForum = await forums.find(forum => forum.id === forumID);
    if(isAsked === undefined || !isAsked) {
      const foundForum = await forums.find(forum => forum.id === forumID);
      if(!foundForum) {
        throw new UserInputError('Le forum n\'existe pas');
      }
      if(foundForum.joinedUsers) {
        const foundJoinedUsers = await foundForum.joinedUsers.find(joinedUser => joinedUser === userID);
        if(foundJoinedUsers) {
          throw new UserInputError('L\'utilisateur a déjà rejoint ce forum');
        }
      }
      if(foundForum.isPrivate) {
        console.log('une demande d\'adhesion a été envoyée');
        const memberShipRequest = await {
          userID: userID,
          forumID: forumID
        };
        await PubSub.publish('MEMBERSHIP_REQUEST_ADDED', { membershipRequestAdded: memberShipRequest});
        return await memberShipRequest;
      }
    }
    await foundForum.joinedUsers.unshift(userID);
    console.log("Un nouvel utilisateur a rejoint le forum privé par le forumID");
    console.log(foundForum.joinedUsers);
    return await foundForum;
  }

}

module.exports = new ForumAPI;