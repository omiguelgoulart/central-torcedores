export type TipoSetor = "ARQUIBANCADA" | "CADEIRA" | "CAMAROTE"

export interface Setor {
  id: number
  nome: string
  capacidade: number
  tipo: TipoSetor
}
