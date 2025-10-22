export class UsuarioDto {
  idUsuario?: number;
  idPessoaSigaa: number;
  administrador: boolean; //TRUE-adm FALSE-motorista
  nome: string;
}

export interface FindAllParameters {
  administrador: boolean;
}

export class UsersRouteParameters {
  idUsuario: number;
}

export class UserActionDto {
  userData: UsuarioDto;
  currentUserId: number;
  currentUserName: string;
}
