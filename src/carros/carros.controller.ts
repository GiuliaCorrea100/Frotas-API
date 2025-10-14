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
  CarrosDto,
  CarrosRouteParameters,
  FindAllParameters,
} from './carros.dto';
import { CarrosService } from './carros.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('carros')
@UseGuards(AuthGuard)
export class CarrosController {
  constructor(private readonly carrosService: CarrosService) {}

  @Post()
  async create(
    @Body() carro: CarrosDto,
    @Request() req: any,
  ): Promise<CarrosDto> {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return await this.carrosService.create(
      carro,
      currentUserId,
      currentUserName,
    );
  }

  @Get('/:idCarro')
  async findById(@Param('idCarro') idCarro: number): Promise<CarrosDto> {
    return this.carrosService.findById(idCarro);
  }

  @Get('/buscar-placa/:placa')
  async findByPlaca(@Param('placa') placa: string): Promise<CarrosDto[]> {
    return this.carrosService.findByPlaca(placa);
  }

  @Get('/buscar-modelo-placa/:modeloPlaca')
  async findByModeloPlaca(
    @Param('modeloPlaca') modeloPlaca: string,
  ): Promise<CarrosDto[]> {
    return this.carrosService.findByModeloPlaca(modeloPlaca);
  }

  @Get()
  async findAll(@Query() params: FindAllParameters): Promise<CarrosDto[]> {
    return this.carrosService.findAll(params);
  }

  @Get('/por-tombo/:tombo')
  async findByTombo(@Param('tombo') tombo: number): Promise<CarrosDto> {
    return this.carrosService.findByTombo(tombo);
  }

  @Put('/:idCarro')
  async update(
    @Param() params: CarrosRouteParameters,
    @Body() carros: CarrosDto,
    @Request() req: any,
  ) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    await this.carrosService.update(
      params.idCarro,
      carros,
      currentUserId,
      currentUserName,
    );
  }

  @Delete('/:idCarro')
  remove(@Param('idCarro') idCarro: number, @Request() req: any) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return this.carrosService.remove(idCarro, currentUserId, currentUserName);
  }

  @Patch(':idCarro/inativar')
  async inativar(@Param('idCarro') idCarro: number, @Request() req: any) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return this.carrosService.inativar(idCarro, currentUserId, currentUserName);
  }
}
