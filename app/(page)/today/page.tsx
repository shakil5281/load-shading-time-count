"use client";
import React from 'react'
import TodayTable from './component/Table'
import TimeEntry from './component/AddTime'

import { useEffect, useState } from "react";
import Loading from '@/app/loading';

const fetchTimeEntries = async () => {
  const response = await fetch('/api/load-shedding');
  if (!response.ok) {
    throw new Error('Failed to fetch time entries');
  }
  return response.json();
};

export default function Today() {

  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true)

  const hide = () =>{
    getData();
  }

  const getData = async () => {
    try {
      const timeEntries = await fetchTimeEntries();
      setData(timeEntries);
      setLoading(false)
    } catch (err) {
      setError('Failed to load data');
    }
  };
  useEffect(() => {
    getData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }
  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <div>
      <div className='flex justify-between items-center p-4'>
        <div className='text-2xl font-semibold '>Today</div>
        <div>
          <TimeEntry hide={hide} />
        </div>
      </div>
      <div>
        <TodayTable data={data} />
      </div>
    </div>
  )
}
