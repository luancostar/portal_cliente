// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const navigate = useNavigate();

    useEffect(() => {
      const idCliente = localStorage.getItem('idCliente');

      if (!idCliente) {
        navigate('/'); // Redireciona para a página de login
      }
    }, [navigate]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;