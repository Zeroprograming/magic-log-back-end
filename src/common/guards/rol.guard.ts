import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoleId } from '../../models/user/user-role.enum';
import { ROLES_KEY } from '../decorators/rol.decorator';
import { Repository } from 'typeorm';
import { User } from '../../databases/postgres/entities/user.entity';

@Injectable()
export class RolGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<UserRoleId[]>(
      ROLES_KEY,
      context.getHandler(),
    );

    if (!requiredRoles) {
      return true; // Si no hay roles especificados, permite la acción
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // El usuario está en la request debido al JwtAuthGuard

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    // Verificamos si el rol del usuario está en la lista de roles permitidos
    const existingUser = await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['role'], // Obtener la relación con el rol
      select: ['id', 'role'], // Seleccionar solo los campos necesarios
    });

    if (!existingUser) {
      throw new UnauthorizedException('User not found in the database.');
    }

    // Verificar que el rol del usuario coincide con uno de los roles requeridos
    if (!requiredRoles.some((role) => existingUser.role.id === role)) {
      throw new UnauthorizedException(
        'You do not have permission to perform this action.',
      );
    }

    return true;
  }
}
