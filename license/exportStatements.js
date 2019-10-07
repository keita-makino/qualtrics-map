/* eslint-disable @typescript-eslint/no-var-requires */
const checker = require('license-checker');
const fs = require('fs');

checker.init(
  {
    start: './',
    customFormat: {
      licenses: '',
      repository: '',
      licenseText: ''
    }
  },
  (error, packages) => {
    if (error) {
      console.log(error);
    } else {
      fs.writeFile(
        './license/statements.json',
        JSON.stringify(packages),
        error => {
          console.log(error);
        }
      );
    }
  }
);
