export const extractSpecs = (body) => {
    const specs = {};
    for (const key in body) {
      const match = key.match(/^specs\[(.+)\]$/);
      if (match) {
        let val = body[key];
        if (!isNaN(val)) val = Number(val);
        if (typeof val === "string") val = val.trim();
        specs[match[1]] = val;
        delete body[key];
      }
    }
    return specs;
  };
  