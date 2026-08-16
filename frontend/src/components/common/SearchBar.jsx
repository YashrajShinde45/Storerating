const SearchBar = ({ value, onChange, placeholder }) => {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="search-input"
    />
  );
};

export default SearchBar;
