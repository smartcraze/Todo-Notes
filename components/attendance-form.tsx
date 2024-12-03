"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  date: z.date(),
  studyHours: z.number().min(0).max(24).refine((value) => !isNaN(value), {
    message: "Study hours must be a valid number",
  }),
  topics: z.string().min(1),
  notes: z.string().optional(),
});

export function AttendanceForm() {
  const [date, setDate] = useState<Date>(new Date());
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      studyHours: 0,
      topics: "",
      notes: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Submitted values:", values);

    try {
      // Check if the notes field is not empty and split the notes into an array
      const notesArray = values.notes
        ? values.notes.split(",").map((note) => note.trim()) // Split by comma and trim each note
        : [];

      const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT}/api/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          date: values.date.toISOString(), // Ensure date is in ISO format
          status: "present", // Ensure status is "present"
          topics: values.topics.split(",").map((t) => t.trim()), // Handle multiple topics as an array
          notes: notesArray, // Send notes as an array
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error("Failed to mark attendance");
      }

      toast({
        title: "Success!",
        description: "Your progress has been recorded.",
      });

      form.reset();
    } catch (error) {
      console.error("Submission Error:", error);

      toast({
        title: "Error",
        description: "Failed to record progress. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(date) => {
            if (date) {
              setDate(date);
              form.setValue("date", date);
            }
          }}
          disabled={(date) => date > new Date()}
          className="rounded-md"
        />
      </Card>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="studyHours">Study Hours</Label>
          <Input
            id="studyHours"
            type="number"
            placeholder="Enter hours studied"
            {...form.register("studyHours", { valueAsNumber: true })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="topics">Topics Covered</Label>
          <Input
            id="topics"
            placeholder="Arrays, Linked Lists, etc."
            {...form.register("topics")}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Study Notes</Label>
          <Textarea
            id="notes"
            placeholder="What did you learn today?"
            className="min-h-[100px]"
            {...form.register("notes")}
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Save Progress
      </Button>
    </form>
  );
}
