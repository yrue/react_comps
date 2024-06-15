import TemperatureConverter from "./TemperatureConverter.tsx";
import { expect, userEvent } from '@storybook/test'

export default {
    component: TemperatureConverter
}

export const Default = {
    play: async ({ step, parameters: { canvas } }) => {
        const { findByRole } = canvas
        const celsiusTextbox = await findByRole('textbox', { name: 'Celsius' })
        const fahrenheitTextbox = await findByRole('textbox', { name: 'Fahrenheit' })
        await step('Both field should be empty by default', async () => {
            await expect(celsiusTextbox).toHaveValue('');
            await expect(fahrenheitTextbox).toHaveValue('');
        })
        await step('Live converting', async () => {
            await step('Input Celsius, update Fahrenheit value', async () => {
                const inputValue = '0'
                await userEvent.type(celsiusTextbox, inputValue);
                await expect(celsiusTextbox).toHaveValue(inputValue);
                await expect(fahrenheitTextbox).toHaveValue('32');
            })
            // [Question]: two req in a test case, should separate or revise the description.
            await step('Input Fahrenheit, update Celsius value and round to 4 decimal places where necessary', async () => {
                const inputValue = '33.8'
                userEvent.clear(fahrenheitTextbox)
                await userEvent.type(fahrenheitTextbox, inputValue);
                await expect(fahrenheitTextbox).toHaveValue(inputValue);
                await expect(celsiusTextbox).toHaveValue('1.0000');
            })
        })
        await step('Validation', async () => {
            await step('Input a non-numerical string on Celsius input, the other input will be blank', async () => {
                userEvent.clear(celsiusTextbox)
                await userEvent.type(celsiusTextbox, 'any1thing');
                await expect(fahrenheitTextbox).toHaveValue('');
            })
            await step('Input a non-numerical string on Fahrenheit input, the other input will be blank', async () => {
                userEvent.clear(fahrenheitTextbox)
                await userEvent.type(fahrenheitTextbox, 'any1thing');
                await expect(celsiusTextbox).toHaveValue('');
            })
        })
    }
}