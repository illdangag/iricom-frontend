// react
import './global.scss';
import { ChakraProvider, extendTheme, } from '@chakra-ui/react';
// store
import { RecoilRoot, } from 'recoil';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        bg: 'gray.100',
      },
    },
  },
  components: {
    Button: {
      variants: {
        solid: {
          backgroundColor: '#9775fa',
          color: '#f8f9fa',
          _hover: {
            background: '#845ef7',
            color: '#f8f9fa',
            _disabled: {
              background: '#b197fc',
              color: '#f8f9fa',
            },
          },
          _active: {
            background: '#7950f2',
            color: '#f8f9fa',
          },
          _disabled: {
            background: '#b197fc',
            color: '#f8f9fa',
          },
        },
        outline: {
          borderColor: '#b197fc',
          color: '#9775fa',
        },
      },
    },
  },
});

const App = ({ Component, pageProps, }) => {
  return (
    <ChakraProvider theme={theme}>
      <RecoilRoot>
        <Component {...pageProps}/>
      </RecoilRoot>
    </ChakraProvider>
  );
};

export default App;
