"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CalendarDays, Clock, BookOpen, Flame } from "lucide-react"

interface AttendanceData {
  date: string
  studyHours: number
  topics: string[]
}

export function ProgressStats() {
  const [stats, setStats] = useState({
    totalDays: 0,
    totalHours: 0,
    totalTopics: 0,
    streak: 0,
  })

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/api/attendance`)
        const data: AttendanceData[] = await response.json()

        const totalDays = data.length
        const totalHours = data.reduce((acc, curr) => acc + curr.studyHours, 0)
        const totalTopics = new Set(data.flatMap(d => d.topics)).size

        let streak = 0
        let currentDate = new Date()
        
        for (let i = 0; i < data.length; i++) {
          const attendanceDate = new Date(data[i].date)
          if (
            attendanceDate.getDate() === currentDate.getDate() - i &&
            attendanceDate.getMonth() === currentDate.getMonth() &&
            attendanceDate.getFullYear() === currentDate.getFullYear()
          ) {
            streak++
          } else {
            break
          }
        }

        setStats({ totalDays, totalHours, totalTopics, streak })
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-primary/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <Flame className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
            <h3 className="text-2xl font-bold">{stats.streak} days</h3>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">Days Studied</p>
            </div>
            <span className="text-sm text-muted-foreground">{Math.round((stats.totalDays / 180) * 100)}%</span>
          </div>
          <p className="text-2xl font-bold mb-2">{stats.totalDays}</p>
          <Progress value={(stats.totalDays / 180) * 100} className="h-1.5" />
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">Total Hours</p>
            </div>
            <span className="text-sm text-muted-foreground">{Math.round((stats.totalHours / 720) * 100)}%</span>
          </div>
          <p className="text-2xl font-bold mb-2">{stats.totalHours}</p>
          <Progress value={(stats.totalHours / 720) * 100} className="h-1.5" />
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium">Topics Covered</p>
          </div>
          <p className="text-2xl font-bold">{stats.totalTopics}</p>
        </Card>
      </div>
    </div>
  )
}