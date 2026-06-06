import bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';
import { ConflictError, NotFoundError } from '../../shared/errors/AppError';
import { ActivityLogger } from '../../shared/utils/activityLogger';

export class UsersService {
  private static sanitize(user: any) {
    if (!user) return null;
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }

  public static async createUser(data: any, actorId: string, ipAddress?: string) {
    const existing = await UsersRepository.findByEmail(data.email);
    if (existing) {
      throw new ConflictError('A user with this email already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await UsersRepository.create({
      name: data.name,
      email: data.email,
      passwordHash,
      role: data.role,
    });

    await ActivityLogger.log({
      userId: actorId,
      action: 'CREATE_USER',
      entity: 'User',
      entityId: user.id,
      ipAddress,
    });

    return this.sanitize(user);
  }

  public static async getUser(id: string) {
    const user = await UsersRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User');
    }
    return this.sanitize(user);
  }

  public static async updateUser(id: string, data: any, actorId: string, ipAddress?: string) {
    const user = await UsersRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User');
    }

    if (data.email && data.email !== user.email) {
      const existing = await UsersRepository.findByEmail(data.email);
      if (existing) {
        throw new ConflictError('A user with this email already exists');
      }
    }

    const updates: any = { ...data };
    if (data.password) {
      updates.passwordHash = await bcrypt.hash(data.password, 10);
      delete updates.password;
    }

    const updated = await UsersRepository.update(id, updates);

    await ActivityLogger.log({
      userId: actorId,
      action: 'UPDATE_USER',
      entity: 'User',
      entityId: id,
      ipAddress,
    });

    return this.sanitize(updated);
  }

  public static async deleteUser(id: string, actorId: string, ipAddress?: string) {
    const user = await UsersRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User');
    }

    await UsersRepository.delete(id);

    await ActivityLogger.log({
      userId: actorId,
      action: 'DELETE_USER',
      entity: 'User',
      entityId: id,
      ipAddress,
    });
  }

  public static async listUsers(params: {
    role?: string;
    search?: string;
    page: number;
    limit: number;
  }) {
    const { users, total } = await UsersRepository.list(params);
    return {
      users: users.map(u => this.sanitize(u)),
      total,
    };
  }
}

export default UsersService;
