export class UploadFileDto {
  arquivo: Express.Multer.File;
}

export class AnexoVistoriaDto {
  idCorridaVistoria: number;
  urlArquivo: string;
}
