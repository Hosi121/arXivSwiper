interface FilterPanelProps {
  onCategoryChange: (categories: string[]) => void;
  onKeywordChange: (keyword: string) => void;
  onSortChange: (sortBy: string) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  onCategoryChange,
  onKeywordChange,
  onSortChange,
}) => {
  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const category = event.target.value;
    // カテゴリ変更時の処理
    onCategoryChange([category]); // 仮実装
  };


  const handleKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = event.target.value;
    // キーワード変更時の処理
    onKeywordChange(keyword); // 仮実装
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sortBy = event.target.value;
    // ソート変更時の処理
    onSortChange(sortBy); // 仮実装
  };

  return (
    <div className="filter-panel">
      <h2>Filter</h2>
      <div className="category-filter">
        <h3>Category</h3>
        <label>
          <input
            type="checkbox"
            value="cs.LG"
            onChange={handleCategoryChange}
          />
          cs.LG
        </label>
        {/* 他のカテゴリのチェックボックス */}
      </div>
      <div className="date-range-filter">
        <h3>Date Range</h3>
        {/* 日付範囲選択コンポーネント */}
      </div>
      <div className="keyword-filter">
        <h3>Keyword</h3>
        <input
          type="text"
          placeholder="Enter keyword"
          onChange={handleKeywordChange}
        />
      </div>
      <div className="sort-filter">
        <h3>Sort By</h3>
        <select onChange={handleSortChange}>
          <option value="relevance">Relevance</option>
          <option value="date">Date</option>
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;
