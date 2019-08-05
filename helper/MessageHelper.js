
/**
 * @class
 * @name MessageHelper 
 */
class MessageHelper {
  constructor() {
  }
  getFormattedMessages(users, messages) {
    for(let message of messages) {
      const user = users.find(user => user.id === message.userID);
      delete message.userID;
      message.user = user;
    }
    return messages;
  }
}

module.exports = new MessageHelper;