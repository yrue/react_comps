// input: Path ComponentName includeCss
// effect: generate index.ts, {ComponentName}.ts
// 1. index.ts includes export {ComponentName}.ts
// 2. Component includes initial component names with {ComponentName}
// 3. create storybook
// output: log

import fs from "fs";
import path from "path";

// Read command-line arguments
// eslint-disable-next-line no-undef
const args = process.argv.slice(2);
const targetPath = args.at(0);
const componentNames = args.at(1)?.split(",");
const includeCss = Boolean(args.at(2));
console.log({ includeCss });

(function inputVerification() {
  if (args.length < 2) {
    console.error("Error: Not enough arguments provided.");
    console.error(
      "Usage: node script.js <targetPath> <componentNames> [includeCss(default: false)]"
    );
    process.exit(1);
  }

  // Argument checks
  if (!componentNames || componentNames.length === 0) {
    console.error("Error: Invalid component names provided.");
    process.exit(1);
  }

  if (!targetPath) {
    console.error("Error: Invalid target path provided.");
    process.exit(1);
  }
})();

const extension = "ts";
componentNames.forEach((componentName) => {
  if (!componentName || !targetPath) {
    console.error("Please provide both ComponentName and Path.");
    process.exit(1);
  }

  // Create the component folder
  const componentFolderPath = path.join(targetPath, componentName);
  if (!fs.existsSync(componentFolderPath)) {
    fs.mkdirSync(componentFolderPath, { recursive: true });
  }

  // Create index file
  const indexPath = path.join(componentFolderPath, `index.${extension}`);
  const indexContent = `export { default } from './${componentName}';\n`;
  fs.writeFileSync(indexPath, indexContent);

  // Create css module file
  if (includeCss === true) {
    const cssPath = path.join(
      componentFolderPath,
      `${componentName}.module.scss`
    );
    const cssContent = `.container{\n\n}`;
    fs.writeFileSync(cssPath, cssContent);
  }

  // Create Component file
  const componentPath = path.join(
    componentFolderPath,
    `${componentName}.${extension}x`
  );
  const componentContent = `import {} from 'react';
${includeCss ? `import styles from './${componentName}.module.css';` : ""}
const ${componentName} = () => {
    return <div>${componentName} Component</div>;
};

export default ${componentName};
`;
  fs.writeFileSync(componentPath, componentContent);

  // Create Storybook file
  const storybook = {
    path: path.join(
      componentFolderPath,
      `${componentName}.stories.${extension}x`
    ),
    content: `import ${componentName} from ".";

export default {
    component: ${componentName}
}

export const Default = {
}`,
  };
  fs.writeFileSync(storybook.path, storybook.content);

  // Create MDX file
  const storyCompName = `${componentName}Stories`;
  const mdx = {
    path: path.join(componentFolderPath, `${componentName}.mdx`),
    content: `import { Meta } from '@storybook/blocks';
 
import * as ${storyCompName} from './${componentName}.stories';
 
<Meta of={${storyCompName}} />
 
# ${componentName} `,
  };
  fs.writeFileSync(mdx.path, mdx.content);

  console.log(
    `Component ${componentName} created successfully at ${componentFolderPath}`
  );
});
