const Rainbow = require("./rainbow/rainbowConnection");
const bubbletestjid = "room_bc2b4784a4054e87b5352c990a2d9b3e@muc.sandbox-all-in-one-rbx-prod-1.rainbow.sbg"

const rainbowConnectionOptions = {
    email: "mister.dusbin777@gmail.com", // To be completed
    password: "D6N{Uz[B5[])", // To be completed
    appId: "255f2b9080fd11efa6661b0bb9c90370",
    appSecret: "Tiw4OORLjL0WTjYbmym6Z2o9p0AuPakNGQUM6bAnRyyJQ7muBz27wmBcxVxWuTix"
}

const rainbowSdk = new Rainbow(rainbowConnectionOptions);

rainbowSdk.connect()
    .then(() => {
        console.log('Rainbow connection established');

        // Get all bubbles (chat rooms)
        rainbowSdk.sendMessageToBubble(bubbletestjid, "COUCOU")
            .then(() => console.log("Message sent !"));
    })
