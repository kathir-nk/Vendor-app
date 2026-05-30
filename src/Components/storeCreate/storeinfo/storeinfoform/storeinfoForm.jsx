// import { Form,Formik } from "formik";
// import styles from './index.module.css';
// import { storeCreateValues,storeCreatevalidationSchema } from "../../../../utils/formcons";
// import FormikControl from "../../../FormikComponent/formikControl";
// import { useState } from "react";
// const StoreInfoForm=()=>{
//   const [verifystorenum,setStorenum]=useState(false);
//     return(
//         <Formik initialValues={storeCreateValues} validationSchema={storeCreatevalidationSchema} >
//         {(formik)=>{
//           return(
//         <Form className={styles.storeinfo_Form} >
//         <h3 className={styles.docinfocard_header} >Store Information</h3>
//         <FormikControl className={styles.form_control} control='input' placeholder='Store Name' name='storename'/>
//         <FormikControl className={styles.form_control} control='input' placeholder='Store Full Address' name='storeaddress'/>
//         <div className={styles.store_num}><input type='checkbox' name='checkbox'/><label htmlFor='checkbox'>Same as my contact number</label></div>
//         <div className={styles.input_with_button}>
//         <FormikControl className={styles.phonenu_control} control='input' placeholder='Store Contact Number' name='storenum'/>
//         <span className={styles.phone_verify_button} onClick={()=>setStorenum(!verifystorenum)}>Verify</span>
//         {verifystorenum &&  
//                     <> 
//                           <p>Verification code has send to your mobile number</p>      
//                           <div className={styles.phone_verify_content_input}>
//                             <FormikControl className={styles.otp_control} control='input' name='otp1' maxLength='1'type="text"/>
//                             <FormikControl className={styles.otp_control} control='input' name='otp2' maxLength='1'type="text"/>
//                             <FormikControl className={styles.otp_control} control='input' name='otp3' maxLength='1'type="text"/>
//                             <FormikControl className={styles.otp_control} control='input' name='otp4' maxLength='1'type="text"/>
//                           </div>
//                           <h6>Didn’t receive OTP?  Resend in 0:59</h6>
//                     </>
//           }
//         </div>
//         <h3>Add Store Location </h3>
//          </Form>                
//          )}}
//             </Formik>
//     )
// }
// export default StoreInfoForm

import { Form, Formik } from "formik";
import { useState, useEffect, useRef } from "react";
import styles from './index.module.css';
import { storeCreateValues, storeCreatevalidationSchema } from "../../../../utils/formcons";
import FormikControl from "../../../FormikComponent/formikControl";

const StoreInfoForm = () => {
  const [verifystorenum, setStorenum] = useState(false);
  const [resendTimer, setResendTimer] = useState(59);
  const otpRef = useRef([]); // Use ref for smooth OTP focus management

  // Countdown timer logic
  useEffect(() => {
    let timer;
    if (verifystorenum && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer); // Clean up interval on unmount
  }, [verifystorenum, resendTimer]);

  // Handle OTP input focusing
  const handleOTPInput = (e, index) => {
    const { value } = e.target;
    if (value.length === 1 && index < otpRef.current.length - 1) {
      otpRef.current[index + 1].focus();
    } else if (value.length === 0 && index > 0) {
      otpRef.current[index - 1].focus();
    }
  };

  return (
    <Formik
      initialValues={storeCreateValues}
      validationSchema={storeCreatevalidationSchema}
    >
      {(formik) => (
        <Form className={styles.storeinfo_Form}>
          <h3 className={styles.docinfocard_header}>Store Information</h3>
          <FormikControl
            className={styles.form_control}
            control="input"
            placeholder="Store Name"
            name="storename"
          />
          <FormikControl
            className={styles.form_control}
            control="input"
            placeholder="Store Full Address"
            name="storeaddress"
          />
          <div className={styles.store_num}>
            <input type="checkbox" name="checkbox" id="checkbox" />
            <label htmlFor="checkbox">Same as my contact number</label>
          </div>
          <div className={styles.input_with_button}>
            <FormikControl
              className={styles.phonenu_control}
              control="input"
              placeholder="Store Contact Number"
              name="storenum"
            />
            <span
              className={styles.phone_verify_button}
              onClick={() => {
                setStorenum(true);
                setResendTimer(59); // Reset timer on click
              }}
            >
              Verify
            </span>
            {verifystorenum && (
              <>
                <p>Verification code has been sent to your mobile number</p>
                <div className={styles.phone_verify_content_input}>
                  {[0, 1, 2, 3].map((index) => (
                    <FormikControl
                      key={index}
                      className={styles.otp_control}
                      control="input"
                      name={`otp${index + 1}`}
                      maxLength="1"
                      type="text"
                      innerRef={(el) => (otpRef.current[index] = el)} // Store ref
                      onChange={(e) => handleOTPInput(e, index)}
                    />
                  ))}
                </div>
                <h6>
                  Didn’t receive OTP? Resend in {resendTimer}s
                </h6>
              </>
            )}
          </div>
          <h3>Add Store Location</h3>
        </Form>
      )}
    </Formik>
  );
};

export default StoreInfoForm;
