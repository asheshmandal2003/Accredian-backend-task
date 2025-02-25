import Joi from "joi";

export const validateRefer = (req, res, next) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required().messages({
        "string.email": "Invalid email",
        "any.required": "Email is required",
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
