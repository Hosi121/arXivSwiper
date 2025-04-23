import { renderHook, act } from '@testing-library/react-hooks';
import usePapers from './usePapers';
import axios from 'axios';
import { Paper } from '../types/paper';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('usePapers', () => {
  const defaultPaper: Paper = {
    id: 'test-id',
    title: 'Test Paper',
    abstract: 'Test Summary',
    url: 'http://example.com',
    published: '2023-01-01',
    authors: ['Test Author'],
    category: 'Test Category',
    summary: 'Test Summary',
    liked: false,
  };

  beforeEach(() => {
    mockedAxios.get.mockReset();
  });

  it('should return an empty array initially', () => {
    const { result } = renderHook(() => usePapers([], '', ''));
    expect(result.current[0]).toEqual(expect.arrayContaining([]));
  });

  it('should fetch papers when categories, keyword, or sortBy changes', async () => {
    mockedAxios.get.mockResolvedValue({ data: [defaultPaper] });

    interface HookProps {
      categories: string[];
      keyword: string;
      sortBy: string;
    }

    const { result, rerender } = renderHook(
      (props: HookProps) => usePapers(props.categories, props.keyword, props.sortBy),
      {
        initialProps: { categories: [], keyword: '', sortBy: '' },
      }
    );

    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(result.current[0]).toEqual(expect.arrayContaining([]));

    rerender({ categories: ['cs.AI'], keyword: 'test', sortBy: 'date' });
    await act(() => Promise.resolve());

    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    expect(result.current[0]).toEqual([defaultPaper]);
  });

  it('should update papers when fetch is successful', async () => {
    mockedAxios.get.mockResolvedValue({ data: [defaultPaper] });

    const { result } = renderHook(() => usePapers(['cs.AI'], 'test', 'date'));
    await act(() => Promise.resolve()); // Wait for the useEffect to complete

    expect(result.current[0]).toEqual([defaultPaper]);
  });

  it('should log an error to the console when fetch fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error');
    mockedAxios.get.mockRejectedValue(new Error('Test error'));

    const { result } = renderHook(() => usePapers(['cs.AI'], 'test', 'date'));
    await act(() => Promise.resolve()); // Wait for the useEffect to complete

    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('should like a paper', () => {
    const { result } = renderHook(() => usePapers(['Test Category'], '', ''));
    act(() => {
      result.current[1](defaultPaper);
    });
    expect(result.current[0][0].liked).toBe(true);
  });

  it('should unlike a paper', () => {
    const { result } = renderHook(() => usePapers(['Test Category'], '', ''));
    const like = result.current[1];
    const unlike = result.current[2];
    act(() => {
      like(defaultPaper); // Like first
    });
    act(() => {
      unlike(defaultPaper); // Then unlike
    });
    expect(result.current[0][0].liked).toBe(false);
  });
});
