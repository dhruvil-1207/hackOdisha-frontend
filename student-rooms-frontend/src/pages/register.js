import React from 'react';
import AuthLayout from '../components/Auth/AuthLayout';
import RegisterForm from '../components/Auth/RegisterForm';

const Register = () => {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join thousands of students learning together"
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default Register;
