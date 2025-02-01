const express = require("express");
const router = express.Router();
const { getLinkTracker } = require("../logique/link-tracker");

router.post("/", async (req, res) => {
    const user = req.user;
    const { bubbles, message, title, link } = req.body;

    const trackedLink = await getLinkTracker(link);

    if (
        bubbles == null ||
        bubbles?.length === 0 ||
        !message ||
        message === "" ||
        !title ||
        title === "" ||
        !trackedLink ||
        trackedLink === ""
    ) {
        return res.status(400).json({ error: "bubbles, message, title and link are required." });
    }

    try {
        const formatedMessage = `##${title} \n\n\n${message}\n\n[Accéder à l'article original](${trackedLink})`;

        for (const bubble of bubbles) {
            await user.rainbowInstance.sendMessageToBubble(bubble, formatedMessage);
        }
        return res.status(200).json({ success: true, message: "Message sent successfully!." });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

module.exports = router;
