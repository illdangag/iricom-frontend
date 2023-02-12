import Link from 'next/link'
import Layout from '../components/Layout'
import { Button, ButtonGroup } from '@chakra-ui/react'

const IndexPage = () => (
  <Layout title="Home | Next.js + TypeScript Example">
    <h1>Hello Next.js 👋</h1>
    <p>
      <Link href="/about">About</Link>
    </p>
    <ButtonGroup variant='outline' spacing='6'>
      <Button colorScheme='blue'>Save</Button>
      <Button>Cancel</Button>
    </ButtonGroup>
  </Layout>
)

export default IndexPage
