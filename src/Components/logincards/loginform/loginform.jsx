import { LoginLogo } from '../../../img/images';
import styles from './index.module.css';
import { Formik, Form } from 'formik';
import FormikControl from '../../FormikComponent/formikControl';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import api from '../../../utils/apiinstance';

const LoginForm = () => {
  const navigate = useNavigate();

  const initialValues = {
    phnumber: '',
  };

  const validationSchema = Yup.object({
    phnumber: Yup.string()
      .required('Required!')
      .matches(/^[0-9]{10}$/, 'Enter valid 10 digit number'),
  });

  const onSubmit = async (values, onSubmitProps) => {
    try {
      const payload = {
        mobileNumber: values.phnumber
      };

      console.log("📱 Sending OTP to:", payload.mobileNumber);

      const response = await api.post('/generate-otp', payload);

      console.log("✅ OTP SUCCESS:", response.data);

      navigate('/verify', {
        state: {
          mobileNumber: values.phnumber.trim(),
        },
      });

    } catch (error) {
      console.error("❌ OTP FAILED:", error.message);
      console.error("Status:", error.response?.status);
      console.error("Data:", error.response?.data);
      alert(error.response?.data?.message || "Failed to send OTP. Please try again.");
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
          <h6>Get started with REWARDIFY</h6>
          <p>Enter your mobile number</p>

          <FormikControl
            control="input"
            name="phnumber"
            className={styles.form_control}
            placeholder="Enter mobile number"
          />

          <div className={styles.login_submit_content}>
            <button type="submit" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;