import React from 'react'
import TodayTable from './component/Table'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import TimeEntry from './component/AddTime'

export default function Today() {
  return (
    <div>
      <div className='flex justify-between items-center p-4'>
        <div className='text-2xl font-semibold '>Today</div>
        <div>
          <TimeEntry />
        </div>
      </div>
      <div>
        <TodayTable />
      </div>
    </div>
  )
}
