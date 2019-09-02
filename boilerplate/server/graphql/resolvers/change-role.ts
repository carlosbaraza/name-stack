import { Context } from "../types";
import { User } from "../../types";
import { GraphQLFieldResolver } from "graphql";
import * as admin from "firebase-admin";

type ChangeRoleResolver = GraphQLFieldResolver<any, Context, {}>;

export const changeRole: ChangeRoleResolver = async (
  source,
  args: { uid: string; role: string },
  context: Context
) => {
  const { role: currentUserRole } = context.claims;
  if (currentUserRole !== "admin") {
    throw new Error("Not authorized");
  }

  const { uid, role } = args;

  await admin.auth().setCustomUserClaims(uid, { role });
  const user = (await admin.auth().getUser(uid)) as User;

  return {
    uid: user.uid,
    email: user.email,
    role: user.customClaims.role
  };
};
