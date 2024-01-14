/* eslint-disable import/no-extraneous-dependencies */
import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';

import { beforeEach, vi } from 'vitest';
import prisma from './db';

vi.mock('./db', () => mockDeep<PrismaClient>());

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

beforeEach(() => {
  mockReset(prismaMock);
});
