"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { format, subDays, eachDayOfInterval, getDay, startOfWeek } from "date-fns"

interface ContributionDay {
  date: string
  count: number
}

export function ContributionGraph() {
  const [contributions, setContributions] = useState<ContributionDay[]>([])
  const [maxHours, setMaxHours] = useState(0)

  useEffect(() => {
    async function fetchContributions() {
      try {
        const response = await fetch("https://dsabackend.smartcraze.online/api/attendance")
        const data = await response.json()
        
        // Generate last 365 days
        const days = eachDayOfInterval({
          start: subDays(new Date(), 364),
          end: new Date(),
        })

        const contributionData = days.map(day => {
          const matchingDay = data.find((d: any) => 
            format(new Date(d.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
          )
          return {
            date: format(day, 'yyyy-MM-dd'),
            count: matchingDay ? matchingDay.studyHours : 0
          }
        })

        const max = Math.max(...contributionData.map(d => d.count))
        setMaxHours(max)
        setContributions(contributionData)
      } catch (error:any) {
        console.error("Failed to fetch contribution data:", error)
      }
    }

    fetchContributions()
  }, [])

  const getContributionColor = (hours: number) => {
    if (hours === 0) return "bg-muted hover:bg-muted/80"
    const intensity = Math.min(Math.ceil((hours / maxHours) * 4), 4)
    switch (intensity) {
      case 1: return "bg-emerald-200 dark:bg-emerald-900 hover:bg-emerald-300 dark:hover:bg-emerald-800"
      case 2: return "bg-emerald-300 dark:bg-emerald-700 hover:bg-emerald-400 dark:hover:bg-emerald-600"
      case 3: return "bg-emerald-400 dark:bg-emerald-600 hover:bg-emerald-500 dark:hover:bg-emerald-500"
      case 4: return "bg-emerald-500 dark:bg-emerald-500 hover:bg-emerald-600 dark:hover:bg-emerald-400"
      default: return "bg-muted hover:bg-muted/80"
    }
  }

  // Create weeks array with proper day alignment
  const weeks: ContributionDay[][] = []
  const firstDate = new Date(contributions[0]?.date || new Date())
  const firstDay = getDay(firstDate)
  
  // Add empty days at the start if needed
  const emptyDays = Array(firstDay).fill({ date: '', count: -1 })
  let currentWeek = [...emptyDays]

  contributions.forEach((day, index) => {
    currentWeek.push(day)
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  })

  // Add remaining days to last week if any
  if (currentWeek.length > 0) {
    weeks.push(currentWeek)
  }

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Study Contribution Graph</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-muted" />
            <div className="w-3 h-3 rounded-sm bg-emerald-200 dark:bg-emerald-900" />
            <div className="w-3 h-3 rounded-sm bg-emerald-300 dark:bg-emerald-700" />
            <div className="w-3 h-3 rounded-sm bg-emerald-400 dark:bg-emerald-600" />
            <div className="w-3 h-3 rounded-sm bg-emerald-500 dark:bg-emerald-500" />
          </div>
          <span>More</span>
        </div>
      </div>

      <div className="flex">
        <div className="grid grid-cols-1 gap-2 mr-2 text-xs text-muted-foreground">
          {weekDays.map((day, index) => (
            <div key={day} className="h-3 flex items-center">
              {index % 2 === 0 && day}
            </div>
          ))}
        </div>
        <div className="flex gap-1 overflow-x-auto pb-2">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`w-3 h-3 rounded-sm transition-colors ${
                    day.count === -1 ? 'invisible' : getContributionColor(day.count)
                  }`}
                  title={day.date ? `${format(new Date(day.date), 'MMM d, yyyy')}: ${day.count} hours` : ''}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 text-xs text-muted-foreground">
        <p>
          {maxHours > 0
            ? `Maximum ${maxHours} hours of study in a single day`
            : 'No study hours recorded yet'}
        </p>
      </div>
    </Card>
  )
}