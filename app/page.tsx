import { Calendar } from "@/components/ui/calendar"
import { AttendanceForm } from "@/components/attendance-form"
import { ProgressStats } from "@/components/progress-stats"
import { StudyNotes } from "@/components/study-notes"
import { ContributionGraph } from "@/components/contribution-graph"
import { Separator } from "@/components/ui/separator"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold tracking-tight">Focus Suraj Vishwakarma </h1>
          <p className="text-muted-foreground mt-1">Track your learning journey</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-10">
          <section>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ContributionGraph />
              </div>
              <div>
                <ProgressStats />
              </div>
            </div>
          </section>

          <Separator />

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Mark Attendance</h2>
                <AttendanceForm />
              </div>
            </div>

            <div className="lg:col-span-2">
              <div>
                <h2 className="text-xl font-semibold mb-4">Recent Notes</h2>
                <StudyNotes />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}