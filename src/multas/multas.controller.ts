import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Query,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  MultasDto,
  FindAllParameters,
  MultasRouteParameters,
} from './multas.dto';
import { MultasService } from './multas.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('multas')
export class MultasController {
  constructor(private readonly multasService: MultasService) {}

  // Rotas públicas (sem AuthGuard)
  @Get('/:idMultas')
  async findById(@Param('idMultas') idMultas: number): Promise<MultasDto> {
    return this.multasService.findById(idMultas);
  }

  @Patch('/deletar-multa/:idMultas')
  async softRemove(@Param('idMultas') idMultas: number): Promise<void> {
    return this.multasService.softRemove(idMultas);
  }

  @Get()
  async findAll(@Query() params: FindAllParameters): Promise<MultasDto[]> {
    return this.multasService.findAll(params);
  }
  // Rotas protegidas (com AuthGuard)
  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() multas: MultasDto,
    @Request() req: any,
  ): Promise<MultasDto> {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return await this.multasService.create(
      multas,
      currentUserId,
      currentUserName,
    );
  }

  @Put('/:idMulta')
  @UseGuards(AuthGuard)
  async update(
    @Param() params: MultasRouteParameters,
    @Body() multa: MultasDto,
    @Request() req: any,
  ) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    await this.multasService.update(
      params.idMulta,
      multa,
      currentUserId,
      currentUserName,
    );
  }
}
