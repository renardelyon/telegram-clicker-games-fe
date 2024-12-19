import useBoundStore from '@/store/store';

const WithInitData = <T extends object>(Component: React.ComponentType<T>) => {
  return (props: T) => {
    const initData = useBoundStore.use.initdata();

    return <>{!!initData && <Component {...props}></Component>}</>;
  };
};

export default WithInitData;
