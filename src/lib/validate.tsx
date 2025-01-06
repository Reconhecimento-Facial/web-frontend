const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const ALLOWED_MIME_TYPES = [
  {
    type: 'image/webp',
    extension: ['.webp'],
  },
  {
    type: 'image/jpeg',
    extension: ['.jpeg', '.jpg'],
  },
  {
    type: 'image/png',
    extension: ['.png'],
  },
]

export function validatePhoto(f: unknown): string | true {
  console.log('photo', f)
  if (!(f instanceof FileList)) return 'Insira um arquivo válido'

  console.log('teste')
  if (!f.length) return 'Campo obrigatório'
  console.log('teste222')
  if (f[0] && f[0].size >= MAX_FILE_SIZE)
    return 'O tamanho máximo do arquivo deve ser de 5MB'
  console.log('teste333332')
  if (!ALLOWED_MIME_TYPES.map((m) => m.type).includes(f[0].type))
    return `Tipo de arquivo inválido. Arquivos suportados: ${ALLOWED_MIME_TYPES.map((m) => m.extension).join(', ')}`

  return true
}

export function validateCPF(value: string) {
  const cpfAllNumbers = value.replaceAll(/[^\d]/g, '').split('').map(Number)

  if (cpfAllNumbers.length !== 11) return false

  const checkers = cpfAllNumbers.slice(-2)
  const numbers = cpfAllNumbers.slice(0, -2)

  const firstSum = numbers.reduce(
    (acc, curr, index) => acc + curr * (10 - index),
    0,
  )

  const firstChecker = firstSum % 11 < 2 ? 0 : 11 - (firstSum % 11)

  if (firstChecker !== checkers[0]) return false

  numbers.push(firstChecker)

  const secondSum = numbers.reduce(
    (acc, curr, index) => acc + curr * (11 - index),
    0,
  )

  const secondChecker = secondSum % 11 < 2 ? 0 : 11 - (secondSum % 11)

  return secondChecker === checkers[1]
}
