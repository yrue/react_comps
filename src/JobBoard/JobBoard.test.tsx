import { describe, test, expect, beforeAll, afterEach, afterAll, beforeEach } from 'vitest';

import { render, screen, waitFor } from '@testing-library/react';
import JobBoard from './JobBoard'; // Adjust the import based on your actual component path

import { setupServer } from 'msw/node';
import { handlers } from './handlers'; // Adjust the path as necessary
import userEvent from '@testing-library/user-event';

// Set up the MSW server with the defined handlers
const server = setupServer(...handlers);

// Establish API mocking before all tests
beforeAll(() => {
    server.listen()
});

// Reset any request handlers that are declared as a part of tests
// (i.e. for testing one-time error scenarios)
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());

const isoDatePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/

describe('JobBoard Component', () => {
    beforeEach(() => {
        render(<JobBoard />);
    })
    test('renders job list with initial k jobs', async () => {
        const jobItems = await screen.findAllByRole('article'); // Assuming each job is a list item
        expect(jobItems).toHaveLength(6); // k = 6
    });

    test('loads more jobs when button is clicked', async () => {
        const loadMoreButton = screen.getByRole('button', { name: /load more/i });
        let jobItems = await screen.findAllByRole('article'); // Assuming each job is a list item
        expect(jobItems).toHaveLength(6); // k = 6

        expect(loadMoreButton).toBeEnabled();
        await userEvent.click(loadMoreButton);
        jobItems = await screen.findAllByRole('article');
        await waitFor(() => expect(jobItems).toHaveLength(12));
    });

    test('disables load more button if no more jobs to load', async () => {
        const loadMoreButton = screen.getByRole('button', { name: /load more/i });

        // Simulate loading all jobs
        for (let i = 0; i < 2; i++) {
            userEvent.click(loadMoreButton);
        }

        expect(loadMoreButton).toBeDisabled();
    });

    test('renders job title as a link if URL exists', async () => {
        const jobTitleLink = await screen.findByRole('link', { name: /Job 3/ }); // Replace with actual job title
        expect(jobTitleLink).toHaveAttribute('href', 'http://example.com'); // Replace with actual URL
    });

    test('formats post date correctly', async () => {
        const postDates = await screen.findAllByText(isoDatePattern);
        expect(postDates[0]).toBeVisible();
    });
});