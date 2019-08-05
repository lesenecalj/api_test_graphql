const {users} = require('./../mock/users.json');

const ForumAPI = require('./ForumAPI');

/**
 * @class
 * @name UserAPI 
 */
class UserAPI {
  constructor() {
  }

  /**
   * @function
   * @name getUsers
   * @description récupére la liste des utilisateurs.
   */
  getUsers () {
    return users;
  }

  /**
   * @function
   * @name isUserJoinedForum
   * @param {Int} userID 
   * @param {Int} forumID 
   */
  isUserJoinedForum(userID, forumID) {
    const userForums = ForumAPI.getForumsByUserID(userID);
    return (userForums.find(forum => forum.id === forumID) ? true :  false);
  }

}

module.exports = new UserAPI;