import React from 'react';

const FieldSet = ({title, className, children}) => (
    <fieldset className={className || 'custom-fieldset'}>
        <legend>{title}</legend>
        {children}
    </fieldset>
);

export default FieldSet;