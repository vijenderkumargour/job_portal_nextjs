"use server";

import db from "@/config/db";
import { users } from "@/drizzle/schema";
import argon2 from "argon2";
import { eq, or } from "drizzle-orm";

export const registerUserAction = async (data: {
  name: string;
  userName: string;
  email: string;
  password: string;
  role: "applicant" | "employer";
}) => {
  try {
    // console.log(formData.get("name"));
    const { name, userName, email, password, role } = data;

    const [user] = await db
      .select()
      .from(users)
      .where(or(eq(users.email, email), eq(users.userName, userName)));

    if (user) {
      if (user.email === email)
        return { status: "ERROR", message: "Email Already Exists" };
      else
        return {
          status: "ERROR",
          message: "UseName Already Exists",
        };
    }

    const hashPassword = await argon2.hash(password);

    await db
      .insert(users)
      .values({ name, userName, email, password: hashPassword, role });

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

type LoginData = {
  email: string;
  password: string;
};

export const loginUserAction = async (data: LoginData) => {
  try {
    const { email, password } = data;
    console.log(email, password);

    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      return { status: "ERROR", message: "Invalid Email or Password" };
    }

    const isValidPassword = await argon2.verify(user.password, password);

    if (!isValidPassword)
      return { status: "ERROR", message: "Invalid Email or Password" };

    return {
      status: "SUCCESS",
      message: "Login Successful",
    };
  } catch (error) {
    return {
      status: "ERROR",
      message: "Unknown Error Occurred! Please Try Again Later",
    };
  }
};
