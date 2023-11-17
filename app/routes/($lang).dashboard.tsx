import { Outlet, useLocation } from '@remix-run/react';
import { useI18n } from 'remix-i18n';
import { LocaleLink } from '~/components/link';

export default function DashboardLayout() {
  const { pathname } = useLocation();
  const { t } = useI18n();

  return (
    <>
      {!pathname.endsWith('/dashboard') && (
        <div className='tooltip mr-4' data-tip={t('common.go_back')}>
          <LocaleLink to='/dashboard' className='btn btn-circle'>
            <svg
              viewBox='0 0 512 512'
              className='fill-current'
              xmlns='http://www.w3.org/2000/svg'
              width='32'
              height='32'>
              <path
                fill='none'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={48}
                d='M244 400L100 256l144-144M120 256h292'
              />
            </svg>
          </LocaleLink>
        </div>
      )}
      <Outlet />
    </>
  );
}
