const postcss = require('postcss');
const fs = require('fs');

// Read the contents of the two files
const file1Content = fs.readFileSync('output.css', 'utf8');
const file2Content = fs.readFileSync('output2.css', 'utf8');

// Parse the contents of the two files
const file1AST = postcss.parse(file1Content);
const file2AST = postcss.parse(file2Content);

// Extract class names from the first file and remove duplicates
const classNamesSet = new Set();
file1AST.walkRules(rule => {
    rule.selectors.forEach(selector => {
        const classNames = selector.split('.').slice(1);
        classNames.forEach(className => classNamesSet.add(className));
    });
});

// Traverse the second file and add non-duplicate class names
file2AST.walkRules(rule => {
    rule.selectors = rule.selectors.filter(selector => {
        const className = selector.split('.').slice(1)[0];
        return !classNamesSet.has(className);
    });
});

// Combine the ASTs and convert back to CSS
const combinedAST = postcss.root().append(file1AST, file2AST);
const combinedCss = combinedAST.toString();

// Write the final CSS to a new file or use it as desired
fs.writeFileSync('combined.css', combinedCss, 'utf8');