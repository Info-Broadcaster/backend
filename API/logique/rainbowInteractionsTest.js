const Rainbow = require("./rainbow/rainbowInteraction");

const email = "ian.bellot001@gmail.com";
const password = "!ALEpass3128!";
const appId = "255f2b9080fd11efa6661b0bb9c90370";
const appSecret = "Tiw4OORLjL0WTjYbmym6Z2o9p0AuPakNGQUM6bAnRyyJQ7muBz27wmBcxVxWuTix";

const rainbowSdk = new Rainbow(email, password, appId, appSecret);

const message = "Hello bubble !";
const bubbletestjid = "room_bc2b4784a4054e87b5352c990a2d9b3e@muc.sandbox-all-in-one-rbx-prod-1.rainbow.sbg"

rainbowSdk.getAllBubbles().then(
    () => console.log("Bubbles !")
)

rainbowSdk.sendMessageToBubble(bubbletestjid, message).then(
    () => console.log("Message sent !")
);
