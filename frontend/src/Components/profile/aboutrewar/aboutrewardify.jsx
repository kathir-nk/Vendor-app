import style from './index.module.css';
import icons from '../../../icons/icons';
import { useState } from 'react';

const ProfileAbout=()=>{
    const [showagree,setshowagree]=useState(false);
    return(
        <div className={style.aboutRewar}>
            <div className={style.aboutRewar_header}>
                <h4>About REWARDIFY</h4>
                <p>Here you can view our T&C, Privacy Policy etc.</p>
            </div>
            <div className={style.aboutRewar_Block}>
                <div>
                <h4>About US</h4>
                {showagree && <p>
                    Terms & Conditions
Welcome to Rewarify! By using our platform, you agree to:

Provide accurate account information.
Use the platform only for lawful purposes.
Respect intellectual property rights of Rewarify and third parties.
Understand that product prices and offers are subject to change without notice.
Comply with our return and refund policies for eligible products.
We reserve the right to suspend accounts for violations and modify these terms at any time.

Privacy Policy
At Rewarify, we prioritize your privacy:

We collect only necessary personal information for transactions and site performance.
Data is protected using secure protocols and is not shared with unauthorized third parties.
Cookies may be used to enhance user experience.
Users can access, update, or delete personal information by contacting our support team.
By using our services, you consent to the collection and use of your data as described. Updates to this policy will be communicated on the website.
                    </p>}
                </div>
              {showagree?<span onClick={()=>setshowagree(!showagree)}>{icons.deopuparrow}</span>:<span onClick={()=>setshowagree(!showagree)}>{icons.dropdownarrow}</span>}            
          </div>
            <div className={style.aboutRewar_Block}>
                <h4>Terms & Condition</h4>
                <span>{icons.dropdownarrow}</span>
            </div>
            <div className={style.aboutRewar_Block}>
                <h4>Privacy Policy</h4>
                <span>{icons.dropdownarrow}</span>
            </div>
        </div>
    )
}

export default ProfileAbout