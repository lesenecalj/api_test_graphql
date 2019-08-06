
const prompts = require('prompts');
const { UserInputError } = require('apollo-server');

const ForumAPI = require('./../api/ForumAPI');

class PromptUtils {

  async assignUserToForum(user, accessibleForums) {
    return await (async () => {
      const result = await prompts({
        type: 'number',
        name: 'value',
        message: 'Quel Forum (forumID) voulez vous rejoindre ? (la valeur "2" vous permettra d\'avancer dans le script)',
        validate: async value => {
          const ids = await accessibleForums.map(accessibleForum => accessibleForum.id);
          try {
            await this.checkValidityInputs(ids, user, value);
            return true;
          } catch (err) {
            await console.log('\nerr', err);
            return false;
          }
        }
      });
      return await result;
    })();
  }

  async checkValidityInputs (ids, user, input) {
    if (ids.includes(input)) {
      //#He can also join a forum if he knows the forum id
      await ForumAPI.joinForum(user.id, input)
      .then((joinedForum) => {
        if(joinedForum) {
          console.log(`L'utilisateur (${user.name}) a rejoint le forumID ${input}`);
        }
      });
    } else {
      throw new UserInputError (`${input} n\'est pas considéré comme un forumID valide`);
    }
  }
}

module.exports = new PromptUtils;