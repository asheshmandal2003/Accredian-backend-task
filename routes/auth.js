import { router } from "../config/router.js";
import { login, register } from "../controllers/auth.js";
import { validateAuth } from "../validations/auth.js";

router.route("/register").post(validateAuth, register);
router.route("/login").post(validateAuth, login);

export default router;
