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
  async create(@Body() carros: CarrosDto, @Request() req: any): Promise<CarrosDto> {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return await this.carrosService.create(carros, currentUserId, currentUserName);
  }

  @Get('/:idCarros')
  async findById(@Param('idCarros') idCarros: number): Promise<CarrosDto> {
    return this.carrosService.findById(idCarros);
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

  @Put('/:idCarros')
  async update(
    @Param() params: CarrosRouteParameters,
    @Body() carros: CarrosDto,
    @Request() req: any,
  ) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    await this.carrosService.update(
      params.idCarros,
      carros,
      currentUserId,
      currentUserName
    );
  }

  @Delete('/:idCarros')
  remove(@Param('idCarros') idCarros: number, @Request() req: any) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return this.carrosService.remove(idCarros, currentUserId, currentUserName);
  }

  @Patch(':id/inativar')
  async inativar(@Param('id') id: number, @Request() req: any) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return this.carrosService.inativar(id, currentUserId, currentUserName);
  }
}
