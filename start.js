const { spawn } = require("child_process");
const os = require("os");

function runCommand(command, cwd) {
  let terminalCommand;
  if (os.platform() === "win32") {
    // On Windows, use start
    terminalCommand = `start cmd.exe /K "${command}"`;
  } else {
    // On MacOS, use open
    terminalCommand = `osascript -e 'tell app "Terminal" to do script "${command}"'`;
  }
  spawn(terminalCommand, { cwd: cwd, shell: true });
}

// First command
// runCommand("yarn hardhat deploy --network ganache", ".");

// // Second command
// runCommand("npm start", "./db");

// // Third command
// runCommand("yarn start", "./frontend");

// Fourth command
runCommand("npm start", "./sqlDb");
