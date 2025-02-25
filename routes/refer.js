import { router } from "../config/router.js";
import { refer } from "../controllers/refer.js";
import { validateRefer } from "../validations/refer.js";

router.route("/refer/:id").post(validateRefer, refer);

export default router;
