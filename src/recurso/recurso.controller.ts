import { Controller, Get, Post, Body, Patch, Param, Request, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { RecursoService } from './recurso.service';
import { AuthGuard } from '../auth/auth.guard';
import { recursoDto } from './recurso.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('recurso')
export class RecursoController {
  constructor(private readonly recursoService: RecursoService) {}

//   @Post()
//   @UseGuards(AuthGuard)
//   @UseInterceptors(FileInterceptor('arquivo'))
//   async create(
//          @Body() body: any,
//         @Request() req: any,
//         @UploadedFile() arquivo?: Express.Multer.File,
// ) {
//     const currentUserId = req.user?.sub;
//     const currentUserName = req.user?.login;
//     return this.recursoService.create(recursoDto);
//   }

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
    
    return this.recursoService.create(recursoDto, arquivo);
}





  // @Get()
  // findAll() {
  //   return this.recursoService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.recursoService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() recursoDto: recursoDto) {
  //   return this.recursoService.update(+id, recursoDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.recursoService.remove(+id);
  // }
}
