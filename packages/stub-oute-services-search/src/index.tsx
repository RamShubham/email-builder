class Search {
  constructor(_config?: any) {}
  searchImage(_payload?: any) { return Promise.resolve({ status: 'success', result: { results: [] } }); }
}

export default Search;
