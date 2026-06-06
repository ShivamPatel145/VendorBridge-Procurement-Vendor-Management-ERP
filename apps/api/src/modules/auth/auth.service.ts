import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../../config/env';
import { AuthRepository } from './auth.repository';
import { cacheService } from '../../shared/services/cache.service';
import { EmailService } from '../../shared/services/email.service';
import { ConflictError, UnauthorizedError, NotFoundError } from '../../shared/errors/AppError';
import { ActivityLogger } from '../../shared/utils/activityLogger';

export class AuthService {
  public static async register(data: any, ipAddress?: string) {
    const existing = await AuthRepository.findByEmail(data.email);
    if (existing) {
      throw new ConflictError('A user with this email already exists');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await AuthRepository.createUser(
      {
        name: data.name,
        email: data.email,
        passwordHash,
        role: data.role,
      },
      data.role === 'VENDOR'
        ? {
            companyName: data.companyName,
            contactPerson: data.contactPerson,
            phone: data.phone,
            address: data.address,
          }
        : undefined
    );

    await ActivityLogger.log({
      userId: user.id,
      action: 'REGISTER',
      entity: 'User',
      entityId: user.id,
      ipAddress,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  public static async login(data: any, ipAddress?: string) {
    const user = await AuthRepository.findByEmail(data.email);
    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(data.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as SignOptions);
    const refreshToken = jwt.sign(payload, env.REFRESH_TOKEN_SECRET, { expiresIn: env.REFRESH_TOKEN_EXPIRES_IN } as SignOptions);

    await cacheService.set(`ref_token:${user.id}:${refreshToken}`, '1', 604800);

    await ActivityLogger.log({
      userId: user.id,
      action: 'LOGIN',
      entity: 'User',
      entityId: user.id,
      ipAddress,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  public static async refresh(token: string) {
    try {
      const decoded = jwt.verify(token, env.REFRESH_TOKEN_SECRET) as any;
      
      const active = await cacheService.get(`ref_token:${decoded.userId}:${token}`);
      if (!active) {
        throw new UnauthorizedError('Invalid refresh token');
      }

      const payload = { userId: decoded.userId, email: decoded.email, role: decoded.role };
      const accessToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as SignOptions);
      const newRefreshToken = jwt.sign(payload, env.REFRESH_TOKEN_SECRET, { expiresIn: env.REFRESH_TOKEN_EXPIRES_IN } as SignOptions);

      await cacheService.del(`ref_token:${decoded.userId}:${token}`);
      await cacheService.set(`ref_token:${decoded.userId}:${newRefreshToken}`, '1', 604800);

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch {
      throw new UnauthorizedError('Invalid refresh token');
    }
  }

  public static async logout(userId: string, token: string) {
    await cacheService.del(`ref_token:${userId}:${token}`);
  }

  public static async getMe(userId: string) {
    const user = await AuthRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('User');
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };
  }

  public static async forgotPassword(email: string) {
    const user = await AuthRepository.findByEmail(email);
    if (!user) {
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    await cacheService.set(`reset_pass:${resetToken}`, user.id, 3600);

    const resetLink = `${env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    await EmailService.sendEmail({
      to: user.email,
      subject: 'Reset your VendorBridge Password',
      template: 'forgot_password',
      html: `
        <h1>Password Reset Request</h1>
        <p>Hi ${user.name},</p>
        <p>You requested a password reset. Click the link below to set a new password:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>This link is valid for 1 hour.</p>
      `,
    });
  }

  public static async resetPassword(data: any) {
    const userId = await cacheService.get(`reset_pass:${data.token}`);
    if (!userId) {
      throw new UnauthorizedError('Invalid or expired reset token');
    }

    const passwordHash = await bcrypt.hash(data.newPassword, 10);
    await AuthRepository.updatePassword(userId, passwordHash);
    await cacheService.del(`reset_pass:${data.token}`);
  }
}

export default AuthService;
