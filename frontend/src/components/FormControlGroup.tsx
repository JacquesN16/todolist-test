import React from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';

interface FormControlGroupProps {
  controlId: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  showPasswordToggle?: boolean;
  onTogglePasswordVisibility?: () => void;
  isPasswordVisible?: boolean;
}

const FormControlGroup: React.FC<FormControlGroupProps> = ({
  controlId,
  label,
  type,
  placeholder,
  value,
  onChange,
  required = false,
  showPasswordToggle = false,
  onTogglePasswordVisibility,
  isPasswordVisible,
}) => {
  return (
    <Form.Group className="mb-3" controlId={controlId}>
      <Form.Label>{label}</Form.Label>
      {showPasswordToggle ? (
        <InputGroup>
          <Form.Control
            type={isPasswordVisible ? 'text' : 'password'}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
          />
          <Button variant="outline-secondary" onClick={onTogglePasswordVisibility}>
            {isPasswordVisible ? 'Hide' : 'Show'}
          </Button>
        </InputGroup>
      ) : (
        <Form.Control
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
      )}
    </Form.Group>
  );
};

export default FormControlGroup;
