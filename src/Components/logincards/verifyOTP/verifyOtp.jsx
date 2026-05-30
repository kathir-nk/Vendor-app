import React, { useState, useEffect } from 'react';
import styles from './index.module.css';
import { LoginLogo } from '../../../img/images';
import { useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form } from 'formik';
import FormikControl from '../../FormikComponent/formikControl';
import * as Yup from 'yup';
import api from '../../../utils/apiinstance';

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get mobile number from login page
  const mobileNumber = location.state?.mobileNumber;

  const initialValues = {
    otp1: '',
    otp2: '',
    otp3: '',
    otp4: '',
  };

  const validationSchema = Yup.object({
    otp1: Yup.string().required().matches(/^\d$/),
    otp2: Yup.string().required().matches(/^\d$/),
    otp3: Yup.string().required().matches(/^\d$/),
    otp4: Yup.string().required().matches(/^\d$/),
  });

  const [timeLeft, setTimeLeft] = useState(59);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const handleVerifyOtp = async (enteredOtp) => {
    try {
      console.log("🔐 Verifying OTP:", enteredOtp, "for", mobileNumber);

      const response = await api.post('/verify-otp', {
        mobileNumber: mobileNumber,
        otp: enteredOtp,
      });

      console.log("✅ VERIFY SUCCESS:", response.data);

      localStorage.setItem('authToken', response.data.token);
      navigate('/home');

    } catch (error) {
      console.error('❌ VERIFY FAILED:', error.message);
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      alert(error.response?.data?.message || 'Invalid OTP. Please try again.');
    }
  };

  const onSubmit = (values, onSubmitProps) => {
    const enteredOtp = `${values.otp1}${values.otp2}${values.otp3}${values.otp4}`;
    handleVerifyOtp(enteredOtp);
    onSubmitProps.setSubmitting(false);
  };

  return (
    <div className={styles.login_verify}>
      <img src={LoginLogo} alt="icon" />
      <h6>Verify your details</h6>
      <p>Enter OTP number below</p>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(formik) => (
          <Form className={styles.login_verify_content}>
            <div className={styles.login_verify_content_input}>
              <FormikControl className={styles.form_control} control="input" name="otp1" maxLength="1" type="text" />
              <FormikControl className={styles.form_control} control="input" name="otp2" maxLength="1" type="text" />
              <FormikControl className={styles.form_control} control="input" name="otp3" maxLength="1" type="text" />
              <FormikControl className={styles.form_control} control="input" name="otp4" maxLength="1" type="text" />
            </div>

            <div className={styles.login_verify_content_button}>
              <button type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? 'Verifying...' : 'Verify and Continue'}
              </button>

              <div className={styles.login_verify_resend}>
                {timeLeft > 0 ? (
                  `Didn't receive OTP? Resend in 0:${timeLeft < 10 ? `0${timeLeft}` : timeLeft}`
                ) : (
                  <button type="button" onClick={() => setTimeLeft(59)}>Resend OTP</button>
                )}
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default VerifyOtp;