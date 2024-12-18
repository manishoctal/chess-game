import React from "react";
import Select from "react-select";


const SearchableDropdown = ({ options, onSelect, placeholder,selectedUser }) => {

    const handleChange = (selectedOption) => {
        onSelect(selectedOption);
    };

    return (
            <Select
                value={selectedUser}
                options={options}
                onChange={handleChange}
                placeholder={placeholder || "Search"}
                isSearchable={true}
            />
        
    );
};

export default SearchableDropdown;
