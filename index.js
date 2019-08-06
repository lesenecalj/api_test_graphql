

const ForumAPI = require('./api/ForumAPI');
const UserAPI = require('./api/UserAPI');
const MessageAPI = require('./api/MessageAPI');

const MessageHelper = require('./helper/MessageHelper');

const PromptUtil = require('./utils/PromptUtil');



new Promise(function(resolve, reject) {
  require('./server');
  resolve();
}).then(() => {
  (initApp = async () => {
    const users = await UserAPI.getUsers();
    await scenario1(users[0], users);
    //await scenario2(users[1]);
    //await scenario3(users);
  })();
});


scenario1 = async (user, users) => {

  console.log('Utilisateur :', user.name);

  //#A user can see the list of forums he has joined.
  const forums = await ForumAPI.getForumsByUserID(user.id);
  console.log('Forum(s) auxquel(s) il s\'est joint:', forums.map(forum => forum.title));

  //#A user can see the list of available forum and can join any
  const accessibleForums = await ForumAPI.getAccessibleforums();
  console.log('Liste des forums disponibles :' , accessibleForums);
  
  const {value} = await PromptUtil.assignUserToForum(user, accessibleForums);
  // #see the list of previous messages, ordered by most recent. 
  // #To be displayed in our client, a message should at least have a text, a sending time and name/picture of the sender
  if(parseInt(value)) {
    const sortedMessages = MessageAPI.getMessagesByForumID(value);
    // #see the name and picture of the members of the forum
    if(sortedMessages) {
      console.log("voici les derniers messages envoyés du plus récent au plus vieux: ");
      console.log(MessageHelper.getFormattedMessages(users, sortedMessages));
    }
  }
}

scenario2 = async (user) => {

  const forumAdded = await ForumAPI.addForum(user.id, 'sujets', false);
  console.log(`Le forum a été créé avec succès (#${forumAdded.id})`);

  const userForums = await ForumAPI.getForumsByUserID(user.id);

  const isUserJoinedForum = await UserAPI.isUserJoinedForum(userForums, forumAdded.id);
  // #Once inside a forum, he can
  if(isUserJoinedForum) {
    console.log('L\'utilisateur a bien rejoint le forum automatiquement');
    const newMessages = [
      "les copains",
      "les aventures"
    ];

    // #post a message in the forum
    for(const message of newMessages) {
      const createdMessage = MessageAPI.addMessage(user.id, forumAdded.id, message);
      console.log(` ---> Le message "${createdMessage.text}" a été créé`);
    }

  }
  console.log(MessageAPI.getMessagesByForumID(forumAdded.id));
}

scenario3 = async (users) => {
  
  // #When a user creates a forum, he can mark it as private. He will automatically be the admin of this forum.
  const forumAdded = await ForumAPI.addForum(users[2].id, 'sujets', true);
  console.log(`Le forum a été créé avec succès (#${forumAdded.id})`);
  
  // #When a forum is private, no-one can see it in the list of available forums.
  console.log("Le forum créé n'est pas visible dans la liste des forums accessible:")
  console.log(ForumAPI.getAccessibleforums());

setTimeout(async () => {
  // #A user can ask to join a private forum only if he knows the forum ID.
  await ForumAPI.joinForum(users[0].id,forumAdded.id);
}, 15000);

}

