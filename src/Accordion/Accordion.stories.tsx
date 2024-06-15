import Accordion from ".";
import { expect, userEvent } from '@storybook/test'

export default {
    component: Accordion
}

export const Default = {
    play: async ({ step, parameters: { canvas } }) => {
        await step('Render collapsed titles by default', async () => {
            // cannot find any content
            const content = canvas.queryByRole('region', { name: 'Accordion 1' })
            await expect(content).not.toBeInTheDocument();
        })
        await step('Toggle', async () => {
            const targetAccordionName = 'Accordion 2'
            const targetAccordion = await canvas.findByRole('button', { name: targetAccordionName })
            await step('Click a collapsed title and it is expanded and the content will be displayed', async () => {
                await userEvent.click(targetAccordion)
                const content = await canvas.findByRole('region', { name: targetAccordionName });
                await expect(content).toBeVisible();
            })
            await step('Click the expand title and it is collapsed and the content will be displayed', async () => {
                await userEvent.click(targetAccordion)
                const content = await canvas.queryByRole('region', { name: targetAccordionName });
                await expect(content).not.toBeInTheDocument();
             })
        })
    }
}