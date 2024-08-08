// utils/debounce.ts

export const debounce = (func: (button: string) => void, delay: number) => {
  let debounceTimer: ReturnType<typeof setTimeout>;

  return function (this: ThisParameterType<(button: string) => void>, ...args: Parameters<(button: string) => void>) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => func.apply(this, args), delay);
  };
};
