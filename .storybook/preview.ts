import type { Preview } from "@storybook/react";
import { within } from "@storybook/test";

/**
 * Expose `context.canvas` with testing-library queries
 * @example
 *    export const MyStory = {
 *    play: async ({parameters}) => {
 *      await parameters.canvas.findByRole('button', {name: 'XXX'})
 *    }}
 */
const CanvasWithQueries = (storyFn, context) => {
  if (!context.parameters.canvas) context.parameters.canvas = within(document.body);

  return storyFn();
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [CanvasWithQueries]
};

export default preview;
