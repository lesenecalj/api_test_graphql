const {messages} = require('./../mock/messages.json');

const dayjs = require('dayjs');

/**
 * @class
 * @name MessageAPI 
 */
class MessageAPI {
  constructor() {
  }

  /**
   * @function
   * @name getUsers
   * @description récupére la liste des utilisateurs.
   */
  getMessages () {
    return messages;
  }

  /**
   * @function
   * @name getForumMessages
   * @param {Int} forumID 
   */
  getMessagesByForumID(forumID) {
    const foundForumMessages = this.getMessages().filter(message => message.forumID === forumID);
    if (foundForumMessages) {
      foundForumMessages.sort((a, b) => {
        return dayjs(b.sendingTime) - dayjs(a.sendingTime);
      });
      return foundForumMessages;
    }
  }

  /**
   * @function
   * @name addMessage
   * @description ajoute un message sur le forum spécifié.
   * @param {[Message]} messages
   * @param {Int} userID 
   * @param {Int} forumID 
   * @param {String} message
   */
  addMessage(userID, forumID, text) {
    const message = {
      id: (this.getMessages().length + 1),
      userID: userID,
      forumID: forumID,
      text : text,
      sendingTime: dayjs().format('YYYY-MM-DD'),
    };
    this.getMessages().unshift(message);
    return message;
  }

}

module.exports = new MessageAPI;