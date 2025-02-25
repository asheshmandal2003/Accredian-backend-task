import Joi from "joi";

export const validateAuth = (req, res, next) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        "string.email": "Invalid email",
        "any.required": "Email is required",
      }),
      password: Joi.string()
        .pattern(
          new RegExp(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
          )
        )
        .required()
        .messages({
          "string.pattern.base":
            "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.",
          "any.required": "Password is required.",
        }),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      throw new Error(error.details[0].message);
    }
    next();
  } catch (error) {
    return res
      .status(400)
      .json({ message: error.message || "Something went wrong!" });
  }
};
