const fs = require('fs');
const path = require('path');

// Replace the placeholder in the compiled environment file
function replaceEnv(filePath, envVariables) {
  let fileContent = fs.readFileSync(filePath, 'utf8');
  
  Object.keys(envVariables).forEach(key => {
    const toReplace = `__${key}__`;
    fileContent = fileContent.replace(new RegExp(toReplace, 'g'), envVariables[key]);
  });

  fs.writeFileSync(filePath, fileContent, 'utf8');
}

// Walk through directory and apply replaceEnv to each file matching the regex
function processDirectory(dirPath, fileRegex, envVariables) {
  fs.readdirSync(dirPath).forEach(file => {
    const filePath = path.join(dirPath, file);
    const fileStat = fs.statSync(filePath);

    if (fileStat.isDirectory()) {
      processDirectory(filePath, fileRegex, envVariables); // Recursively process subdirectories
    } else if (fileRegex.test(file)) {
      replaceEnv(filePath, envVariables);
    }
  });
}

// Directory path to process
const targetDirPath = path.join(__dirname, './dist/angular-mean-crud-tutorial'); // Update for your path

// Regular expression for file matching (e.g., all .js files)
const fileRegex = /\.js$/; // Update this regex as needed

// Environment variables to replace
const envVariables = {
  'API_URL': process.env.API_URL || 'http://localhost:8080/api'
};

processDirectory(targetDirPath, fileRegex, envVariables);
