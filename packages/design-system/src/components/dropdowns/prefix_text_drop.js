import { useState } from 'react';
import styles from '../../styles/dropdowns.module.css';

export default function PrefixTextDrop(state){
    
    const [dropActive, setDropActive] = useState(false);
    const [mainText, setMainText] = useState("Popularity");
    const months = ['Recommended','What\'s new','Popularity','Price: High to Low','Price: Low to High','Customer Rating'];
    const listmonths = months.map((months) => <span key={months.id} className={styles.drop_pop_item} onClick={()=> {
        setMainText(months.toString());
        setDropActive(false);
    }}>{months}</span>);
    
    return(
        <div className={styles.text_default_input}>
            <div className={styles.text_input_container}>
                <div className={!state.disable ? styles.dropField : styles.dropField_disabled} onClick={!state.disable ? ()=> setDropActive(!dropActive): null}>
                    <span><span style={{color:"#9A9A9A"}}>Sort by : </span>{mainText}</span>
                    <span className={styles.material_icons}
                    style={{marginLeft:"-32px", color:"#3F3C3C", fontSize:"19px", cursor:"pointer"}}>expand_more</span>
                </div>
            </div>
            <div className={dropActive ? styles.drop_pop : styles.display_none} style={{top:"48px"}}>
                {listmonths}
            </div>
        </div>
    )
}
