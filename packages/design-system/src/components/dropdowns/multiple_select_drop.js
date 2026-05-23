import { useState } from 'react';
import styles from '../../styles/dropdowns.module.css';
import layoutStyles from '../../styles/layout.module.css';

export default function MultipleSelectDrop(state){
    
    const [dropActive, setDropActive] = useState(false);
    const [isHindiChecked, setisHindiChecked] = useState(false);
    const [isEngChecked, setisEngChecked] = useState(false);
    const [isMathChecked, setisMathChecked] = useState(false);
    const [isSciChecked, setisSciChecked] = useState(false);

    const [subjectCount, setSubjectCount] = useState([addSubject]);
    const addSubject = []

    const months = [
        {checkbox: <input type="checkbox" checked={isEngChecked} id="errorCheckbox" className={layoutStyles.errorCheckbox} onChange={()=> addChecked()}/>, 
        label: <label htmlFor="langCheckbox" style={{cursor:"pointer"}}>English</label>},
        {checkbox: <input type="checkbox" checked={isHindiChecked} id="errorCheckbox" className={layoutStyles.errorCheckbox} onChange={()=> addChecked()}/>, 
        label: <label htmlFor="langCheckbox" style={{cursor:"pointer"}}>Hindi</label>},
        {checkbox: <input type="checkbox" checked={isMathChecked} id="errorCheckbox" className={layoutStyles.errorCheckbox} onChange={()=> addChecked()}/>, 
        label: <label htmlFor="langCheckbox" style={{cursor:"pointer"}}>Math</label>},
        {checkbox: <input type="checkbox" checked={isSciChecked} id="errorCheckbox" className={layoutStyles.errorCheckbox} onChange={()=> addChecked()}/>, 
        label: <label htmlFor="langCheckbox" style={{cursor:"pointer"}}>Science</label>},
    ];
    const listmonths = months.map((months) => <span key={months.id} className={styles.drop_pop_item} style={{display:"flex", alignItems:"center", gap:"8px"}} onClick={()=> {

        if(months.label.props.children == "Hindi"){
            setisHindiChecked(!isHindiChecked);

            !isHindiChecked ? setSubjectCount([...subjectCount, months.label.props.children]) : 
            setSubjectCount(subjectCount.filter(i => i !== months.label.props.children)) ;

        }else if(months.label.props.children == "English"){
            setisEngChecked(!isEngChecked);

            !isEngChecked ? setSubjectCount([...subjectCount, months.label.props.children]) : 
            setSubjectCount(subjectCount.filter(i => i !== months.label.props.children)) ;

        }else if(months.label.props.children == "Math"){
            setisMathChecked(!isMathChecked);

            !isMathChecked ? setSubjectCount([...subjectCount, months.label.props.children]) : 
            setSubjectCount(subjectCount.filter(i => i !== months.label.props.children)) ;

        }else if(months.label.props.children == "Science"){
            setisSciChecked(!isSciChecked);

            !isSciChecked ? setSubjectCount([...subjectCount, months.label.props.children]) : 
            setSubjectCount(subjectCount.filter(i => i !== months.label.props.children)) ;

        }
    }}>{months.checkbox}{months.label}</span>);
    

    const addChecked = () =>{
        //..
    }
    
    return(
        <div className={styles.text_default_input}>
            <div className={styles.text_input_container}>
                <div className={!state.disable ? styles.dropField : styles.dropField_disabled} onClick={!state.disable ? ()=> setDropActive(!dropActive): null}><span style={{display:"flex", alignItems:"center", 
                gap:"8px"}}>{subjectCount == 0 ? "Add Subjects" : subjectCount.sort().join("; ")}</span>
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
