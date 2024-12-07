'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { toast } from 'react-toastify'
import { Search, Clock } from 'lucide-react'

interface TimeSlot {
    id: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
}

interface Speaker {
    id: string;
    expertise: string[];
    pricePerSession: number;
    bio: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
    };
    timeSlots?: TimeSlot[];
}

export default function UserDashboard() {
    const [speakers, setSpeakers] = useState<Speaker[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
    const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null)
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("")
    const [isBooking, setIsBooking] = useState(false)

    useEffect(() => {
        fetchSpeakers()
    }, [selectedDate])

    const fetchSpeakers = async () => {
        try {
            let url = 'http://localhost:3000/api/speakers'
            if (selectedDate) {
                url += `?date=${format(selectedDate, 'yyyy-MM-dd')}`
            }

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            })

            if (!response.ok) {
                throw new Error('Failed to fetch speakers')
            }

            const data = await response.json()
            setSpeakers(data.data.speakers || [])
        } catch (error) {
            console.error('Error fetching speakers:', error)
            toast.error('Failed to load speakers')
        } finally {
            setIsLoading(false)
        }
    }

    const handleBookSession = async () => {
        if (!selectedTimeSlot) {
            toast.error('Please select a time slot')
            return
        }

        setIsBooking(true)
        try {
            const response = await fetch('http://localhost:3000/api/booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    timeSlotId: selectedTimeSlot
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message)
            }

            toast.success('Session booked successfully!')
            setIsBookingModalOpen(false)
            setSelectedTimeSlot("")
            fetchSpeakers() // Refresh the list
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsBooking(false)
        }
    }

    const filteredSpeakers = speakers.filter(speaker =>
        !searchTerm ||
        speaker.expertise.some(exp =>
            exp.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        `${speaker.user.firstName} ${speaker.user.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <Input
                            placeholder="Search speakers by name or expertise..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 py-6"
                        />
                    </div>
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date()}
                        className="rounded-md border"
                    />
                </div>

                {isLoading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-gray-500">Loading speakers...</p>
                    </div>
                ) : filteredSpeakers.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No speakers found matching your criteria</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredSpeakers.map((speaker) => (
                            <Card key={speaker.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="text-xl font-semibold text-primary">
                                                {speaker.user.firstName[0]}{speaker.user.lastName[0]}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">
                                                {speaker.user.firstName} {speaker.user.lastName}
                                            </h3>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {speaker.expertise.map((exp, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                                                    >
                                                        {exp}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {speaker.bio}
                                    </p>

                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center text-gray-500 text-sm">
                                            <Clock className="h-4 w-4 mr-1" />
                                            <span>1 hour session</span>
                                        </div>
                                        <div className="text-lg font-semibold">
                                            ₹{speaker.pricePerSession}
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full"
                                        onClick={() => {
                                            if (!selectedDate) {
                                                toast.error('Please select a date first')
                                                return
                                            }
                                            setSelectedSpeaker(speaker)
                                            setIsBookingModalOpen(true)
                                        }}
                                        disabled={!selectedDate || !speaker.timeSlots?.some(slot => !slot.isBooked)}
                                    >
                                        {!selectedDate
                                            ? "Select a date to book"
                                            : !speaker.timeSlots?.some(slot => !slot.isBooked)
                                                ? "No slots available"
                                                : "Book Session"
                                        }
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Book Session with {selectedSpeaker?.user.firstName}</DialogTitle>
                            <DialogDescription>
                                Select a time slot for your session
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="grid gap-4">
                                {selectedSpeaker?.timeSlots
                                    ?.filter(slot => !slot.isBooked)
                                    .map((slot) => (
                                        <div
                                            key={slot.id}
                                            className={`p-4 rounded-lg border cursor-pointer ${selectedTimeSlot === slot.id
                                                    ? 'border-primary bg-primary/10'
                                                    : 'hover:border-primary/50'
                                                }`}
                                            onClick={() => setSelectedTimeSlot(slot.id)}
                                        >
                                            <p className="font-medium">
                                                {format(new Date(slot.startTime), 'h:mm a')} - {format(new Date(slot.endTime), 'h:mm a')}
                                            </p>
                                        </div>
                                    ))}
                            </div>
                            <Button
                                className="w-full"
                                onClick={handleBookSession}
                                disabled={isBooking || !selectedTimeSlot}
                            >
                                {isBooking ? "Booking..." : "Confirm Booking"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}
