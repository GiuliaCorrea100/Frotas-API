import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCorridaVistoriaDto {
  @IsInt()
  @IsNotEmpty()
  idCorrida: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  tipo: string;

  @IsBoolean()
  @IsNotEmpty()
  veiculoRecebidoSemAvarias: boolean;

  @IsString()
  @IsOptional()
  observacoes?: string;
}