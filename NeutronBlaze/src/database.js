
const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");

const files = {
  users: "users.json",
  groups: "groups.json",
  warnings: "warnings.json",
  settings: "settings.json"
};

function ensureDatabase() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  for (const file of Object.values(files)) {
    const filePath = path.join(DATA_DIR, file);

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "{}", "utf8");
    }
  }
}

function read(name) {
  ensureDatabase();

  const file = files[name];

  if (!file) {
    throw new Error(`Unknown database: ${name}`);
  }

  try {
    return JSON.parse(
      fs.readFileSync(path.join(DATA_DIR, file), "utf8")
    );
  } catch {
    return {};
  }
}

function write(name, data) {
  ensureDatabase();

  const file = files[name];

  if (!file) {
    throw new Error(`Unknown database: ${name}`);
  }

  fs.writeFileSync(
    path.join(DATA_DIR, file),
    JSON.stringify(data, null, 2),
    "utf8"
  );
}

module.exports = {
  ensureDatabase,
  read,
  write
};
