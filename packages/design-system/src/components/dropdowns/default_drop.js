import { useState } from 'react';
import styles from '../../styles/dropdowns.module.css';

export default function DefaultDrop(state){
    
    const [dropActive, setDropActive] = useState(false);
    const [mainText, setMainText] = useState("Select");
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const listmonths = months.map((months) => <span key={months.id} className={styles.drop_pop_item} onClick={()=> {
        setMainText(months.toString());
        setDropActive(false);
    }}>{months}</span>);
    
    return(
        <div className={styles.text_default_input}>
            <p style={{marginBottom:"2px"}}>Select Month</p>
            <div className={styles.text_input_container} onClick={!state.disable ? ()=> setDropActive(!dropActive): null}>
                <div className={!state.disable ? styles.dropField : styles.dropField_disabled}>{mainText}
                <span className={styles.material_icons}
                style={{marginLeft:"-32px", color:"#3F3C3C", fontSize:"19px", cursor:"pointer"}}>expand_more</span>
                </div>
            </div>
            <span className={styles.helper_text}>Helper Text</span>
            <div className={dropActive ? styles.drop_pop : styles.display_none}>
                {listmonths}
            </div>
        </div>
    )
}
