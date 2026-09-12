
const config = require("./config");

function normalizeNumber(number) {
  if (!number) return "";

  return String(number)
    .replace(/[^0-9]/g, "")
    .replace(/^0+/, "");
}

function isOwner(sender) {
  const senderNumber = normalizeNumber(
    String(sender || "").split("@")[0]
  );

  const ownerNumber = normalizeNumber(config.ownerNumber);

  return Boolean(
    senderNumber &&
    ownerNumber &&
    senderNumber === ownerNumber
  );
}

function isGroup(jid) {
  return String(jid || "").endsWith("@g.us");
}

async function isAdmin(sock, groupJid, senderJid) {
  if (!isGroup(groupJid)) return false;

  try {
    const metadata = await sock.groupMetadata(groupJid);

    const participant = metadata.participants.find(
      p => p.id === senderJid
    );

    return Boolean(
      participant &&
      (participant.admin === "admin" ||
        participant.admin === "superadmin")
    );
  } catch {
    return false;
  }
}

module.exports = {
  normalizeNumber,
  isOwner,
  isGroup,
  isAdmin
};
