export const promise = async () => new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Hello World");
  }, 1000);
});
