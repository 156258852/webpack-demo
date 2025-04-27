module.exports = (babel) => {
  const { types: t } = babel;

  return {
    name: 'remove-console-log',
    visitor: {
      // 检查 CallExpression 而不是 Identifier
      CallExpression(path) {
        const callee = path.get("callee");

        // 确保 callee 是 MemberExpression
        if (callee.isMemberExpression()) {
          const object = callee.get("object");
          const property = callee.get("property");

          // 判断是否为 console.log
          if (
            object.isIdentifier({ name: "console" }) && // object 是 console
            property.isIdentifier({ name: "log" }) // property 是 log
          ) {
            path.remove(); // 移除 console.log 调用
          }
        }
      },
    },
  };
};
