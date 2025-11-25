export type Periodicidade = "MENSAL" | "TRIMESTRAL" | "SEMESTRAL" | "ANUAL"

export type BeneficioApi = {
  id: string
  slug: string
  titulo: string
  descricao: string | null
  icone: string | null
  ativo: boolean
  planoId: string
  ordem: number
  destaque: boolean
  observacao: string | null
}

export type PlanoApi = {
  id: string
  nome: string
  descricao: string | null
  valor: number | string
  periodicidade: Periodicidade
  isFeatured?: boolean
  badgeLabel?: string | null
  ordem?: number
  beneficios: BeneficioApi[]
}

export type PlanoFormValues = {
  nome: string
  valor: string
  periodicidade: Periodicidade
  descricao: string
}

export type BeneficioFormValues = {
  slug: string
  titulo: string
  descricao: string
  icone: string
  ativo: boolean
  destaque: boolean
  observacao: string
}

export type PlanoFormMode = "create" | "edit"
export type BeneficioFormMode = "create" | "edit"
