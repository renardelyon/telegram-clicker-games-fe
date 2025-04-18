import useSwapMobile from '@/hooks/useSwapMobile';
import SwapPage from './SwapPage';

const SwapPageMobile = () => {
  const swapFunc = useSwapMobile();
  return <SwapPage swapFunc={swapFunc} />;
};

export default SwapPageMobile;
