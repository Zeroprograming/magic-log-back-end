import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import {
  CreateProductDto,
  ListaProductosResponse,
  ProductResponse,
  UpdateProductDto,
} from '../../models/product/product.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ProductFiltersDto } from '../../models/product/product.interfaces';
import { Roles } from '../../common/decorators/rol.decorator';
import { UserRoleId } from '../../models/user/user-role.enum';
import { RolGuard } from '../../common/guards/rol.guard';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'SKU validation' })
  @ApiResponse({ status: 200, description: 'SKU is available.' })
  @ApiResponse({ status: 400, description: 'SKU already exists.' })
  @Get('sku-validation')
  async skuValidation(@Query('sku') sku: string) {
    return this.productService.skuValidation(sku);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({
    status: 200,
    description: 'Product found.',
    type: ProductResponse,
  })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @Get('get')
  async getProductById(@Query('id') id: number) {
    return this.productService.getProductById(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get paginated list of products' })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated products with metadata.',
    type: ListaProductosResponse,
  })
  @Get()
  async getProducts(
    @Query() filters: ProductFiltersDto,
  ): Promise<ListaProductosResponse> {
    return this.productService.getProducts(filters);
  }

  @UseGuards(JwtAuthGuard, RolGuard) // Usa el guardia de roles
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ status: 201, description: 'Product created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @Roles(UserRoleId.Admin, UserRoleId.Seller) // Aplica el decorador con los roles necesarios
  @Post('create')
  async createProduct(@Body() product: CreateProductDto, @Request() req) {
    const { id } = req.user; // Extraído del JWT
    return this.productService.createProduct(product, id);
  }

  @UseGuards(JwtAuthGuard, RolGuard) // Usa el guardia de roles
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a product' })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ status: 200, description: 'Product updated successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @Roles(UserRoleId.Admin, UserRoleId.Seller) // Aplica el decorador con los roles necesarios
  @Put('update')
  async updateProduct(@Body() product: UpdateProductDto, @Request() req) {
    const { id } = req.user; // Extraído del JWT
    return this.productService.updateProduct(product, id);
  }

  @UseGuards(JwtAuthGuard, RolGuard) // Usa el guardia de roles
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @Roles(UserRoleId.Admin, UserRoleId.Seller) // Aplica el decorador con los roles necesarios
  @Delete('delete')
  async deleteProduct(@Query('id') id: number, @Request() req) {
    const userId = req.user.id; // Extraído del JWT
    return this.productService.deleteProduct(id, userId);
  }
}
