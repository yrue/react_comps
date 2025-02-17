import SignUpForm from ".";

import { userEvent, within, expect } from '@storybook/test';
export default {
    component: SignUpForm
}

export const Default = {
    play: async ({ canvasElement }) => {
        // 1. Render fields
        expect(canvasElement).toHaveTextContent('Username');
        expect(canvasElement).toHaveTextContent('Email');
        expect(canvasElement).toHaveTextContent('Password');
        expect(canvasElement).toHaveTextContent('Confirm Password');

        // 2. Show invalid error when input invalid value for each fields
        const usernameInput = within(canvasElement).getByRole('textbox', { name: /Username/i });
        await userEvent.type(usernameInput, 'a');
        expect(canvasElement).toHaveTextContent('Minimal of 4 characters.');

        const emailInput = within(canvasElement).getByRole('textbox', { name: /Email/ });
        await userEvent.type(emailInput, 'invalidemail');
        expect(canvasElement).toHaveTextContent('Invalid email address.');

        const passwordInput = within(canvasElement).getByRole('textbox', { name: /^Password/ });
        await userEvent.type(passwordInput, 'short');
        expect(canvasElement).toHaveTextContent('Minimal of 6 characters.');

        const passwordConfirmInput = within(canvasElement).getByRole('textbox', { name: /Confirm Password/ });
        await userEvent.type(passwordConfirmInput, 'mismatch');
        expect(canvasElement).toHaveTextContent('Passwords do not match.');

        // 3. click submit to call API
        const submitButton = within(canvasElement).getByRole('button', { name: /Sign Up/ });
        await userEvent.click(submitButton);

        // 4. handle API response
        // This part is not directly testable in Storybook, as it involves an external API call.
        // It should be tested in a unit test or integration test.
    }
}