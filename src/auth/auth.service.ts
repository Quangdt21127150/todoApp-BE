import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './user.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async register(
    fullname: string,
    email: string,
    phone: string,
    username: string,
    password: string,
  ): Promise<User> {
    const existingUser = await this.userModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      throw new BadRequestException('Username or email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new this.userModel({
      fullname,
      email,
      phone,
      username,
      password: hashedPassword,
    });
    return user.save();
  }

  async login(username: string, password: string) {
    const user = await this.userModel.findOne({ username });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    return this.generateToken(user);
  }

  private generateToken(user: User) {
    const accessTokenPayload = {
      sub: user._id,
      username: user.username,
      type: 'access_token',
    };

    const refreshTokenPayload = {
      sub: user._id,
      type: 'refresh_token',
    };

    return {
      access_token: this.jwtService.sign(accessTokenPayload, {
        expiresIn: '15m',
      }),
      refresh_token: this.jwtService.sign(refreshTokenPayload, {
        expiresIn: '7d',
      }),
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        fullname: user.fullname,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);

      if (payload.type !== 'refresh_token') {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.userModel.findById(payload.sub).exec();
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.generateToken(user);
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Verify refresh token failed');
    }
  }
}
