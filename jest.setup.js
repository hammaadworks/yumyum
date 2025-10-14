import '@testing-library/jest-dom';

const intersectionObserverMock = () => ({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});

window.IntersectionObserver = jest.fn().mockImplementation(intersectionObserverMock);

process.env.NEXT_PUBLIC_ADMIN_SHEET_ID = 'test-admin-sheet-id';
process.env.NEXT_PUBLIC_LARK_WEBHOOK_URL = 'https://lark.webhook.url';
