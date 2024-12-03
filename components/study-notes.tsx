"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { format } from "date-fns"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Note {
  date: string
  notes: string
  topics: string[]
}

export function StudyNotes() {
  const [notes, setNotes] = useState<Note[]>([])

  useEffect(() => {
    async function fetchNotes() {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/api/attendance`)
        const data = await response.json()
        setNotes(data.filter((note: Note) => note.notes).slice(0, 5))
      } catch (error) {
        console.error("Failed to fetch notes:", error)
      }
    }

    fetchNotes()
  }, [])

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="space-y-4">
        {notes.map((note, index) => (
          <Card key={index} className="p-4">
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <time className="text-sm text-muted-foreground">
                    {format(new Date(note.date), "MMMM d, yyyy")}
                  </time>
                </div>
                <div className="flex flex-wrap gap-2">
                  {note.topics.map((topic, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                {note.notes}
              </div>
            </div>
          </Card>
        ))}

        {notes.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No study notes yet. Start adding notes with your daily progress!
            </p>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}