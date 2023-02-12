import Link from 'next/link'
import Layout from '../components/Layout'
import { Button, ButtonGroup } from '@chakra-ui/react'
import { useRecoilValue, useSetRecoilState, } from 'recoil';
import testCountAtom, { increaseTestCount, } from '../recoil/testCount';

const IndexPage = () => {
  const testCount = useRecoilValue(testCountAtom);
  const setIncreaseTestCount = useSetRecoilState(increaseTestCount);

  const onClickIncreaseButton = () => {
    setIncreaseTestCount(100);
  };

  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <h1>Hello Next.js 👋</h1>
      <p>
        <Link href="/about">About</Link>
      </p>
      <p>
        {testCount?.count}
      </p>
      <ButtonGroup variant='outline' spacing='6'>
        <Button colorScheme='blue' onClick={onClickIncreaseButton}>increase</Button>
      </ButtonGroup>
    </Layout>
  )
}

export default IndexPage
