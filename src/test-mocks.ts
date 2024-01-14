import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "vitest-mock-extended";

import prisma from "./db";
import { beforeEach, vi } from "vitest";

vi.mock("./db", () => mockDeep<PrismaClient>());

beforeEach(() => {
  mockReset(prismaMock);
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;
