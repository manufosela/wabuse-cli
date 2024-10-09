import { vi } from 'vitest';
import readline from 'readline';

// Mock readline interface
const rlInterfaceMock = {
  question: vi.fn(),
  close: vi.fn(),
  on: vi.fn()
};

// Mock readline createInterface method
vi.mock('readline', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    createInterface: vi.fn(() => rlInterfaceMock)
  };
});

// Clear mocks after each test
afterEach(() => {
  vi.clearAllMocks();
});