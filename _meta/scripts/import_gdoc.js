const { execFile } = require("child_process");
const path = require("path");
const fs = require("fs");

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    execFile(command, args, (err, stdout, stderr) => {
      if (err) reject(new Error(stderr || err.message));
      else resolve(stdout);
    });
  });
}

function sanitizeFileName(name) {
  return name.replace(/[\\/:*?"<>|]/g, "-").trim();
}

module.exports = async (params) => {
  const input = await params.quickAddApi.inputPrompt("Google Doc ID or URL");
  if (!input) return;

  const noteNameInput = await params.quickAddApi.inputPrompt(
    "Output note name (optional)"
  );

  const vaultRoot = params.app.vault.adapter.basePath;
  const outDir = path.join(vaultRoot, "unprocessed");
  fs.mkdirSync(outDir, { recursive: true });

  const fallbackName =
    new Date().toISOString().replace(/[:T]/g, "-").slice(0, 16) + "-gdoc-import.md";

  const noteFileName = noteNameInput && noteNameInput.trim()
    ? (() => {
        const base = sanitizeFileName(noteNameInput);
        return base.endsWith(".md") ? base : `${base}.md`;
      })()
    : fallbackName;

  const outPath = path.join(outDir, noteFileName);
  const scriptPath = path.join(process.env.HOME, ".local", "bin", "gdoc_to_markdown.sh");

  console.log(scriptPath, input, outPath);
  await runCommand(scriptPath, [input, outPath]);

  const relPath = path.relative(vaultRoot, outPath).replace(/\\/g, "/");

  for (let i = 0; i < 20; i++) {
    const file = params.app.vault.getAbstractFileByPath(relPath);
    if (file) {
      await params.app.workspace.getLeaf(true).openFile(file);
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  console.log(`Imported Google Doc to ${relPath}`);
};

