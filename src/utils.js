export const promise = async () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Hello World");
    }, 1000);
  });
};
