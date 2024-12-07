'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from 'react-toastify'

interface Profile {
  expertise: string[];
  pricePerSession: number;
  bio: string;
}

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [profile, setProfile] = useState<Profile>({
    expertise: [],
    pricePerSession: 0,
    bio: ""
  })
  const [newExpertise, setNewExpertise] = useState("")

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/speakers/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      if (response.ok) {
        setProfile(data.data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const handleAddExpertise = () => {
    if (newExpertise.trim()) {
      setProfile(prev => ({
        ...prev,
        expertise: [...prev.expertise, newExpertise.trim()]
      }))
      setNewExpertise("")
    }
  }

  const handleRemoveExpertise = (index: number) => {
    setProfile(prev => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:3000/api/speakers/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(profile)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message)
      }

      toast.success('Profile updated successfully')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Speaker Profile</CardTitle>
        <CardDescription>
          Set up your speaker profile to start accepting bookings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Price per Session (₹)</label>
            <Input
              type="number"
              value={profile.pricePerSession}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                pricePerSession: parseFloat(e.target.value)
              }))}
              min="0"
              step="100"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Expertise</label>
            <div className="flex gap-2">
              <Input
                value={newExpertise}
                onChange={(e) => setNewExpertise(e.target.value)}
                placeholder="Add expertise"
              />
              <Button type="button" onClick={handleAddExpertise}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.expertise.map((exp, index) => (
                <span
                  key={index}
                  className="bg-primary/10 text-primary px-2 py-1 rounded-md flex items-center gap-2"
                >
                  {exp}
                  <button
                    type="button"
                    onClick={() => handleRemoveExpertise(index)}
                    className="text-primary hover:text-primary/80"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Bio</label>
            <Textarea
              value={profile.bio}
              onChange={(e) => setProfile(prev => ({
                ...prev,
                bio: e.target.value
              }))}
              placeholder="Tell us about yourself..."
              rows={4}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
