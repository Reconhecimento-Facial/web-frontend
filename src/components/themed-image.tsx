'use client'
import { useTheme } from 'next-themes'
import type { ImageProps } from 'next/image'
import Image from 'next/image'
import { useEffect, useState } from 'react'

type Props = Omit<ImageProps, 'src' | 'priority' | 'loading'> & {
  srcLight: string
  srcDark: string
}

export const ThemedImage = (props: Props) => {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { srcLight, srcDark, ...rest } = props

  let srcImage

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  switch (resolvedTheme) {
    case 'light':
      srcImage = srcLight
      break
    case 'dark':
      srcImage = srcDark
      break
    default:
      srcImage = srcLight
      break
  }

  return <Image src={srcImage} {...rest} />
}
