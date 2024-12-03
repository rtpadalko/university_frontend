import {FormGroup, Input, Label} from "reactstrap";
import React from "react";
import {InputType} from "reactstrap/types/lib/Input"

export const CustomInput = ({label, placeholder, value, setValue, disabled, required=true, error=false, valid=false, type="string"}) => {
    return (
        <FormGroup>
            <Label>{label}</Label>
            <Input
                placeholder={placeholder}
                className="w-100"
                type={type as InputType}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                invalid={error}
                disabled={disabled}
                required={required}
                valid={valid}
            />
        </FormGroup>
    );
};