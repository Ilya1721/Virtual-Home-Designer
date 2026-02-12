/**
 * Universal project runner for VS Code integrated terminal
 */

const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const PROJECTS = [
  {
    name: "authentication-service",
    command: "npm",
    args: ["run", "dev"]
  },
  {
    name: "house-items-catalogue-service",
    command: "npm",
    args: ["run", "dev"]
  },
  {
    name: "user-management-service",
    command: "npm",
    args: ["run", "dev"]
  },
  {
    name: "client-app",
    command: "npm",
    args: ["run", "start"]
  }
];

const ROOT = process.cwd();

function runProject({ name, command, args }) {
  const projectPath = path.join(ROOT, name);
  const packageJson = path.join(projectPath, "package.json");

  if (!fs.existsSync(projectPath)) {
    console.warn(`⚠️  Skipping ${name}: folder not found`);
    return;
  }

  if (!fs.existsSync(packageJson)) {
    console.warn(`⚠️  Skipping ${name}: package.json not found`);
    return;
  }

  console.log(`\n▶ Starting ${name}`);
  console.log(`   ${command} ${args.join(" ")}\n`);

  const child = spawn(command, args, {
    cwd: projectPath,
    stdio: "inherit",
    shell: true
  });

  child.on("exit", (code) => {
    if (code !== 0) {
      console.error(`❌ ${name} exited with code ${code}`);
    }
  });
}

// Run all projects in parallel
PROJECTS.forEach(runProject);
