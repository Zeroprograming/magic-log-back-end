import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { User } from '../../databases/postgres/entities/user.entity';
import { LoginDto, RegisterDto } from '../../models/auth/auth.dto';
import { Role } from '../../databases/postgres/entities/role.entity';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
    @Inject('ROLE_REPOSITORY')
    private readonly roleRepository: Repository<Role>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginDto): Promise<User | null> {
    const { email, password } = loginDto;

    // Incluye la relación 'role' al buscar el usuario, pero selecciona solo los campos que necesitas
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['role'], // Especifica que deseas incluir la relación 'role'
      select: {
        role: {
          id: true,
          name: true,
        },
      },
    });

    if (user && (await user.comparePassword(password))) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const accessPayload = { email: user.email, sub: user.id, role: user.role };
    const refreshPayload = { sub: user.id };

    const accessToken = this.jwtService.sign(accessPayload, {
      expiresIn: '1d',
    });
    const refreshToken = this.jwtService.sign(refreshPayload, {
      expiresIn: '7d',
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken, // El refresh token será enviado pero almacenado en una cookie
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password, role } = registerDto;

    // 1. Verificar si el correo electrónico ya está registrado
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new UnauthorizedException('Email is already registered.');
    }

    // 2. Verificar si el rol proporcionado existe
    const existingRole = await this.roleRepository.findOne({
      where: { id: role },
    });

    if (!existingRole) {
      throw new UnauthorizedException('Role not found.');
    }

    // 4. Crear un nuevo usuario
    const newUser = this.userRepository.create({
      email,
      password, // La contraseña será hasheada en la entidad User automáticamente
      role: existingRole,
    });

    try {
      await this.userRepository.save(newUser);
    } catch (error) {
      // 5. Manejo de errores si la inserción falla (por ejemplo, errores de la base de datos)
      throw new BadRequestException('Error creating user: ' + error.message);
    }

    // 6. Eliminar la contraseña del objeto de respuesta antes de devolverlo
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = newUser;

    return userWithoutPassword;
  }

  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['role', 'cart', 'cart.items'], // Incluir role, cart y cart items
      select: {
        id: true,
        email: true,
        role: {
          id: true,
          name: true,
        },
        cart: {
          id: true,
          items: {
            id: true,
            product: {
              id: true,
              name: true,
            },
            quantity: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    return user;
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing.');
    }

    try {
      const payload = this.jwtService.verify(refreshToken);

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
        relations: ['role'],
      });
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token.');
      }

      const accessPayload = {
        email: user.email,
        sub: user.id,
        role: user.role,
      };

      const newAccessToken = this.jwtService.sign(accessPayload, {
        expiresIn: '1d',
      });

      return { access_token: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException(
        'Invalid or expired refresh token.',
        error,
      );
    }
  }
}
