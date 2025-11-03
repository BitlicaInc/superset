/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { useCallback, useMemo } from 'react';
import { t, NO_TIME_RANGE } from '@superset-ui/core';
import { extendedDayjs } from '@superset-ui/core/utils/dates';
import { RangePicker } from '@superset-ui/core/components';
import type { Dayjs } from 'dayjs';

interface EnhancedDateRangePickerProps {
  value?: string;
  name: string;
  onChange: (value: string) => void;
  onOpenPopover?: () => void;
  onClosePopover?: () => void;
  isOverflowingFilterBar?: boolean;
}

export default function EnhancedDateRangePicker({
  value,
  onChange,
  onOpenPopover,
  onClosePopover,
}: EnhancedDateRangePickerProps) {
  const rangeValue: [Dayjs, Dayjs] | null = (() => {
    if (!value || value === NO_TIME_RANGE || value === 'No filter') {
      return null;
    }

    const parts = value.split(' : ');
    if (parts.length === 2) {
      try {
        const start = extendedDayjs(parts[0].trim());
        const end = extendedDayjs(parts[1].trim());
        if (start.isValid() && end.isValid()) {
          return [start, end];
        }
      } catch (e) {
        console.error('Failed to parse date range:', e);
      }
    }

    return null;
  })();

  const handleDateChange = useCallback(
    (dates: [Dayjs | null, Dayjs | null] | null) => {
      if (dates && dates[0] && dates[1]) {
        const formattedValue = `${dates[0].format('YYYY-MM-DD HH:mm:ss')} : ${dates[1].format('YYYY-MM-DD HH:mm:ss')}`;
        onChange(formattedValue);
      } else {
        onChange(NO_TIME_RANGE);
      }

      if (onClosePopover) {
        onClosePopover();
      }
    },
    [onChange, onClosePopover],
  );

  const ranges = useMemo(
    (): Record<string, [Dayjs, Dayjs]> => ({
      [t('Today')]: [
        extendedDayjs().startOf('day'),
        extendedDayjs().endOf('day'),
      ],
      [t('Yesterday')]: [
        extendedDayjs().subtract(1, 'd').startOf('day'),
        extendedDayjs().subtract(1, 'd').endOf('day'),
      ],
      [t('Last 3 days')]: [
        extendedDayjs().subtract(3, 'd').startOf('day'),
        extendedDayjs().endOf('day'),
      ],
      [t('Last 7 days')]: [
        extendedDayjs().subtract(7, 'd').startOf('day'),
        extendedDayjs().endOf('day'),
      ],
      [t('Last 14 days')]: [
        extendedDayjs().subtract(14, 'd').startOf('day'),
        extendedDayjs().endOf('day'),
      ],
      [t('Last 30 days')]: [
        extendedDayjs().subtract(30, 'd').startOf('day'),
        extendedDayjs().endOf('day'),
      ],
      [t('This week')]: [
        extendedDayjs().startOf('week'),
        extendedDayjs().endOf('week'),
      ],
      [t('This month')]: [
        extendedDayjs().startOf('month'),
        extendedDayjs().endOf('month'),
      ],
      [t('Last month')]: [
        extendedDayjs().subtract(1, 'month').startOf('month'),
        extendedDayjs().subtract(1, 'month').endOf('month'),
      ],
      [t('This year')]: [
        extendedDayjs().startOf('year'),
        extendedDayjs().endOf('year'),
      ],
      [t('Last year')]: [
        extendedDayjs().subtract(1, 'year').startOf('year'),
        extendedDayjs().subtract(1, 'year').endOf('year'),
      ],
    }),
    [],
  );

  return (
    <RangePicker
      showTime
      format="YYYY-MM-DD HH:mm:ss"
      value={rangeValue}
      onChange={handleDateChange}
      onOpenChange={(open: boolean) => {
        if (open && onOpenPopover) {
          onOpenPopover();
        } else if (!open && onClosePopover) {
          onClosePopover();
        }
      }}
      style={{ width: '100%' }}
      ranges={ranges}
      popupStyle={{ minHeight: '400px' }}
    />
  );
}

