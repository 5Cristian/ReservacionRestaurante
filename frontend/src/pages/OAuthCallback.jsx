import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function OAuthCallback() {
  const [qp] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = qp.get('token');
    if (token) {
      localStorage.setItem('token', token);
      // opcional: pedir /auth/me para guardar el user
      navigate('/');
    } else {
      navigate('/login');
    }
  }, []);
  return <div style={{ padding: 24 }}>Procesando inicio de sesión…</div>;
}
