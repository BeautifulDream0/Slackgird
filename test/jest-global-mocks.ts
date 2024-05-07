const mock = () => {
  let storage: any = {};
  return {
    getItem: (key: any) => key in storage ? storage[key] : null,
    setItem: (key: any, value: any) => storage[key] = value || '',
    removeItem: (key: any) => delete storage[key],
    clear: () => storage = {},
  };
};

Object.defineProperty(window, 'localStorage', { value: mock() });
Object.defineProperty(window, 'sessionStorage', { value: mock() });
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ['-webkit-appearance']
});

Object.defineProperty(window, '__env', { value: { env: { backendUrl: 'mocked URL' } } });

Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    getPropertyValue: () => {
      return '';
    }
  })
});

// Mock
Object.defineProperty(window, 'location', {
  value: {
    pathname: '/terminals',
    assign: jest.fn(),
  },
});

// Jest has a hard time with MomentJS because they export as default, to bypass this problem we can mock the require .default
jest.mock('moment-mini', () => {
  const actual = jest.requireActual('moment-mini');
  return { __esModule: true, ...actual, default: actual };
});