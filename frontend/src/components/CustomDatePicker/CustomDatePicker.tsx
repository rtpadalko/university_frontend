import {FormGroup, Input, Label} from "reactstrap";
import React from "react";

export const CustomDatePicker = ({label, value, setValue, disabled}) => {
    return (
        <FormGroup>
            <Label>{label}</Label>
            <Input className="w-100" type="date" value={value?.split("+")[0]} onChange={(e) => setValue(e.target.value)} disabled={disabled} required/>
        </FormGroup>
    );
};