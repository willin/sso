import clsx from 'classnames';
import { useLocation, useSearchParams } from '@remix-run/react';
import { useEffect, type FormEvent } from 'react';
import { LocaleLink } from './link';

export function Paginator({ total }: { total: number }) {
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    if (!searchParams.get('size') || !searchParams.get('page')) {
      setSearchParams((s) => {
        s.set('size', '20');
        s.set('page', '1');
        return s;
      });
    }
  }, [searchParams, setSearchParams]);

  const page = Number(searchParams.get('page'));
  const pages = Math.ceil(Number(total || 0) / Number(searchParams.get('size')));
  const arr = Array.from({ length: 5 }, (_, i) => page - 2 + i).filter((x) => x > 1 && x < pages);

  return (
    <div className='flex justify-center my-4'>
      <select
        className='select select-bordered w-24 max-w-xs mr-2'
        onChange={(e: FormEvent) => {
          setSearchParams((s) => {
            s.set('size', e.target.value);
            return s;
          });
        }}
        defaultValue={searchParams.get('size') || '20'}>
        <option value='10'>10</option>
        <option value='20'>20</option>
        <option value='50'>50</option>
        <option value='100'>100</option>
      </select>
      <div className='join'>
        <LocaleLink
          to={`${pathname}?${searchParams.toString().replace(`page=${page}`, `page=1`)}`}
          className={clsx('join-item btn', {
            'btn-disabled': page === 1
          })}>
          1
        </LocaleLink>
        {arr.length > 0 && arr[0] > 2 && <button className='join-item btn btn-disabled'>...</button>}
        {arr.map((p) => (
          <LocaleLink
            key={p}
            to={`${pathname}?${searchParams.toString().replace(`page=${page}`, `page=${p}`)}`}
            className={clsx('join-item btn', {
              'btn-disabled': page === p
            })}>
            {p}
          </LocaleLink>
        ))}
        {arr.length > 0 && arr[arr.length - 1] < pages - 1 && (
          <button className='join-item btn btn-disabled'>...</button>
        )}
        {pages > 1 && (
          <LocaleLink
            to={`${pathname}?${searchParams.toString().replace(`page=${page}`, `page=${pages}`)}`}
            className={clsx('join-item btn', {
              'btn-disabled': page === pages
            })}>
            {pages}
          </LocaleLink>
        )}
      </div>
    </div>
  );
}
