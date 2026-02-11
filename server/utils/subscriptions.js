const fs = require("fs");
const path = require("path");

const SUBSCRIPTIONS_FILE = path.join(__dirname, "../data/subscriptions.json");
const BACKUP_DIR = path.join(__dirname, "../data/backups");

// Ensure backup directory exists
const ensureBackupDir = () => {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
};

// Auto-recover from backup if main file corrupted
const autoRecoverIfNeeded = () => {
  try {
    // Check if main file exists and is valid JSON
    if (fs.existsSync(SUBSCRIPTIONS_FILE)) {
      const data = fs.readFileSync(SUBSCRIPTIONS_FILE, "utf8");
      JSON.parse(data); // Test if valid JSON
      return; // File OK, nothing to do
    }
  } catch (error) {
    console.log(
      "Main subscriptions file corrupted or missing, attempting auto-recovery...",
    );
  }

  // File corrupted/missing - try auto-recovery
  try {
    ensureBackupDir();
    const backups = fs
      .readdirSync(BACKUP_DIR)
      .filter((file) => file.startsWith("subscriptions_"))
      .sort()
      .reverse(); // Most recent first

    for (const backup of backups) {
      try {
        const backupPath = path.join(BACKUP_DIR, backup);
        const backupData = fs.readFileSync(backupPath, "utf8");
        JSON.parse(backupData); // Test if backup is valid

        // Valid backup found - restore it
        fs.copyFileSync(backupPath, SUBSCRIPTIONS_FILE);
        return;
      } catch (backupError) {
        console.log(`Backup ${backup} also corrupted, trying next...`);
      }
    }

    // No valid backups - create empty file
    const emptyData = { subscriptions: [] };
    fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(emptyData, null, 2));
  } catch (error) {
    console.error("Auto-recovery failed:", error);
  }
};

// Create backup with timestamp
const createBackup = () => {
  try {
    ensureBackupDir();

    if (fs.existsSync(SUBSCRIPTIONS_FILE)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const backupFile = path.join(
        BACKUP_DIR,
        `subscriptions_${timestamp}.json`,
      );

      fs.copyFileSync(SUBSCRIPTIONS_FILE, backupFile);

      // Keep only last 10 backups
      cleanupOldBackups();
    }
  } catch (error) {
    console.error("Backup creation error:", error);
  }
};

// Remove old backups (keep last 10)
const cleanupOldBackups = () => {
  try {
    const files = fs
      .readdirSync(BACKUP_DIR)
      .filter((file) => file.startsWith("subscriptions_"))
      .sort()
      .reverse();

    if (files.length > 10) {
      const toDelete = files.slice(10);
      toDelete.forEach((file) => {
        fs.unlinkSync(path.join(BACKUP_DIR, file));
      });
    }
  } catch (error) {
    console.error("Backup cleanup error:", error);
  }
};

// Load subscriptions with auto-recovery
const loadSubscriptions = () => {
  // Auto-recover if needed before loading
  autoRecoverIfNeeded();

  try {
    const data = fs.readFileSync(SUBSCRIPTIONS_FILE, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to load subscriptions even after recovery:", error);
    return { subscriptions: [] };
  }
};

// Save subscriptions with backup
const saveSubscriptions = (data) => {
  try {
    // Create backup before saving new data
    createBackup();

    // Save new data
    fs.writeFileSync(SUBSCRIPTIONS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Failed to save subscriptions:", error);
  }
};

module.exports = { loadSubscriptions, saveSubscriptions };
