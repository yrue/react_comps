import {afterEach, expect} from 'vitest';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';

import * as matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

// Automatically clean up after each test
afterEach(() => {
  cleanup();
});