const normalizeSearch = (search: string | undefined): string | undefined => {
  return search?.trim() === '' ? undefined : search;
};

export default normalizeSearch;
