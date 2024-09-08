import React from 'react'
import TodayTable from './component/Table'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'

export default function Today() {
  return (
    <div>
      <div className='flex justify-between items-center p-4'>
        <div>Today</div>
        <div>
          <Button size="sm" className="h-7 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add Time
            </span>
          </Button>
        </div>
      </div>
      <div>
        <TodayTable />
      </div>
    </div>
  )
}
