import type { Meta } from '@storybook/react';
import Dropdown from ".";
import { Position } from './Dropdown';

const meta: Meta<typeof Dropdown> = {
    /* 👇 The title prop is optional.
     * See https://storybook.js.org/docs/configure/#configure-story-loading
     * to learn how to generate automatic titles
     */
    // title: 'Path/To/MyComponent',
    component: Dropdown,
};
export default meta;

export const Default = {
}

export const Test = {
    render: () => {
        return (
            <div className="app">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                    commodo consequat.
                </p>
                <div>
                    Left aligned menu <Dropdown position={Position.Start} />
                </div>
                <div style={{ textAlign: "end" }}>
                    Right aligned menu <Dropdown position={Position.End} />
                </div>
                <p>
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                    dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
                    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
            </div>
        )
    }
}