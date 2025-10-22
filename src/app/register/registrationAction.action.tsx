"use server";
import db from "@/config/db";
import { users } from "@/drizzle/schema";
import argon2 from "argon2";
import { eq, or } from "drizzle-orm";
// export const registrationAction = async (data: {
//   name: string;
//   userName: string;
//   email: string;
//   password: string;
//   role: "applicant" | "employer";
// }) => {
//   try {
//     // console.log(formData.get("name"));
//     const { name, userName, email, password, role } = data;

//     await db.insert(users).values({ name, userName, email, password, role });
//     return {
//       status: "SUCCESS",
//       message: "Registration Completed Successfully",
//     };
//   } catch (error) {
//     return {
//       status: "ERROR",
//       message: "Unknown Error Occurred! Please Try Again Later",
//     };
//   }
// };
export const registrationAction = async (formData: {
  name: string;
  userName: string;
  email: string;
  password: string;
  role: "applicant" | "employer";
}) => {
  try {
    const { name, userName, email, password, role } = formData;
    console.log(name, userName, password, email, role);

    const [user] = await db
      .select()
      .from(users)
      .where(or(eq(users.email, email), eq(users.userName, userName)));
    console.log(user);
    if (user) {
      if (user.email === email) {
        return {
          status: "ERROR",
          message: "User with provided email already exists!",
        };
      } else {
        return {
          status: "ERROR",
          message: "User with provided userName already exists!",
        };
      }
    }
    const hashedPassword = await argon2.hash(password);
    console.log(hashedPassword);
    await db
      .insert(users)
      .values({ name, userName, password: hashedPassword, email, role });
    return {
      status: "SUCCESS",
      message: "Registration Completed Successfully",
    };
  } catch (error) {
    return {
      status: "ERROR",
      message: "Unknown Error Occurred! Please Try Again Later",
    };
  }
};
