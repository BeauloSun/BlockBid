import React, { useState, useEffect, useRef } from "react";

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const dropdownStyle = {
    position: "absolute",
    top: "100%",
    left: 0,
    transform: isOpen ? "translateY(0)" : "translate(-10px)",
    opacity: isOpen ? 1 : 0,
    marginTop: "0.5rem",
    width: "28%",
    borderColor: "#86EFAC",
    borderWidth: "2px",
    borderStyle: "solid",
  };

  return (
    <form className="w-full">
      <div className="flex relative">
        <button
          onClick={toggleDropdown}
          id="dropdown-button"
          data-dropdown-toggle="dropdown"
          className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-900 bg-slate-400 border border-white rounded-s-lg focus:ring-2 focus:outline-none focus:ring-green-300"
          type="button"
        >
          All categories{" "}
          <svg
            className="w-2.5 h-2.5 ms-2.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 10 6"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 1 4 4 4-4"
            />
          </svg>
        </button>
        <div
          id="dropdown"
          style={dropdownStyle}
          ref={dropdownRef}
          className={`z-10 ${
            isOpen ? "block" : "hidden"
          } bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700`}
        >
          <ul
            className="py-2 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdown-button"
          >
            <li>
              <button
                type="button"
                className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                ERC-721
              </button>
            </li>
            <li>
              <button
                type="button"
                className="inline-flex w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
              >
                ERC-1155
              </button>
            </li>
          </ul>
        </div>
        <div className="relative w-full">
          <input
            type="search"
            id="search-dropdown"
            className="block p-2.5 w-full z-20 text-m text-gray-900 bg-gray-50 rounded-e-lg border-white border-s-2 border dark:bg-gray-700 dark:border-s-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:border-green-300"
            placeholder="Search the marketplace..."
            required
          />
          <button
            type="submit"
            className="absolute top-0 end-0 p-2.5 text-sm font-bold h-full text-black bg-yellow-300 rounded-e-lg border border-yellow-300 hover:bg-yellow-200 focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:bg-yellow-300 dark:hover:bg-yellow-200 dark:focus:ring-green-300"
          >
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <span className="sr-only">Search</span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
