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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CarroDto, CarroRouteParameters, FindAllParameters } from './carro.dto';
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
      undefined,
      currentUserId,
      currentUserName,
    );
  }

  @Post('com-arquivo')
  @UseInterceptors(FileInterceptor('arquivo'))
  async criarComArquivo(
    @Body() body: any,
    @Request() req: any,
    @UploadedFile() arquivo?: Express.Multer.File,
  ) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;

    const tomboParsed = parseInt(body.tombo, 10);
    const anoParsed = parseInt(body.ano, 10);
    const idTipoCombustivelParsed = parseInt(body.idTipoCombustivel, 10);

    const dadosVeiculo: CarroDto = {
      placa: body.placa,
      odometro: body.odometro,
      modelo: body.modelo,
      ano: isNaN(anoParsed) ? 0 : anoParsed,
      tombo: isNaN(tomboParsed) ? 0 : tomboParsed,
      localidadeFisica: body.localidadeFisica,
      ativo: body.ativo === 'true' || body.ativo === true,
      situacao: body.situacao || 'DISPONIVEL',
      idTipoCombustivel: isNaN(idTipoCombustivelParsed) ? 0 : idTipoCombustivelParsed,
    };

    return await this.carroService.create(
      dadosVeiculo,
      arquivo,
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
    console.log('Carro: ', carro);
    await this.carroService.update(
      params.idCarro,
      carro,
      currentUserId,
      currentUserName,
    );
  }

  @Put('/:idCarro/arquivo')
  @UseInterceptors(FileInterceptor('arquivo'))
  async atualizarArquivo(
    @Param('idCarro') idCarro: number,
    @UploadedFile() arquivo: Express.Multer.File,
    @Request() req: any,
  ) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;

    await this.carroService.atualizarArquivo(
      idCarro,
      arquivo,
      currentUserId,
      currentUserName,
    );
  }

  @Delete('/:idCarro/arquivo')
  async removerArquivo(
    @Param('idCarro') idCarro: number,
    @Request() req: any,
  ) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;

    await this.carroService.removerArquivo(
      idCarro,
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

  @Patch('/atualizar-odometro/:idCarro')
  async atualizarOdometro(
    @Param('idCarro') idCarro: number, 
    @Body() body: { odometro: number },
    @Request() req: any) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return this.carroService.atualizarOdometro(idCarro, body.odometro, currentUserId, currentUserName);
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
