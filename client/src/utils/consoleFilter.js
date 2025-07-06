const originalConsoleLog = console.log;

console.log = (...args) => {
  if (args.some(arg => typeof arg === 'string' && arg.includes('style'))) {
    return;
  }
  originalConsoleLog.apply(console, args);
};
