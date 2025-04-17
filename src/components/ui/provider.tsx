// src/components/ui/provider.tsx
"use client"

import { ChakraProvider, extendTheme, CSSReset, ThemeConfig } from "@chakra-ui/react"
import { ColorModeProvider } from "@chakra-ui/react"
import { theme as defaultTheme } from "@chakra-ui/react"

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,
})

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeProvider options={{ initialColorMode: "light", useSystemColorMode: false }}>
        {children}
      </ColorModeProvider>
    </ChakraProvider>
  )
}
