'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from 'react-toastify'
import { format } from "date-fns"

interface TimeSlot {
    id: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
}

export default function TimeSlotsPage() {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
    const [isLoading, setIsLoading] = useState(false)
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
    const [isLoadingSlots, setIsLoadingSlots] = useState(false)

    // Fetch time slots when date is selected
    useEffect(() => {
        if (selectedDate) {
            fetchTimeSlots(selectedDate)
        }
    }, [selectedDate])

    const fetchTimeSlots = async (date: Date) => {
        setIsLoadingSlots(true)
        try {
            const response = await fetch(`http://localhost:3000/api/speakers/${localStorage.getItem('speakerId')}/time-slots?date=${format(date, 'yyyy-MM-dd')}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })
            const data = await response.json()
            if (response.ok) {
                setTimeSlots(data.data)
            }
        } catch (error) {
            console.error('Error fetching time slots:', error)
        } finally {
            setIsLoadingSlots(false)
        }
    }

    const handleGenerateSlots = async () => {
        if (!selectedDate) {
            toast.error('Please select a date')
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch(`http://localhost:3000/api/speakers/${localStorage.getItem('speakerId')}/time-slots`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    date: format(selectedDate, 'yyyy-MM-dd')
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message)
            }

            toast.success('Time slots generated successfully')
            // Refresh the time slots
            fetchTimeSlots(selectedDate)
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    // Store speakerId on login success
    useEffect(() => {
        const fetchSpeakerProfile = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/speakers/profile', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
                const data = await response.json()
                if (response.ok) {
                    localStorage.setItem('speakerId', data.data.id)
                }
            } catch (error) {
                console.error('Error fetching speaker profile:', error)
            }
        }

        if (!localStorage.getItem('speakerId')) {
            fetchSpeakerProfile()
        }
    }, [])

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Generate Time Slots</CardTitle>
                    <CardDescription>
                        Select a date to generate or view time slots (9 AM to 4 PM)
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex justify-center">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={(date) => date < new Date()}
                            className="rounded-md border"
                        />
                    </div>

                    {selectedDate && (
                        <>
                            <div className="flex justify-center">
                                <Button
                                    onClick={handleGenerateSlots}
                                    disabled={isLoading}
                                    className="w-full max-w-sm"
                                >
                                    {isLoading ? "Generating..." : "Generate Slots for Selected Date"}
                                </Button>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-medium">
                                    Time Slots for {format(selectedDate, 'MMMM d, yyyy')}
                                </h3>
                                {isLoadingSlots ? (
                                    <p className="text-center text-muted-foreground">Loading slots...</p>
                                ) : timeSlots.length === 0 ? (
                                    <p className="text-center text-muted-foreground">No slots generated for this date</p>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {timeSlots.map((slot) => (
                                            <div
                                                key={slot.id}
                                                className={`p-4 rounded-lg border ${slot.isBooked ? 'bg-gray-100' : 'bg-white'}`}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <p className="font-medium">
                                                            {format(new Date(slot.startTime), 'h:mm a')}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            to {format(new Date(slot.endTime), 'h:mm a')}
                                                        </p>
                                                    </div>
                                                    <span
                                                        className={`px-2 py-1 rounded text-sm ${
                                                            slot.isBooked
                                                                ? 'bg-red-100 text-red-800'
                                                                : 'bg-green-100 text-green-800'
                                                        }`}
                                                    >
                                                        {slot.isBooked ? 'Booked' : 'Available'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
