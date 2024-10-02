const Rainbow = require("./rainbow/rainbowConnection");

const rainbowConnectionOptions = {
    email: "", // To be completed
    password: "", // To be completed
    appId: "7c0cd37080c611efa6661b0bb9c90370",
    appSecret: "mwzxgG5yWVsbGzz61aX6klt895XwNIpcrbJtod5fBgYH3pvU8NS9WkYk6pDhtih9"
}

const rainbowSdk = new Rainbow(rainbowConnectionOptions);

rainbowSdk.connect().then(() => {
    console.log("Rainbow Connected");
});
