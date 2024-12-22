import {FormGroup, Input, Label} from "reactstrap";
import React from "react";

const CustomTextarea = ({label, placeholder="", value, setValue, disabled, name}) => {
    return (
        <FormGroup>
            <Label>{label}</Label>
            <Input placeholder={placeholder} className="w-100" type="textarea" rows="5" name={name} value={value} onChange={(e) => setValue(e.target.value)} style={{resize:"none"}} disabled={disabled} required/>
        </FormGroup>
    )
};

export default CustomTextarea