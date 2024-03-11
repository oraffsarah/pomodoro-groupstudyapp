import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, we couldn't find the page you were looking for.</p>
      <p>
        <Link to="/">Go Home</Link>
      </p>
    </div>
  );
};

export default NotFoundPage;
