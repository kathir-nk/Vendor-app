import { useState } from 'react';
import { LoginLogo } from '../../../img/images';
import styles from './index.module.css';
import { Formik, Form } from 'formik';
import FormikControl from '../../FormikComponent/formikControl';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/apiinstance';
import { GENERATE_OTP_LOGIN } from '../../../utils/api';

const LoginForm = () => {
  const navigate = useNavigate();

  const initialValues = {
    phnumber: '',
    email: '',
  };

  const validationSchema = Yup.object({
    phnumber: Yup.string()
      .required('Required!')
      .matches(/^[0-9]{10}$/, 'Enter valid 10 digit number'),
    email: Yup.string()
      .required('Required!')
      .email('Invalid email'),
  });

  const onSubmit = async (values, onSubmitProps) => {
    try {
      const payload = {
        mobileNumber: values.phnumber.trim(),
        email: values.email.trim()
      };

      console.log("📱 Sending OTP to:", payload);

      const response = await api.post(GENERATE_OTP_LOGIN, payload);

      console.log("✅ OTP SUCCESS:", response.data);

      navigate('/verify', {
        state: {
          mobileNumber: values.phnumber.trim(),
          email: values.email.trim(),
          sessionId: response.data.sessionId,
          otp: response.data.otp
        },
      });

    } catch (error) {
      console.error("❌ OTP FAILED:", error);
      alert(error.response?.data?.message || "Failed to send OTP");
    }

    onSubmitProps.setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formik) => (
        <Form className={styles.login_form}>
          <img src={LoginLogo} alt="logo" />
          <h6>Welcome Back 👋</h6>

<p>
  Enter your mobile number and email to receive
  a secure OTP.
</p>

          <FormikControl
            control="input"
            name="phnumber"
            className={styles.form_control}
            placeholder="Enter mobile number"
            type="tel"
            maxLength="10"
          />

          <FormikControl
            control="input"
            name="email"
            className={styles.form_control}
            placeholder="Enter email"
            type="email"
          />

          <div className={styles.login_submit_content}>
            <button type="submit" disabled={formik.isSubmitting || !formik.isValid}>
              {formik.isSubmitting ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;