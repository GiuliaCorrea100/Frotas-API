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
import { AuthGuard } from '../auth/auth.guard';
import { TipoCombustivelService } from './tipoCombustivel.service';
import {
  TipoCombustivelDto,
  TipoCombustivelRouteParams,
} from './tipoCombustivel.dto';

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
    return this.tipoCombustivelService.create(
      dto,
      currentUserId,
      currentUserName,
    );
  }

  @Patch(':idTipoCombustivel')
  update(
    @Param() params: TipoCombustivelRouteParams,
    @Body() dto: TipoCombustivelDto,
    @Request() req: any,
  ) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return this.tipoCombustivelService.update(
      params.idTipoCombustivel,
      dto,
      currentUserId,
      currentUserName,
    );
  }

  @Get()
  findAll() {
    return this.tipoCombustivelService.findAll();
  }

  @Get(':idTipoCombustivel')
  findOne(@Param('idTipoCombustivel') idTipoCombustivel: string) {
    return this.tipoCombustivelService.findOne(+idTipoCombustivel);
  }

  @Delete(':idTipoCombustivel')
  remove(
    @Param('idTipoCombustivel') idTipoCombustivel: string,
    @Request() req: any,
  ) {
    const currentUserId = req.user?.sub;
    const currentUserName = req.user?.login;
    return this.tipoCombustivelService.remove(
      +idTipoCombustivel,
      currentUserId,
      currentUserName,
    );
  }
}
