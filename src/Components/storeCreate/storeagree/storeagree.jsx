import styles from './index.module.css';
import { useState} from 'react';
import { useNavigate } from 'react-router-dom';
const StoreAgree=()=>{
    const [isChecked, setIsChecked] = useState(false);
    const navigate=useNavigate();
    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
      };
    
    return(
        <>
           <div className={styles.docinfoform_header} >Partner Agreement</div>
           <h6>Read the document below and agree to the terms to proceed.</h6>
            <div className={styles.docinfoform_Container}>
                <div className={styles.agreement_content}>
                    <p>
                    This Store Agreement  is made and entered into by and between DMART, a company organized and existing under the laws of India, with its principal office located in Chennai, now referred to as "Store." Amazon, an individual or entity organized and existing under the laws of India, with a principal office located at Trichy, is now referred to as "Vendor."

Purpose: This Agreement aims to set forth the terms and conditions under which the Vendor agrees to supply goods, products, or services to the Store for retail or wholesale purposes.

Scope of Agreement: The Vendor agrees to provide the products specified in Exhibit A, attached hereto, in compliance with Store’s quality standards and guidelines. The Vendor is responsible for ensuring that all products meet the legal and regulatory requirements for sale in the designated market.

Term and Termination: This Agreement shall commence on the effective date and remain in effect until terminated by either party with thirty (30) days' written notice. Termination shall not relieve either party of any obligations or liabilities accrued prior to the termination date.

Payment Terms: Store agrees to pay the Vendor according to the pricing schedule set forth in Exhibit B. Payment shall be made within [30/60] days of invoice receipt, subject to deductions for returns or discrepancies.

Product Returns: The Store reserves the right to return any unsold or defective items to the Vendor within [specified timeframe] at no additional cost to Store.

Confidentiality: Both parties agree to maintain confidentiality regarding trade secrets and sensitive business information disclosed in this Agreement.
                    </p>
                </div>
                <div className={styles.store_num}><input type='checkbox' name='checkbox' onClick={handleCheckboxChange} /><label htmlFor='checkbox'>I have read all the terms & conditions and agree to them.</label></div>
                <button className={styles.continue_button} onClick={()=>navigate('/login')}>Continue</button>

            </div>
        </>
    )
}

export default StoreAgree