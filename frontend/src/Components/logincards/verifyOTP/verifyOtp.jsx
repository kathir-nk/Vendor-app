import React, { useState, useEffect, useRef } from 'react';
import styles from './index.module.css';
import { LoginLogo } from '../../../img/images';
import { useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form } from 'formik';
import FormikControl from '../../FormikComponent/formikControl';
import * as Yup from 'yup';
import api from '../../../utils/apiinstance';
import { VERIFY_OTP_LOGIN, GENERATE_OTP_LOGIN } from '../../../utils/api';

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { mobileNumber, email, sessionId, otp: serverOtp } = location.state || {};

  useEffect(() => {
    if (!mobileNumber) {
      alert('Please enter mobile number first');
      navigate('/login');
    }
  }, [mobileNumber, navigate]);

  const initialValues = {
    otp1: '',
    otp2: '',
    otp3: '',
    otp4: '',
  };

  const validationSchema = Yup.object({
    otp1: Yup.string().required().matches(/^\d$/, 'Must be a digit'),
    otp2: Yup.string().required().matches(/^\d$/, 'Must be a digit'),
    otp3: Yup.string().required().matches(/^\d$/, 'Must be a digit'),
    otp4: Yup.string().required().matches(/^\d$/, 'Must be a digit'),
  });

  const [timeLeft, setTimeLeft] = useState(59);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (enteredOtp) => {
    try {
      console.log("🔐 Verifying OTP:", enteredOtp, "for", mobileNumber);

      const response = await api.post(VERIFY_OTP_LOGIN, {
        mobileNumber: mobileNumber,
        otp: enteredOtp,
        sessionId: sessionId,
      });

      console.log("✅ VERIFY SUCCESS:", response.data);

      if (response.data?.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      if (response.data?.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }

      navigate('/home');

    } catch (error) {
      console.error('❌ VERIFY FAILED:', error.message);
      console.error('Status:', error.response?.status);
      console.error('Data:', error.response?.data);
      alert(error.response?.data?.message || 'Invalid OTP. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    if (resending) return;
    
    setResending(true);
    try {
      console.log("📱 Resending OTP to:", mobileNumber);
      
      const response = await api.post(GENERATE_OTP_LOGIN, {
        mobileNumber: mobileNumber,
        email: email,
      });

      console.log("✅ RESEND SUCCESS:", response.data);
      setTimeLeft(59);
      
      if (response.data?.sessionId) {
        navigate('/verify', {
          state: {
            mobileNumber,
            email,
            sessionId: response.data.sessionId,
            otp: response.data.otp
          },
          replace: true
        });
      }

    } catch (error) {
      console.error('❌ RESEND FAILED:', error);
      alert(error.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  const onSubmit = (values, onSubmitProps) => {
    const enteredOtp = `${values.otp1}${values.otp2}${values.otp3}${values.otp4}`;
    handleVerifyOtp(enteredOtp);
    onSubmitProps.setSubmitting(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? `0${secs}` : secs}`;
  };

  return (
    <div className={styles.login_verify}>
      <img src={LoginLogo} alt="icon" />
      <h6>Verify your details</h6>
      <p>Enter OTP sent to <strong>{email}</strong></p>
      
      {serverOtp && (
        <p style={{ color: '#00d4ff', fontSize: '12px', marginBottom: '10px' }}>
          Hint: Your OTP is {serverOtp}
        </p>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(formik) => (
          <Form className={styles.login_verify_content}>
            <div className={styles.login_verify_content_input}>
              {['otp1', 'otp2', 'otp3', 'otp4'].map((name, index) => (
                <FormikControl
                  key={name}
                  className={styles.form_control}
                  control="input"
                  name={name}
                  maxLength="1"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  innerRef={(el) => (inputRefs.current[index] = el)}
                  onChange={(e) => {
                    formik.handleChange(e);
                    handleInputChange(e, index);
                  }}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>

            <div className={styles.login_verify_content_button}>
              <button 
                type="submit" 
                disabled={formik.isSubmitting || !formik.isValid}
              >
                {formik.isSubmitting ? 'Verifying...' : 'Verify and Continue'}
              </button>

              <div className={styles.login_verify_resend}>
                {timeLeft > 0 ? (
                  <span className={styles.timer_text}>
                    Didn't receive OTP? Resend in {formatTime(timeLeft)}
                  </span>
                ) : (
                  <button 
                    type="button" 
                    onClick={handleResendOtp}
                    disabled={resending}
                    className={styles.resend_button}
                  >
                    {resending ? 'Sending...' : 'Resend OTP'}
                  </button>
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