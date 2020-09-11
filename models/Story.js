const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema({
    title: {
        type: "string",
        require: true,
    },
    body: {
        type: "string",
        require: true,
    },
    status: {
        type: "string",
        default: "public",
        enum: ["public", "private"],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    image: {
        type: "string",
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
});

module.exports = mongoose.model("Story", StorySchema);
