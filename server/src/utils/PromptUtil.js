
const prompts = require('prompts');

const ForumAPI = require('./../api/ForumAPI');

class PromptUtils {

  async assignUserToForum(user, accessibleForums) {
    return await (async () => {
      let message = "";
      const result = await prompts({
        type: 'number',
        name: 'value',
        message: 'Quel Forum (forumID) voulez vous rejoindre ?',
        validate: async value => {
          const ids = await accessibleForums.map(accessibleForum => accessibleForum.id);
          if (ids.includes(value)) {
              //#He can also join a forum if he knows the forum id
              const joinedForum = await ForumAPI.joinForum(user.id, value);
              if(joinedForum) {
                message = `L'utilisateur (${user.name}) a rejoint le forumID ${value}`;
              }
          } else {
            message = `${value} n\'est pas considéré comme un forumID valide`;
          }
          return true;
        }
      });
      console.log(message);
      return await result;
    })();
  }
}

module.exports = new PromptUtils;