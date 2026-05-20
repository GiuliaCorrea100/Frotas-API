import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Put,
  Patch,
} from '@nestjs/common';
import { RecursoService } from './recurso.service';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('recurso')
export class RecursoController {
  constructor(private readonly recursoService: RecursoService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('arquivo'))
  async create(
    @Body() body: any,
    @Request() req: any,
    @UploadedFile() arquivo?: Express.Multer.File,
  ) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;

    if (!body.justificativa || !body.idMulta) {
      throw new Error('Campos obrigatórios: justificativa e idMulta');
    }

    const recursoDto = {
      justificativa: body.justificativa,
      idMulta: body.idMulta,
    };

    return this.recursoService.create(
      recursoDto,
      arquivo,
      currentUserId,
      currentUserName,
    );
  }

  @Get('/multa/:idMulta')
  @UseGuards(AuthGuard)
  async findByMulta(@Param('idMulta') idMulta: string) {
    return this.recursoService.findByMulta(Number(idMulta));
  }

  @Patch('/aceitar/:idMulta')
  @UseGuards(AuthGuard)
  async aceitarRecurso(@Param('idMulta') idMulta: number, @Request() req: any) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;

    return this.recursoService.aceitarRecurso(
      idMulta,
      currentUserId,
      currentUserName,
    );
  }

  @Put('/rejeitar/:idMulta')
  @UseGuards(AuthGuard)
  async rejeitarRecurso(
    @Param('idMulta') idMulta: number,
    @Body() body: { justificativaRejeicao: string },
    @Request() req: any,
  ) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;

    return this.recursoService.rejeitarRecurso(
      idMulta,
      body.justificativaRejeicao,
      currentUserId,
      currentUserName,
    );
  }
}
