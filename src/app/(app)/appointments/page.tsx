"use client";

import { PageHeader } from "@/components/shared/page-header";
import { AppointmentCalendar } from "@/components/appointments/appointment-calendar";
import type { Appointment } from "@/types";

// Mock initial appointments
const MOCK_APPOINTMENTS: Appointment[] = [
  { id: '1', title: 'Team Meeting', date: new Date(), startTime: '10:00', endTime: '11:00', description: 'Weekly sync-up' },
  { id: '2', title: 'Client Call - Acme Corp', date: new Date(), startTime: '14:00', endTime: '15:00', description: 'Project discussion' },
  { id: '3', title: 'Dentist Appointment', date: new Date(new Date().setDate(new Date().getDate() + 2)), startTime: '09:00', endTime: '09:30' },
  { id: '4', title: 'Project Deadline Presentation', date: new Date(new Date().setDate(new Date().getDate() + 5)), startTime: '11:00', endTime: '12:30', description: 'Final review' },
];


export default function AppointmentsPage() {
  return (
    <>
      <PageHeader 
        title="Appointments" 
        description="Schedule and manage your appointments."
      />
      <AppointmentCalendar initialAppointments={MOCK_APPOINTMENTS} />
    </>
  );
}
