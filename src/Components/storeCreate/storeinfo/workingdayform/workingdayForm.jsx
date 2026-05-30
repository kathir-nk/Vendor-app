// import { Form,Formik } from "formik"
// import { storeCreateValues,storeCreatevalidationSchema } from "../../../../utils/formcons"
// import styles from './index.module.css';
// import FormikControl from "../../../FormikComponent/formikControl";
// import { useSelector } from "react-redux";
// import { useEffect } from "react";
// import { useLocation } from "react-router-dom";

// const WorkdayForm=()=>{
    
//     const days=useSelector((state)=>state?.user?.user);
//     const location=useLocation();
//     useEffect(()=>{
//         if(location.pathname==='/home/profile/shopdetail' && days)
//             {
//          storeCreateValues.workingdays=days?.store?.schedule;
//         }
//     },
//     [days,location.pathname])

//      const WorkdaysCheckOption=[
//         {key:'Monday',value:1},
//         {key:'Tuesday',value:2},
//         {key:'Wednesday',value:3},
//         {key:'Thursday',value:4},
//         {key:'Friday',value:5},
//         {key:'Saturday',value:6},
//         {key:'Sunday',value:7}
//     ]

//     return(
//         <Formik initialValues={storeCreateValues} validationSchema={storeCreatevalidationSchema} >
//         {(formik)=>{
//           return(
//             <Form className={styles.workingdaysinfo_Form} >
//                 <div className={styles.workingdays_header} >
//                 <h3 className={styles.docinfocard_header} >Working Days</h3>
//                 <h4>Select All</h4>
//                 </div>
//                 <FormikControl className={styles.checkbox_control} optiondivname={styles.checkbox_option} control='checkbox' options={WorkdaysCheckOption} name='workingdays'/>
//             </Form> )
//         }}
//         </Formik>
//     )
// }

// export default WorkdayForm


// import { Form, Formik } from "formik";
// import { storeCreateValues, storeCreatevalidationSchema } from "../../../../utils/formcons";
// import styles from './index.module.css';
// import { useSelector } from "react-redux";
// import { useEffect } from "react";
// import { useLocation } from "react-router-dom";

// const WorkdayForm = () => {
//     const days = useSelector((state) => state?.user?.user);
//     const location = useLocation();

//     useEffect(() => {
//         if (location.pathname === '/home/profile/shopdetail' && days) {
//             storeCreateValues.workingdays = days?.store?.schedule || [];
//         }
//     }, [days, location.pathname]);

//     const WorkdaysCheckOption = [
//         { key: 'Monday', value: 1 },
//         { key: 'Tuesday', value: 2 },
//         { key: 'Wednesday', value: 3 },
//         { key: 'Thursday', value: 4 },
//         { key: 'Friday', value: 5 },
//         { key: 'Saturday', value: 6 },
//         { key: 'Sunday', value: 7 }
//     ];

//     // Checkbox component
//     const Checkbox = ({ name, options }) => (
//         <div>
//             {options.map((option) => (
//                 <label key={option.value}>
//                     <input
//                         type="checkbox"
//                         name={name}
//                         value={String(option.value)}
//                     />
//                     {option.key}
//                 </label>
//             ))}
//         </div>
//     );

//     return (
//         <Formik
//             initialValues={storeCreateValues}
//             validationSchema={storeCreatevalidationSchema}
//         >
//             {(formik) => {
//                 return (
//                     <Form className={styles.workingdaysinfo_Form}>
//                         <div className={styles.workingdays_header}>
//                             <h3 className={styles.docinfocard_header}>Working Days</h3>
//                             <h4
//                                 onClick={() =>
//                                     formik.setFieldValue(
//                                         'workingdays',
//                                         WorkdaysCheckOption.map((opt) => String(opt.value))
//                                     )
//                                 }
//                             >
//                                 Select All
//                             </h4>
//                         </div>
//                         <Checkbox
//                             className={styles.checkbox_control}
//                             options={WorkdaysCheckOption}
//                             name='workingdays'
//                         />
//                     </Form>
//                 );
//             }}
//         </Formik>
//     );
// }

// export default WorkdayForm;


import { Form, Formik } from "formik";
import { storeCreateValues, storeCreatevalidationSchema } from "../../../../utils/formcons";
import styles from './index.module.css';
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const WorkdayForm = () => {
    const days = useSelector((state) => state?.user?.user);
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/home/profile/shopdetail' && days) {
            storeCreateValues.workingdays = days?.store?.schedule || [];
        }
    }, [days, location.pathname]);

    const WorkdaysCheckOption = [
        { key: 'Monday', value: 1 },
        { key: 'Tuesday', value: 2 },
        { key: 'Wednesday', value: 3 },
        { key: 'Thursday', value: 4 },
        { key: 'Friday', value: 5 },
        { key: 'Saturday', value: 6 },
        { key: 'Sunday', value: 7 }
    ];

    return (
        <Formik
            initialValues={storeCreateValues}
            validationSchema={storeCreatevalidationSchema}
            enableReinitialize // Allow reinitialization when storeCreateValues changes
        >
            {(formik) => {
                const { setFieldValue, values } = formik;

                // Handler to toggle select all checkboxes
                const toggleSelectAll = () => {
                    const allSelected = WorkdaysCheckOption.every(option =>
                        values.workingdays.includes(String(option.value))
                    );

                    const newWorkingDays = allSelected
                        ? [] // If all are selected, uncheck all
                        : WorkdaysCheckOption.map(option => String(option.value)); // If not all, check all

                    setFieldValue('workingdays', newWorkingDays);
                };

                return (
                    <Form className={styles.workingdaysinfo_Form}>
                        <div className={styles.workingdays_header}>
                            <h3 className={styles.docinfocard_header}>Working Days</h3>
                            <h4 onClick={toggleSelectAll}>
                                {WorkdaysCheckOption.every(option => 
                                    values.workingdays.includes(String(option.value))
                                ) ? "Deselect All" : "Select All"}
                            </h4>
                        </div>
                        <div className={styles.checkbox_control}>
                            {WorkdaysCheckOption.map(option => (
                                <label key={option.value}>
                                    <input
                                        type="checkbox"
                                        name='workingdays'
                                        value={String(option.value)}
                                        checked={values.workingdays.includes(String(option.value))}
                                        onChange={() => {
                                            const isChecked = values.workingdays.includes(String(option.value));
                                            const newWorkingDays = isChecked
                                                ? values.workingdays.filter(day => day !== String(option.value))
                                                : [...values.workingdays, String(option.value)];
                                            
                                            setFieldValue('workingdays', newWorkingDays);
                                        }}
                                    />
                                           {' '} {option.key}
                                </label>
                            ))}
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );
}

export default WorkdayForm;




