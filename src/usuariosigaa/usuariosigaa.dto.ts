/* eslint-disable prettier/prettier */
import { IsString, IsNumber } from 'class-validator';

export class UsuarioSigaaDto {

    @IsNumber()
    idUsuarioSigaa: number;

    @IsNumber()
    idPessoaSigaa: number;

    @IsString()
    login: string;

    @IsString()
    senha: string;

    @IsString()
    nome: string;

    @IsString()
    email: string;
  }
  
  
  export interface FindAllParameters {
      login: string;
      
  }
  