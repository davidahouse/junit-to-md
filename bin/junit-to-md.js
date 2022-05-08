#!/usr/bin/env node
const fs = require("fs");
const glob = require("glob");
const libxmljs = require("libxmljs2");

let output = "status";
if (process.argv.length > 2) {
  output = process.argv[2];
}

let totalTests = 0;
let failedTests = 0;
let failedTestDetails = [];

glob("**/TEST*.xml", async function (err, files) {
  for (let index = 0; index < files.length; index++) {
    var xmlDoc = libxmljs.parseXml(fs.readFileSync(files[index]));
    var suites = xmlDoc.find("//testsuite");
    suites.forEach((suite) => {
      totalTests += parseInt(suite.attr("tests").value());
      failedTests += parseInt(suite.attr("failures").value());
      var tests = suite.find("//testcase");
      tests.forEach((test) => {
        test.childNodes().forEach((failure) => {
          if (failure.name() === "failure") {
            failedTestDetails.push(
              suite.attr("name").value() +
                "/" +
                test.attr("name").value() +
                "\n\n```\n" +
                failure.text() +
                "\n```"
            );
          }
        });
      });
    });
  }

  if (output === "text") {
    outputText();
  } else if (output === "summary") {
    outputSummary();
  } else {
    if (failedTests > 0) {
      console.log("Failing tests detected, so returning a non-zero exit code");
      process.exit(1);
    } else if (totalTests == 0) {
      console.log("No tests detected, so returning a non-zero exit code");
      process.exit(1);
    }
  }
});

function outputText() {
  console.log("### Test Failures:");
  if (failedTestDetails.length > 0) {
    for (let index = 0; index < failedTestDetails.length; index++) {
      console.log("- " + failedTestDetails[index]);
    }
  } else if (totalTests > 0) {
    console.log("No failing tests, awesome!");
  } else {
    console.log("No tests found.");
  }
}

function outputSummary() {
  console.log("### Testing Summary:");
  console.log(" ");
  console.log("- " + totalTests + " Total test(s)");
  console.log("- " + (totalTests - failedTests) + " Successful test(s)");
  console.log("- " + failedTests + " Failed test(s)");
}
