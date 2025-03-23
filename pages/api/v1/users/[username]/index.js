import controller from "infra/controller";
import user from "models/user";
import { createRouter } from "next-connect";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

export async function getHandler(req, res) {

  const username = req.query.username;
  const userFound = await user.findOneByUsername(username);

  return res.status(200).json(userFound);
}
