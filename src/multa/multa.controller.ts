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
  UseInterceptors,
  UploadedFile,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import {
  MultaDto,
  FindAllParameters,
  MultaRouteParameters,
} from './multa.dto';
import { MultaService } from './multa.service';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('multa')
export class MultaController {
  constructor(private readonly multaService: MultaService) {}

  @Get('/:idMulta')
  async findById(@Param('idMulta') idMulta: number): Promise<MultaDto> {
    return this.multaService.findById(idMulta);
  }

  @Patch('/deletar-multa/:idMulta')
  @UseGuards(AuthGuard)
  async softRemove(
    @Param('idMulta') idMulta: number,
    @Request() req: any,
  ): Promise<void> {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;

    return this.multaService.softRemove(
      idMulta,
      currentUserId,
      currentUserName,
    );
  }

  @Get()
  async findAll(@Query() params: FindAllParameters): Promise<MultaDto[]> {
    return this.multaService.findAll(params);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() multa: MultaDto,
    @Request() req: any,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<{
    multa: MultaDto;
    mensagem?: string;
    motoristaResponsavel?: {
      idMotorista: number;
      nomeMotorista: string;
    } | null;
  }> {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return await this.multaService.create(
      multa,
      file,
      currentUserId,
      currentUserName,
    );
  }

  @Post('com-arquivo')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('arquivo'))
  async criarMultaComArquivo(
    @Body() body: any,
    @Request() req: any,
    @UploadedFile() arquivo?: Express.Multer.File,
  ) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;

    const dataHoraInfracao = new Date(body.dataInfracao);

    if (isNaN(dataHoraInfracao.getTime())) {
      throw new BadRequestException('Data/hora da infração inválida');
    }

    const dados = {
      codigoInfracao: Number(body.codigoInfracao),
      classificacao: body.classificacao,
      valorInfracao: Number(body.valorInfracao),
      placaVeiculo: body.placaVeiculo,
      dataInfracao: dataHoraInfracao,
      autoInfracao: Number(body.autoInfracao),
    };

    return await this.multaService.create(
      dados,
      arquivo,
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
    await this.multaService.update(
      params.idMulta,
      multa,
      currentUserId,
      currentUserName,
    );
  }

  @Put('/:idMulta/arquivo')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('arquivo'))
  async atualizarArquivo(
    @Param('idMulta') idMulta: number,
    @UploadedFile() arquivo: Express.Multer.File,
    @Request() req: any,
  ) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;

    await this.multaService.atualizarArquivo(
      idMulta,
      arquivo,
      currentUserId,
      currentUserName,
    );
  }

  @Put('/:idMulta/comprovante')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('arquivo'))
  async atualizarComprovante(
    @Param('idMulta') idMulta: number,
    @UploadedFile() arquivo: Express.Multer.File,
    @Request() req: any,
  ) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;

    await this.multaService.atualizarComprovantePagamento(
      idMulta,
      arquivo,
      currentUserId,
      currentUserName,
    );
  }

  @Patch('/:idMulta/aprovar-comprovante')
  @UseGuards(AuthGuard)
  async aprovarComprovante(
    @Param('idMulta') idMulta: number,
    @Request() req: any,
  ) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;

    return this.multaService.aprovarPagamento(
      idMulta,
      currentUserId,
      currentUserName,
    );
  }

  @Patch('/:idMulta/reprovar-comprovante')
  @UseGuards(AuthGuard)
  async reprovarComprovante(
    @Param('idMulta') idMulta: number,
    @Body() body: { motivo: string },
    @Request() req: any,
  ) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;

    return this.multaService.reprovarPagamento(
      idMulta,
      body.motivo,
      currentUserId,
      currentUserName,
    );
  }

  @Patch('/:idMulta/aceitar-recurso')
  @UseGuards(AuthGuard)
  async aceitarRecurso(
    @Param('idMulta') idMulta: number,
    @Request() req: any,
  ) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;

    return this.multaService.aceitarRecurso(
      idMulta,
      currentUserId,
      currentUserName,
    );
  }

  @Delete('/:idMulta/arquivo')
  @UseGuards(AuthGuard)
  async removerArquivo(
    @Param('idMulta') idMulta: number,
    @Request() req: any,
  ) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;

    await this.multaService.removerArquivo(
      idMulta,
      currentUserId,
      currentUserName,
    );
  }

  @Delete('/:idMulta/comprovante')
  @UseGuards(AuthGuard)
  async removerArquivoComprovante(
    @Param('idMulta') idMulta: number,
    @Request() req: any,
  ) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;

    await this.multaService.removerArquivoComprovante(
      idMulta,
      currentUserId,
      currentUserName,
    );
  }
}