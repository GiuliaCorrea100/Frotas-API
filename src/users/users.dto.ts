export class UsersDto {
  idUsuario?: number;
  idPessoaSingu: number;
  permissao: number; //1-adm 2-motorista
}

export interface FindAllParameters {
  permissao: number;
}

export class UsersRouteParameters {
  idUsuario: number;
}
