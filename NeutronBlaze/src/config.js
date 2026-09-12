require("dotenv").config();

module.exports = {
  botName: process.env.BOT_NAME || "NeutronBlaze",
  prefix: process.env.PREFIX || ".",
  ownerNumber: process.env.OWNER_NUMBER || "",
  environment: process.env.NODE_ENV || "production",

  cooldown: {
    default: 3000
  },

  rateLimit: {
    maxCommands: 20,
    windowMs: 60000
  }
};
