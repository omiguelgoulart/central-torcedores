
export type AdminRole = "ADMIN" | "PORTARIA"

export type AdminRow = {
  id: string
  nome: string
  email: string
  criadoEm: string
  ativo: boolean
  role: AdminRole
}
