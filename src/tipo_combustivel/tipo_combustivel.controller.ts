import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  TipoCombustivelDto,
  TipoCombustivelRouteParams,
} from './tipo_combustivel.dto';
import { TipoCombustivelService } from './tipo_combustivel.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('tipo-combustivel')
@UseGuards(AuthGuard)
export class TipoCombustivelController {
  constructor(
    private readonly tipoCombustivelService: TipoCombustivelService,
  ) {}

  @Post()
  create(@Body() dto: TipoCombustivelDto, @Request() req: any) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return this.tipoCombustivelService.create(dto, currentUserId, currentUserName);
  }

  @Patch(':id_tipo_combustivel')
  update(
    @Param() params: TipoCombustivelRouteParams,
    @Body() dto: TipoCombustivelDto,
    @Request() req: any,
  ) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return this.tipoCombustivelService.update(
      params.id_tipo_combustivel,
      dto,
      currentUserId,
      currentUserName
    );
  }

  @Get()
  findAll() {
    return this.tipoCombustivelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tipoCombustivelService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: any) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return this.tipoCombustivelService.remove(+id, currentUserId, currentUserName);
  }
}
