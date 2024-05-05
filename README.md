# Project Summary

This repository contains a collection of React components designed for easy integration and reuse across different projects. Components are structured within the `src/` directory, and the repository includes configurations for local development and deployment.

## How it Works

1. **React Components**: All components are located within the `src/` directory, under their respective component names, e.g., `src/Button`, `src/Navbar`.
2. **GitHub Actions**: Automated workflows are configured to handle continuous integration and deployment tasks.
3. **Storybook Preview**: Components can be visually previewed and tested using Storybook, which is set up to run locally and is also hosted for easier access.

## Local Development

To run the project locally and view components in Storybook, follow these steps:

### Prerequisites

Ensure you have Node.js and npm installed on your machine. These are required to install dependencies and run the development server.

### Running Storybook Locally

Execute the following command in your terminal to start Storybook. This will compile the components and open a local server where you can view and interact with the component library:

```sh
npm install     # First, install the project dependencies
npm run storybook  # Then, start the Storybook environment
```

## Deployment

The project uses GitHub Actions for continuous integration and deployment. Storybook is automatically built and deployed to a Chromatic page upon every push to the main branch, ensuring that the latest version of the component library is always available for preview and integration testing.