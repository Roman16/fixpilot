'use client';

import React, {useState} from "react";
import {IClient} from "@/types/client";
import {Option, Select} from "@/app/components/ui/Select/Select";
import {useClientsList} from "@/hooks/clients/useClientsList";
import {debounce} from "@/utils/debounce";

interface ClientAutocompleteProps {
    value: string | null;
    onChange: (value: IClient | undefined) => void;
    disabled: boolean;
}

export const ClientAutocomplete: React.FC<ClientAutocompleteProps> = ({
                                                                          value,
                                                                          onChange,
                                                                          disabled
                                                                      }) => {
    const [search, setSearch] = useState("");

    const {data} = useClientsList(1, 50, search);
    const clients = data?.data ?? [];

    const handleChange = debounce((text: string) => setSearch(text));

    const onSelectHandle = (id: string) => {
        const client = clients.find(c => c.id === id);
        onChange(client)
    }

    const options = clients.map((c: IClient) => ({...c, value: c.id, label: c.name + ' ' + c.phone}))

    return (
        <Select<Option<IClient>>
            searchable
            label={'Клієнт'}
            value={value}
            options={options}
            optionRender={(option) => <>{option.name} <br/> {option.phone}</>}
            disabled={disabled}

            onChange={onSelectHandle}
            onInputChange={handleChange}
        />
    );
};
