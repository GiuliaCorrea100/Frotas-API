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
  MultaDto,
  FindAllParameters,
  MultaRouteParameters,
} from './multa.dto';
import { MultaService } from './multa.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('multa')
export class MultaController {
  constructor(private readonly MultaService: MultaService) {}

  @Get('/:idMulta')
  async findById(@Param('idMulta') idMulta: number): Promise<MultaDto> {
    return this.MultaService.findById(idMulta);
  }

  @Patch('/deletar-multa/:idMulta')
  @UseGuards(AuthGuard)
  async softRemove(
    @Param('idMulta') idMulta: number,
    @Request() req: any,
  ): Promise<void> {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;

    return this.MultaService.softRemove(
      idMulta,
      currentUserId,
      currentUserName,
    );
  }

  @Get()
  async findAll(@Query() params: FindAllParameters): Promise<MultaDto[]> {
    return this.MultaService.findAll(params);
  }

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() multa: MultaDto,
    @Request() req: any,
  ): Promise<{
    multa: MultaDto;
    motoristaResponsavel?: {
      idMotorista: number;
      nomeMotorista: string;
    } | null;
  }> {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return await this.MultaService.create(
      multa,
      currentUserId,
      currentUserName,
    );
  }

  @Put('/:idMulta')
  @UseGuards(AuthGuard)
  async update(
    @Param() params: MultaRouteParameters,
    @Body() multa: MultaDto,
    @Request() req: any,
  ) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    await this.MultaService.update(
      params.idMulta,
      multa,
      currentUserId,
      currentUserName,
    );
  }
}
