import { defineStyleConfig } from '@chakra-ui/react'

export const Switch = defineStyleConfig({
  baseStyle: {
    track: {
      background: 'brand.gray_20',
      _checked: {
        background: 'brand.primary'
      }
    }
  }
})
