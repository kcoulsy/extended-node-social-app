import prisma from "../db";
import bcrypt from "bcrypt";
import { User } from "@prisma/client";

interface CreateUser {
  username: string;
  name: string;
  password: string;
}

/**
 * Creates a user if the username is not taken
 *
 * @param {CreateUser}
 * @returns {User}
 */
export async function createUser({
  username,
  name,
  password,
}: CreateUser): Promise<User> {
  const usernameLowercase = username.toLowerCase();
  const existingUser = await prisma.user.findUnique({
    where: {
      username: usernameLowercase,
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      username: usernameLowercase,
      name,
      password: hashedPassword,
    },
  });

  return user;
}

/**
 * Creates a hash from a password
 *
 * @param password string
 * @returns
 */
export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

/**
 * Compares a password with a hashed password
 *
 * @param password string
 * @param hashedPassword string
 * @returns
 */
export async function verifyPassword(password: string, hashedPassword: string) {
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
}

/**
 * Logs in a user if the user exists and the password is correct
 *
 * @param username string
 * @param password string
 * @returns
 */
export async function login(username: string, password: string) {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isValid = await verifyPassword(password, user.password);

  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  return user;
}
