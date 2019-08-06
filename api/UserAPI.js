const {users} = require('./../mock/users.json');
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
  async isUserJoinedForum(userForums, forumID) {
    return (userForums.find(forum => forum.id === forumID) ? true :  false);
  }

}

module.exports = new UserAPI;