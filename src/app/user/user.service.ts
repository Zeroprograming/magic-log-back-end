import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../../databases/postgres/entities/user.entity';
import { Role } from '../../databases/postgres/entities/role.entity';
import {
  ListaUsuariosResponse,
  UserProfileFiltersDto,
} from '../../models/user/user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: Repository<User>,
    @Inject('ROLE_REPOSITORY')
    private readonly roleRepository: Repository<Role>,
  ) {}

  async getUsersByRole(
    filters: UserProfileFiltersDto,
  ): Promise<ListaUsuariosResponse> {
    // Construir la consulta con filtros y paginación
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.cart', 'cart');

    // Aplicar filtros
    if (filters.name) {
      queryBuilder.andWhere('user.email LIKE :name', {
        name: `%${filters.name}%`,
      });
    }

    if (filters.email) {
      queryBuilder.andWhere('user.email LIKE :email', {
        email: `%${filters.email}%`,
      });
    }

    if (filters.role) {
      queryBuilder.andWhere('role.id = :roleId', { roleId: filters.role });
    }

    // Aplicar orden
    if (filters.sort) {
      queryBuilder.addOrderBy(
        `user.${filters.sort}`,
        (filters.order || 'ASC').toUpperCase() as 'ASC' | 'DESC',
      );
    }

    // Aplicar paginación
    if (filters.page && filters.limit) {
      queryBuilder.skip((filters.page - 1) * filters.limit).take(filters.limit);
    }

    // Obtener los resultados
    const [users, total] = await queryBuilder.getManyAndCount();

    // Calcular la metainformación de la paginación
    const lastPage = Math.ceil(total / (filters.limit || 10));
    const metadata = {
      total,
      per_page: filters.limit || 10,
      current_page: filters.page || 1,
      last_page: lastPage,
      next_page_url:
        filters.page < lastPage
          ? `/users/list/${filters.role}?page=${filters.page + 1}`
          : null,
      prev_page_url:
        filters.page > 1
          ? `/users/list/${filters.role}?page=${filters.page - 1}`
          : null,
    };

    // Mapear los usuarios a UserProfileDto
    const usersDto = users.map((user) => {
      const { id, email, role, cart } = user;
      return { id, email, role, cart };
    });

    return {
      users: usersDto,
      meta: metadata,
    };
  }
}
