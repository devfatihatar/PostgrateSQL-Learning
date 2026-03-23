module.exports = (schema) => {
  return (req, res, next) => {
    const errors = [];

    const sources = ["body", "params", "query"];

    for (const source of sources) {
      const rules = schema[source];

      if (!rules) {
        continue;
      }

      const payload = req[source] || {};

      for (const [field, config] of Object.entries(rules)) {
        const rawValue = payload[field];
        const value =
          typeof rawValue === "string" && config.trim
            ? rawValue.trim()
            : rawValue;

        if (config.trim && typeof rawValue === "string") {
          payload[field] = value;
        }

        if (
          config.required &&
          (value === undefined || value === null || value === "")
        ) {
          errors.push({
            field,
            source,
            message: config.message || `${field} is required`,
          });
          continue;
        }

        if (value === undefined || value === null || value === "") {
          continue;
        }

        if (config.type === "string") {
          if (typeof value !== "string") {
            errors.push({
              field,
              source,
              message: `${field} must be a string`,
            });
            continue;
          }

          if (config.minLength && value.length < config.minLength) {
            errors.push({
              field,
              source,
              message: `${field} must be at least ${config.minLength} characters`,
            });
          }

          if (config.maxLength && value.length > config.maxLength) {
            errors.push({
              field,
              source,
              message: `${field} must be at most ${config.maxLength} characters`,
            });
          }

          if (config.pattern && !config.pattern.test(value)) {
            errors.push({
              field,
              source,
              message: config.patternMessage || `${field} format is invalid`,
            });
          }
        }

        if (config.type === "number") {
          const numericValue = Number(value);

          if (Number.isNaN(numericValue)) {
            errors.push({
              field,
              source,
              message: `${field} must be a number`,
            });
            continue;
          }

          if (config.integer && !Number.isInteger(numericValue)) {
            errors.push({
              field,
              source,
              message: `${field} must be an integer`,
            });
          }

          if (config.positive && numericValue <= 0) {
            errors.push({
              field,
              source,
              message: `${field} must be greater than 0`,
            });
          }

          payload[field] = numericValue;
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors,
      });
    }

    next();
  };
};
