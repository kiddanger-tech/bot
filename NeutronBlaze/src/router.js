
const config = require("./config");
const {
  isOwner,
  isAdmin
} = require("./permissions");

const {
  checkRateLimit,
  checkCooldown
} = require("./rateLimit");

const commands = new Map();

function registerCommand(name, handler, options = {}) {
  commands.set(name.toLowerCase(), {
    handler,
    ownerOnly: options.ownerOnly || false,
    adminOnly: options.adminOnly || false,
    groupOnly: options.groupOnly || false
  });
}

async function executeCommand(context) {
  const {
    command,
    jid,
    sender,
    isGroup,
    sock,
    reply
  } = context;

  const cmd = commands.get(
    command.toLowerCase()
  );

  if (!cmd) return false;

  if (!checkRateLimit(jid)) {
    await reply(
      "⚠️ Too many commands. Slow down boss man."
    );
    return true;
  }

  if (!checkCooldown(jid, command)) {
    await reply(
      "⏳ Cooldown active. Try again shortly."
    );
    return true;
  }

  const owner = isOwner(sender);

  if (cmd.ownerOnly && !owner) {
    await reply("🚫 Owner command.");
    return true;
  }

  if (cmd.groupOnly && !isGroup) {
    await reply(
      "👥 This command only works in groups."
    );
    return true;
  }

  let admin = false;

  if (cmd.adminOnly) {
    admin = await isAdmin(
      sock,
      jid,
      sender
    );

    if (!admin && !owner) {
      await reply(
        "🚫 Group admin permission required."
      );
      return true;
    }
  }

  await cmd.handler({
    ...context,
    isOwner: owner,
    isAdmin: admin
  });

  return true;
}

module.exports = {
  registerCommand,
  executeCommand,
  commands,
  prefix: config.prefix
};
