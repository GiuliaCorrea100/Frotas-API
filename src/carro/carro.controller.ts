/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  CarroDto,
  CarroRouteParameters,
  FindAllParameters,
} from './carro.dto';
import { carroService } from './carro.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('carro')
@UseGuards(AuthGuard)
export class CarroController {
  constructor(private readonly carroService: carroService) {}

  @Post()
  async create(
    @Body() carro: CarroDto,
    @Request() req: any,
  ): Promise<CarroDto> {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return await this.carroService.create(
      carro,
      currentUserId,
      currentUserName,
    );
  }

  @Get('/:idCarro')
  async findById(@Param('idCarro') idCarro: number): Promise<CarroDto> {
    return this.carroService.findById(idCarro);
  }

  @Get('/buscar-placa/:placa')
  async findByPlaca(@Param('placa') placa: string): Promise<CarroDto[]> {
    return this.carroService.findByPlaca(placa);
  }

  @Get('/buscar-modelo-placa/:modeloPlaca')
  async findByModeloPlaca(
    @Param('modeloPlaca') modeloPlaca: string,
  ): Promise<CarroDto[]> {
    return this.carroService.findByModeloPlaca(modeloPlaca);
  }

  @Get()
  async findAll(@Query() params: FindAllParameters): Promise<CarroDto[]> {
    return this.carroService.findAll(params);
  }

  @Put('/:idCarro')
  async update(
    @Param() params: CarroRouteParameters,
    @Body() carro: CarroDto,
    @Request() req: any,
  ) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    await this.carroService.update(
      params.idCarro,
      carro,
      currentUserId,
      currentUserName,
    );
  }

  @Delete('/:idCarro')
  remove(@Param('idCarro') idCarro: number, @Request() req: any) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return this.carroService.remove(idCarro, currentUserId, currentUserName);
  }

  @Patch(':idCarro/inativar')
  async inativar(@Param('idCarro') idCarro: number, @Request() req: any) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return this.carroService.inativar(idCarro, currentUserId, currentUserName);
  }

  @Patch(':idCarro/situacao')
  async atualizarSituacao(
    @Param('idCarro') idCarro: number,
    @Body() body: { situacao: string },
    @Request() req: any,
  ): Promise<void> {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    await this.carroService.atualizarSituacao(
      idCarro,
      body.situacao,
      currentUserId,
      currentUserName,
    );
  }
}