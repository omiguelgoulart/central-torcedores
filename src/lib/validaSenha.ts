export function validaSenha(senha: string): string[] {
  const mensagem: string[] = []
  if (senha.length < 8) {
    mensagem.push("Erro... senha deve possuir, no mínimo, 8 caracteres")
  }

  let pequenas = 0
  let grandes = 0
  let numeros = 0
  let simbolos = 0

  for (const letra of senha) {
    if (/[a-z]/.test(letra)) pequenas++
    else if (/[A-Z]/.test(letra)) grandes++
    else if (/[0-9]/.test(letra)) numeros++
    else simbolos++
  }

  if (pequenas === 0) mensagem.push("Erro... senha deve possuir, no mínimo, uma letra minúscula")
  if (grandes === 0) mensagem.push("Erro... senha deve possuir, no mínimo, uma letra maiúscula")
  if (numeros === 0) mensagem.push("Erro... senha deve possuir, no mínimo, um número")
  if (simbolos === 0) mensagem.push("Erro... senha deve possuir, no mínimo, um símbolo")
  return mensagem
}

export function regrasSenhaStatus(senha: string) {
  const temMin = senha.length >= 8
  const temMinusc = /[a-z]/.test(senha)
  const temMaiusc = /[A-Z]/.test(senha)
  const temNumero = /[0-9]/.test(senha)
  const temSimbolo = /[^A-Za-z0-9]/.test(senha)
  return { temMin, temMinusc, temMaiusc, temNumero, temSimbolo }
}
