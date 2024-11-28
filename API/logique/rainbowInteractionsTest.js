const {init,
       testConnection,
       stop,
       getAllBubbles,
       sendMessageToBubble} = require("./rainbow/rainbowInteraction");

const email = "ian.bellot001@gmail.com";
// const email = "mister.dusbin777@gmail.com";
// const password = "D6N{Uz[B5[])";
const password = "!ALEpass3128!!";
const appId = "255f2b9080fd11efa6661b0bb9c90370";
const appSecret = "Tiw4OORLjL0WTjYbmym6Z2o9p0AuPakNGQUM6bAnRyyJQ7muBz27wmBcxVxWuTix";

(async () => {
    const rainbowSDK = init(email, password, appId, appSecret);

    try {
	await testConnection(rainbowSDK);
    } catch (error) {
	console.log("Je vais m'arrêter");
	await stop(rainbowSDK);
    }

    const message = "Hello bubble !";
    const bubbletestjid = "room_bc2b4784a4054e87b5352c990a2d9b3e@muc.sandbox-all-in-one-rbx-prod-1.rainbow.sbg"

    getAllBubbles(rainbowSDK).then(
	() => console.log("Bubbles !")
    )

    sendMessageToBubble(rainbowSDK, bubbletestjid, message).then(
	() => console.log("Message sent !")
    );

    await stop(rainbowSDK);
})();


