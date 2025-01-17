const Rainbow = require('./rainbow/rainbowInteraction');

// const email = 'ian.bellot001@gmail.com';
const email = 'lhotz@cfai-formation.fr';
// const email = "mister.dusbin777@gmail.com";
// const password = "D6N{Uz[B5[])";
const password = 'Azertyuiop67!';
// const password = '!ALEpass3128!!';
const appId = '255f2b9080fd11efa6661b0bb9c90370';
const appSecret = 'Tiw4OORLjL0WTjYbmym6Z2o9p0AuPakNGQUM6bAnRyyJQ7muBz27wmBcxVxWuTix';

(async () => {
    const rainbowSDK = new Rainbow(email, password, appId, appSecret);

    try {
        await rainbowSDK.testConnection(rainbowSDK);
    } catch (error) {
        console.log("Je vais m'arrêter");
        await rainbowSDK.stop();
    }

    const message = 'Hello bubble !';
    const bubbletestjid = 'room_bc2b4784a4054e87b5352c990a2d9b3e@muc.sandbox-all-in-one-rbx-prod-1.rainbow.sbg';

    console.log(await rainbowSDK.getAllBubbles());

    // rainbowSDK.sendMessageToBubble(rainbowSDK, bubbletestjid, message).then(() => console.log('Message sent !'));

    await rainbowSDK.stop();
})();
