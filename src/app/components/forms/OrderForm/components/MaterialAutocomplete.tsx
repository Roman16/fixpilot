// components/forms/OrderForm/components/MaterialAutocomplete.tsx

import React from 'react';
import {Autocomplete} from '@/app/components/ui/Autocomplete/Autocomplete';
import {useServiceTemplates} from '@/hooks/serviceTemplates/useServiceTemplates';
import {IMaterialTemplate} from '@/types/serviceTemplate';

interface MaterialAutocompleteProps {
    value: string;
    onChange: (value: string, defaultPrice?: number) => void;
    placeholder?: string;
}

export const MaterialAutocomplete: React.FC<MaterialAutocompleteProps> = ({value, onChange, placeholder}) => {
    const {data: templates} = useServiceTemplates();
    const materials: IMaterialTemplate[] = templates?.materials || [];

    return (
        <Autocomplete<IMaterialTemplate>
            placeholder={placeholder || 'Назва матеріалу'}
            value={value}
            suggestions={materials}
            openOnFocus={true}
            getItemValue={(item) => item.name}
            renderItem={(item) => (
                <span style={{display: 'flex', justifyContent: 'space-between', gap: '1rem'}}>
                    <span>{item.name}</span>
                    {item.price != null && (
                        <span style={{opacity: 0.45, fontSize: '0.8em'}}>{item.price} ₴</span>
                    )}
                </span>
            )}
            onChange={(val) => {
                const matched = materials.find(
                    (m) => m.name.toLowerCase() === val.toLowerCase()
                );
                onChange(val, matched?.price);
            }}
        />
    );
};