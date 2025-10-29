interface Window {
  gtag: (
    command: 'config' | 'event',
    targetId: string,
    options?: Record<string, unknown>,
  ) => void;
}
