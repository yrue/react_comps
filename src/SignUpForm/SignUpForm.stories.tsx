import SignUpForm from ".";

import { userEvent, within, expect } from '@storybook/test';
export default {
    component: SignUpForm
}

export const Default = {
    play: async ({ canvasElement }) => {
        /*
        1. Render fields
        2. Show invalid error when input invalid value for each fields
        3. click submit to call API
        4. handle API response
        */
    }
}