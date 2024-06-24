import { authService } from "../api/auth/auth.service";
import { chatService } from "../api/chat/chat.service";
import { FriendModel } from "../api/friends/friends.model";
import { friendService } from "../api/friends/friends.service";
import { messagesService } from "../api/messages/messages.service";
import { userService } from "../api/user/user.service";
import { faker } from "@faker-js/faker";

async function main() {
  const passwords = [
    "password0",
    "password1",
    "password2",
    "password3",
    "password4",
    "password5",
    "password6",
    "password7",
    "password8",
    "password9",
  ];

  await authService.signup({
    username: "admin",
    password: "admin",
    email: "admin@admin.com",
    firstName: "admin",
    lastName: "admin",
    imgUrl:
      "https://res.cloudinary.com/dpnevk8db/image/upload/v1719231948/avatar4_wmaocu.jpg",
  });

  for (let i = 0; i < 10; i++) {
    await authService.signup({
      username: faker.internet.userName(),
      password: passwords[i],
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      imgUrl: faker.image.avatar(),
    });
  }

  const users = await userService.query();

  for (let i = 0; i < users.length; i++) {
    let userId = users[i]._id;
    for (let j = 0; j < users.length; j++) {
      if (userId === users[j]._id) continue;
      const friendToSave: Partial<FriendModel> = {
        userId,
        friendId: users[j]._id,
        status: "pending",
      };
      await friendService.create(friendToSave);
    }
  }

  const userId = users[0]._id.toString();
  for (let i = 1; i < users.length; i++) {
    await chatService.create([userId, users[i]._id.toString()], "private", "");
  }

  const chats = await chatService.query(userId);

  for (let i = 1; i < chats.length; i++) {
    for (let j = 0; j < 10; j++) {
      const msgUserId = Math.random() > 0.5 ? userId : users[i]._id.toString();
      await messagesService.create(
        chats[i]._id.toString(),
        msgUserId,
        faker.lorem.sentence()
      );
    }
  }
}

main()
  .catch((ev) => {
    console.error(ev);
    process.exit(1);
  })
  .finally(() => {
    console.log("Data seeded successfully");
    process.exit(0);
  });
