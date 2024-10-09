// __mocks__/readline.js

const readline = {
  createInterface: vi.fn(() => ({
    question: vi.fn(),
    close: vi.fn(),
    on: vi.fn(),
  })),
};

export default readline;

