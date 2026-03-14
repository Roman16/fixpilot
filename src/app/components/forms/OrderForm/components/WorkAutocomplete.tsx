import React from 'react';
import {Autocomplete} from '@/app/components/ui/Autocomplete/Autocomplete';
import {useServiceTemplates} from '@/hooks/serviceTemplates/useServiceTemplates';
import {IWorkTemplate} from '@/types/serviceTemplate';

interface WorkAutocompleteProps {
    value: string;
    onChange: (value: string, defaultPrice?: number) => void;
    placeholder?: string;
}

export const WorkAutocomplete: React.FC<WorkAutocompleteProps> = ({value, onChange, placeholder}) => {
    const {data: templates} = useServiceTemplates();
    const works: IWorkTemplate[] = templates?.works || [];

    return (
        <Autocomplete<IWorkTemplate>
            placeholder={placeholder || 'Назва роботи'}
            value={value}
            suggestions={works}
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
                const matched = works.find(
                    (w) => w.name.toLowerCase() === val.toLowerCase()
                );
                onChange(val, matched?.price);
            }}
        />
    );
};