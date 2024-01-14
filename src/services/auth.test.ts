import { describe, expect, it, vi } from 'vitest';
import bcrypt from 'bcrypt';
import { prismaMock } from '../test-mocks';
import { createUser, hashPassword, login, verifyPassword } from './auth';

vi.mock('bcrypt', async (importOriginal) => {
  const mod = await importOriginal();

  return {
    // @ts-ignore
    ...mod,
    genSalt: vi.fn(),
    hash: vi.fn(),
    compare: vi.fn(),
  };
});

describe('Auth Service', () => {
  describe('createUser', () => {
    it('should create a user', async () => {
      const userData = {
        username: 'testusername',
        name: 'test name',
        password: 'password',
      };

      prismaMock.user.create.mockResolvedValueOnce({
        ...userData,
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const user = await createUser(userData);

      expect(user).toEqual({
        ...userData,
        id: 1,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should throw an error if username is taken', async () => {
      const userData = {
        username: 'testusername',
        name: 'test name',
        password: 'password',
      };

      prismaMock.user.findUnique.mockResolvedValueOnce({
        ...userData,
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      try {
        await createUser(userData);
      } catch (error) {
        expect(error).toEqual(new Error('User already exists'));
      }
    });

    it('should save username as lowercase', async () => {
      const userData = {
        username: 'TESTUSERNAME',
        name: 'test name',
        password: 'password',
      };

      prismaMock.user.create.mockResolvedValueOnce({
        ...userData,
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await createUser(userData);

      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          ...userData,
          username: 'testusername',
          password: expect.any(String),
        },
      });
    });

    it('should hash password', async () => {
      const userData = {
        username: 'testusername',
        name: 'test name',
        password: 'password',
      };

      prismaMock.user.create.mockResolvedValueOnce({
        ...userData,
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await createUser(userData);

      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          ...userData,
          password: expect.not.stringContaining('password'),
        },
      });
    });
  });

  describe('hashPassword', () => {
    it('should hash password', async () => {
      const hashedPassword = await hashPassword('password');

      expect(hashedPassword).toEqual(expect.not.stringContaining('password'));
    });
  });

  describe('verifyPassword', () => {
    it('should return true if password is valid', async () => {
      const hashedPassword = await hashPassword('password');
      const isValid = await verifyPassword('password', hashedPassword);

      expect(isValid).toBe(true);
    });

    it('should return false if password is invalid', async () => {
      const hashedPassword = await hashPassword('password');
      const isValid = await verifyPassword('invalidpassword', hashedPassword);

      expect(isValid).toBe(false);
    });
  });

  describe('login', () => {
    it('should return user if credentials are valid', async () => {
      const userData = {
        username: 'testusername',
        name: 'test name',
        password: 'password',
      };

      prismaMock.user.findUnique.mockResolvedValueOnce({
        ...userData,
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      vi.spyOn(bcrypt, 'compare').mockImplementation(async () => true);

      const user = await login(userData.username, userData.password);

      expect(user).toEqual({
        ...userData,
        id: 1,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should throw an error if user does not exist', async () => {
      const userData = {
        username: 'testusername',
        name: 'test name',
        password: 'password',
      };

      prismaMock.user.findUnique.mockResolvedValueOnce(null);

      expect(login(userData.username, userData.password)).rejects.toEqual(
        new Error('Invalid credentials'),
      );
    });

    it('should throw an error if password is invalid', async () => {
      const userData = {
        username: 'testusername',
        name: 'test name',
        password: 'password',
      };

      prismaMock.user.findUnique.mockResolvedValueOnce({
        ...userData,
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      vi.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

      expect(login(userData.username, 'invalidpassword')).rejects.toEqual(
        new Error('Invalid credentials'),
      );
    });
  });
});
