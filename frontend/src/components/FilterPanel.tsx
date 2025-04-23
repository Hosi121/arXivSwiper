import { useState } from 'react';

interface FilterPanelProps {
  onCategoryChange: (categories: string[]) => void;
  onKeywordChange: (keyword: string) => void;
  onSortChange: (sortBy: string) => void;
  onDateRangeChange: (startDate: Date | null, endDate: Date | null) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  onCategoryChange,
  onKeywordChange,
  onSortChange,
  onDateRangeChange,
}: FilterPanelProps) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const category = event.target.value;
    const isChecked = event.target.checked;

    setSelectedCategories((prevCategories) => {
      if (isChecked) {
        return [...prevCategories, category];
      } else {
        return prevCategories.filter((c) => c !== category);
      }
    });

    onCategoryChange(selectedCategories);
  };

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(event.target.value ? new Date(event.target.value) : null);
    onDateRangeChange(startDate, endDate);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(event.target.value ? new Date(event.target.value) : null);
    onDateRangeChange(startDate, endDate);
  };


  const handleKeywordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = event.target.value;
    onKeywordChange(keyword);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const sortBy = event.target.value;
    onSortChange(sortBy);
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
            checked={selectedCategories.includes("cs.LG")}
            onChange={handleCategoryChange}
          />
          cs.LG
        </label>
        <label>
          <input
            type="checkbox"
            value="cs.AI"
            checked={selectedCategories.includes("cs.AI")}
            onChange={handleCategoryChange}
          />
          cs.AI
        </label>
        <label>
          <input
            type="checkbox"
            value="cs.CL"
            checked={selectedCategories.includes("cs.CL")}
            onChange={handleCategoryChange}
          />
          cs.CL
        </label>
      </div>
      <div className="date-range-filter">
        <h3>Date Range</h3>
        <label>
          Start Date:
          <input type="date" onChange={handleStartDateChange} />
        </label>
        <label>
          End Date:
          <input type="date" onChange={handleEndDateChange} />
        </label>
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
