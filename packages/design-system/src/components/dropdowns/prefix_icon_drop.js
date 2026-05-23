import { useState } from 'react';
import styles from '../../styles/dropdowns.module.css';

export default function PrefixIconDrop(state){
    
    const [dropActive, setDropActive] = useState(false);
    const months = [
        {icon: <span className={styles.material_icons}>account_circle</span>, label: `Profile`},
        {icon: <span className={styles.material_icons}>settings</span>, label: `Settings`},
        {icon: <span className={styles.material_icons}>help_center</span>, label: `Help`},
        {icon: <span className={styles.material_icons}>logout</span>, label: `Logout`},
    ];
    const listmonths = months.map((months) => <span key={months.id} className={styles.drop_pop_item} style={{display:"flex", alignItems:"center", gap:"8px"}} onClick={()=> {
        setMainText(()=>{
            return{
                icon: months.icon,
                label: months.label,
            }
        });
        setDropActive(false);
    }}>{months.icon}{months.label}</span>);
    const [mainText, setMainText] = useState({
            icon: <span className={styles.material_icons}>account_circle</span>,
            label: "Profile",
    });
    
    return(
        <div className={styles.text_default_input}>
            <div className={styles.text_input_container}>
                <div className={!state.disable ? styles.dropField : styles.dropField_disabled} onClick={!state.disable ? ()=> setDropActive(!dropActive): null}>
                    <span style={{display:"flex", alignItems:"center", gap:"8px"}}>{mainText.icon}{mainText.label}</span>
                    <span className={styles.material_icons}
                    style={{marginLeft:"-32px", color:"#3F3C3C", fontSize:"19px", cursor:"pointer"}}>expand_more</span>
                </div>
            </div>
            <div className={dropActive ? styles.drop_pop : styles.display_none} style={{top:"48px", height:"auto"}}>
                {listmonths}
            </div>
        </div>
    )
}
