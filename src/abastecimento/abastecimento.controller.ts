import {
  BadRequestException,
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
  AbastecimentoDto,
  AbastecimentoRouteParameters,
  FindAllParameters,
} from './abastecimento.dto';
import { AbastecimentoService } from './abastecimento.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('abastecimento')
@UseGuards(AuthGuard)
export class AbastecimentoController {
  constructor(private readonly abastecimentoService: AbastecimentoService) {}

  @Post()
  async create(
    @Body() abastecimento: AbastecimentoDto,
    @Request() req: any,
  ): Promise<AbastecimentoDto> {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return await this.abastecimentoService.create(
      abastecimento,
      currentUserId,
      currentUserName,
    );
  }

  @Get('consumoPorCampus')
  async ConsumoPorCampus() {
    return this.abastecimentoService.ConsumoPorCampus();
  }

  @Get('/:idAbastecimento')
  async findById(
    @Param('idAbastecimento') idAbastecimento: number,
  ): Promise<AbastecimentoDto> {
    return this.abastecimentoService.findById(idAbastecimento);
  }

  @Get('buscar-por-corrida/:idCorrida')
  async findByIdCorrida(
    @Param('idCorrida') idCorrida: number,
  ): Promise<AbastecimentoDto[]> {
    return this.abastecimentoService.findByIdCorrida(idCorrida);
  }

  @Get()
  async findAll(
    @Query() params: FindAllParameters,
  ): Promise<AbastecimentoDto[]> {
    return this.abastecimentoService.findAll(params);
  }

  @Patch('edicao-abastecimento/:idAbastecimento')
  async updateAbastecimento(
    @Param('idAbastecimento') idAbastecimento: number,
    @Body() abastecimento: AbastecimentoDto,
    @Request() req: any,
  ) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return this.abastecimentoService.updateAbastecimento(
      idAbastecimento,
      abastecimento,
      currentUserId,
      currentUserName,
    );
  }

  @Put('/:idAbastecimento')
  async update(
    @Param() params: AbastecimentoRouteParameters,
    @Body() abastecimento: AbastecimentoDto,
    @Request() req: any,
  ) {
    if (!abastecimento || Object.keys(abastecimento).length === 0) {
      throw new BadRequestException('Nenhum dado enviado para atualização.');
    }
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    await this.abastecimentoService.update(
      params.idAbastecimento,
      abastecimento,
      currentUserId,
      currentUserName,
    );
  }

  @Patch('/deletar-abastecimento/:idAbastecimento')
  @UseGuards(AuthGuard)
  async softRemove(
    @Param('idAbastecimento') idAbastecimento: number,
    @Request() req: any,
  ): Promise<void> {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    console.log(idAbastecimento);

    return this.abastecimentoService.softRemove(
      
      idAbastecimento,
      currentUserId,
      currentUserName,
    );
  }

  @Delete('/:idAbastecimento')
  remove(
    @Param('idAbastecimento') idAbastecimento: number,
    @Request() req: any,
  ) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return this.abastecimentoService.remove(
      idAbastecimento,
      currentUserId,
      currentUserName,
    );
  }
}
