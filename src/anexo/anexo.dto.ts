export class UploadFileDto {
  arquivo: Express.Multer.File;
}


export class AnexoVistoriaDto {
  idCorridaVistoriaFoto?: number;
  idCorridaVistoria: number;
  urlArquivo?: string;
  dataUpload?: Date;
}
