const Rainbow = require("./rainbow/rainbowInteraction");

const email = "mister.dusbin777@gmail.com";
const password = "D6N{Uz[B5[])";

const rainbowSdk = new Rainbow(email, password);

const message = "Hello bubble !";
const bubbletestjid = "room_bc2b4784a4054e87b5352c990a2d9b3e@muc.sandbox-all-in-one-rbx-prod-1.rainbow.sbg"

rainbowSdk.getAllBubbles().then(
    () => console.log("Bubbles !")
)

rainbowSdk.sendMessageToBubble(bubbletestjid, message).then(
    () => console.log("Message sent !")
);
