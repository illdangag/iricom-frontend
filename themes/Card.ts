import { createMultiStyleConfigHelpers, } from '@chakra-ui/react';
import { cardAnatomy, } from '@chakra-ui/anatomy';

const { definePartsStyle, defineMultiStyleConfig, } = createMultiStyleConfigHelpers(cardAnatomy.keys);

const baseStyle = definePartsStyle({
  container: {
    shadow: {
      // base: 'none',
      // md: 'sm',
    },
    borderRadius: {
      // base: '0',
      // md: '0.5rem',
    },
  },
  header: {},
  body: {},
  footer: {},
});

const sizes = {
  md: definePartsStyle({
  }),
};

export default defineMultiStyleConfig({ baseStyle, sizes, });
