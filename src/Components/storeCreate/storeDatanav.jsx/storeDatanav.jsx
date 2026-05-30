import { useLocation, useNavigate } from 'react-router-dom';
import styles from './index.module.css';
const StoreDataNav=()=>{
    const navigate=useNavigate();
    const location=useLocation();
    const storeinfocircle=location.pathname === '/storeCreation' ? styles.circle_green:styles.circle;
    const storedoccircle=location.pathname === '/storeCreation/storedocs'? styles.circle_green:styles.circle;
    const storeagreecircle=location.pathname === '/storeCreation/storeAgeement'? styles.circle_green:styles.circle;

    return(
        <div className={styles.store_create_form_navigator}>
            <div >
                    <div className={storeinfocircle}/>
                    <hr className={styles.dotted_line}/>
            </div>
            <div onClick={(e)=>navigate('/storeCreation')}>
                    <h6>Step 1</h6>
                    <h4>Store Information</h4>
                    <p>Owner name , Store location, Store address</p>
                    <hr className={styles.solid_line} />
            </div>
            <div>
                    <div className={storedoccircle}/>
                    <hr className={styles.dotted_line}/>
            </div>
            <div onClick={(e)=>navigate('/storeCreation/storedocs')}>
                    <h6>Step 2</h6>
                    <h4>Store Document</h4>
                    <p>GSTIN Number , PAN Number, Bank details</p>
                    <hr className={styles.solid_line} />
            </div> 
            <div>
                    <div className={storeagreecircle}/>
                    <hr className={styles.dotted_line}/>
            </div>
            <div onClick={(e)=>navigate('/storeCreation/storeAgeement')}>
                    <h6>Step 3</h6>
                    <h4>Agreement</h4>
                    <p>REWARDIFY partner Agreement</p>
                    <hr className={styles.solid_line}/>
            </div>  
        </div>
    )
}
export default StoreDataNav;

// import { useLocation, useNavigate } from 'react-router-dom';
// import styles from './index.module.css';

// const StoreDataNav = () => {
//     const navigate = useNavigate();
//     const location = useLocation();

//     // Define the path for each step
//     const steps = [
//         { path: '/storeCreation', label: 'Store Information', description: 'Owner name, Store location, Store address' },
//         { path: '/storeCreation/storedocs', label: 'Store Document', description: 'GSTIN Number, PAN Number, Bank details' },
//         { path: '/storeCreation/storeAgeement', label: 'Agreement', description: 'REWARDIFY partner Agreement' },
//     ];

//     // Determine the current step index
//     const currentIndex = steps.findIndex(step => step.path === location.pathname);

//     return (
//         <div className={styles.store_create_form_navigator}>
//             {steps.map((step, index) => {
//                 const isCurrentOrPast = index <= currentIndex; // Check if the step is current or past
//                 const circleClass = isCurrentOrPast ? styles.circle_green : styles.circle; // Set circle color based on current/past step

//                 return (
//                     <div key={step.path}>
//                         <div className={circleClass} />
//                         {index < steps.length - 1 && <hr className={styles.dotted_line} />} {/* Only show dotted line between steps */}
//                         <div onClick={() => navigate(step.path)}>
//                             <h6>Step {index + 1}</h6>
//                             <h4>{step.label}</h4>
//                             <p>{step.description}</p>
//                             <hr className={styles.solid_line} />
//                         </div>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// };

// export default StoreDataNav;








