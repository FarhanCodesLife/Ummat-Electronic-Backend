// utils/helpers.js
export const extractSpecs = (body) => {
  const specs = {};
  for (const key in body) {
    const match = key.match(/^specs\[(.+)\]$/);
    if (match) {
      specs[match[1]] = body[key];
    }
  }
  return specs;
};
