/* eslint-disable prettier/prettier */
import { IsString, IsNumber } from "class-validator";

export class ServidorSigaaDto {
    
    @IsString()
    idServidor: number;

    @IsNumber()
    idPessoa: number;

}
