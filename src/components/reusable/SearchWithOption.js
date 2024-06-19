import React, { useState, useEffect } from 'react';
import helpers from 'utils/helpers';

function SearchableDropdown({ searchTerm, setSearchTerm, setFilteredItems,placeholder, setDropdownVisible,filterData, dropdownVisible, filteredItems, setIsSelected,setFilterData }) {
    const handleItemClick = (item) => {
        setSearchTerm(`${item?.name}`);
        setFilteredItems([]);
        setDropdownVisible(false);
        setIsSelected(true)
        setHighlightedIndex(-1);
        setFilterData({...filterData, userId: item?._id});
    };
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const handleKeyDown = (event) => {
        if (!dropdownVisible) return;

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setHighlightedIndex((prevIndex) => (prevIndex + 1) % filteredItems?.length);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setHighlightedIndex((prevIndex) =>
                prevIndex === 0 ? filteredItems?.length - 1 : prevIndex - 1
            );
        } else if (event.key === 'Enter' && highlightedIndex >= 0) {
            event.preventDefault();
            handleItemClick(filteredItems[highlightedIndex]);
        }
    };
    useEffect(() => {
        if (dropdownVisible && highlightedIndex >= 0 && highlightedIndex < filteredItems?.length) {
            const highlightedItem = document.querySelector('.highlighted');
            if (highlightedItem) {
                highlightedItem?.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [highlightedIndex, dropdownVisible]);
    const handleBlur = () => {
        setTimeout(() => setDropdownVisible(false), 100);
    };


    return (
        <div className="p-4">
            <div className="relative">
                <div className='absolute inset-y-0 right-0 flex items-center pl-3 mr-3 pointer-events-none'>
                    {helpers.ternaryCondition(!searchTerm, (
                        <svg
                            aria-hidden='true'
                            className='w-4 h-4 text-[#A5A5A5] dark:text-gray-40'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                            />
                        </svg>
                    ), (
                        ''
                    ))}
                </div>

                <input
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    onChange={(e) => { setSearchTerm(e?.target?.value?.toLowerCase()); setIsSelected(false) }}
                    className="block w-full p-2 outline-none text-sm text-gray-900 2xl:min-w-[250px] xl:min-w-[300px] rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 2xl:min-w-[350px] xl:min-w-[300px]  2xl:min-w-[250px] xl:min-w-[300px]"
                />
                {dropdownVisible && (
                    <ul className="border border-t-0 p-2 absolute bg-white w-full z-10 max-h-40 overflow-auto">
                        {filteredItems?.length > 0 ? (
                            filteredItems?.map((item, index) => (
                                <li key={index} className={`p-2 cursor-pointer hover:bg-gray-200 ${highlightedIndex === index ? 'highlighted bg-gray-300' : ''
                                    }`} onClick={() => handleItemClick(item)}><small>{item?.name} ({item?.email + ',' + item?.mobile})</small></li>
                            ))
                        ) : (
                            <li className="p-1 text-gray-500"><small>No results found</small></li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default SearchableDropdown;
