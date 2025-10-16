import React from 'react'
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage} from './ui/form';
import { Input } from './ui/input';
import { Control, Controller, FieldValues , FieldPath} from 'react-hook-form';



interface FormFieldProps<T extends FieldValues>{
    control: Control<T>;
    name: FieldPath<T>;
    label: string;
    placeholder?: string;
    type? : 'text'| 'email' | 'password' | 'file'
}

const FormField = <T extends FieldValues>({control, name, label, placeholder, type="text"}:FormFieldProps<T> ) => (
    <Controller name={name} control={control} 
        render={({ field }) =>(
          <FormItem>
            <FormLabel className='Label'>{label}</FormLabel>
            <FormControl>
              <Input className='input' placeholder={placeholder} 
              type={type} {...field} />
            </FormControl>
            <FormMessage/>
          </FormItem>

        )}
       />


);

export default FormField