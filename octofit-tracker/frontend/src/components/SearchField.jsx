function SearchField({ value, onChange, label = 'Filter records' }) {
  return (
    <label className="search-field">
      <span className="visually-hidden">{label}</span>
      <span aria-hidden="true" className="search-mark" />
      <input onChange={(event) => onChange(event.target.value)} placeholder="Search this list" type="search" value={value} />
    </label>
  )
}

export default SearchField