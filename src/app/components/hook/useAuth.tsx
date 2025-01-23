import { useSelector } from 'react-redux';

const useAuth = () => {
    const {status, userData, isLoading} = useSelector((state: any) => state.auth)
   

  return {
    status,
    userData,
    isLoading,
  };
};

export default useAuth;
