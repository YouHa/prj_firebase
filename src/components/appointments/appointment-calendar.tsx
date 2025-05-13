"use client";

import { useState, useMemo } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Appointment } from '@/types';
import { format, isSameDay } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { CreateAppointmentDialog } from './create-appointment-dialog';

interface AppointmentCalendarProps {
  initialAppointments?: Appointment[];
}

export function AppointmentCalendar({ initialAppointments = [] }: AppointmentCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
  };

  const handleAddAppointment = (newAppointment: Appointment) => {
    setAppointments(prev => [...prev, newAppointment].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.startTime.localeCompare(b.startTime)));
  };

  const appointmentsForSelectedDay = useMemo(() => {
    if (!selectedDate) return [];
    return appointments
      .filter(app => isSameDay(app.date, selectedDate))
      .sort((a,b) => a.startTime.localeCompare(b.startTime));
  }, [selectedDate, appointments]);

  const appointmentDates = useMemo(() => {
    return appointments.map(app => app.date);
  }, [appointments]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-2 shadow-lg">
        <CardHeader>
          <CardTitle>Appointment Calendar</CardTitle>
          <CardDescription>Select a date to view or add appointments.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDayClick}
            className="rounded-md border"
            modifiers={{ booked: appointmentDates }}
            modifiersStyles={{ booked: { fontWeight: 'bold', color: 'hsl(var(--primary))' } }}
          />
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>
                {selectedDate ? format(selectedDate, 'PPP') : 'Appointments'}
              </CardTitle>
              <CardDescription>
                {selectedDate ? `Appointments for this day.` : 'Select a day to see appointments.'}
              </CardDescription>
            </div>
            <CreateAppointmentDialog onAppointmentCreate={handleAddAppointment} selectedDate={selectedDate}/>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            {appointmentsForSelectedDay.length > 0 ? (
              <ul className="space-y-3">
                {appointmentsForSelectedDay.map(app => (
                  <li key={app.id} className="p-3 rounded-md border bg-card hover:bg-muted/50 transition-colors">
                    <h4 className="font-semibold text-sm text-primary">{app.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {app.startTime} - {app.endTime}
                    </p>
                    {app.description && <p className="text-xs mt-1">{app.description}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No appointments for this day.
              </p>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
