'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type User = {
  id: number
  firstname: string
  lastname: string
  email: string
  address: string
}

export default function UserDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [newUser, setNewUser] = useState({ firstname: '', lastname: '', email: '', address: '' })
  const [editingUser, setEditingUser] = useState<User | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/getUsers')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      } else {
        toast.error('Failed to fetch users')
      }
    } catch (error) {
      toast.error('Error fetching users')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (editingUser) {
      setEditingUser({ ...editingUser, [name]: value })
    } else {
      setNewUser({ ...newUser, [name]: value })
    }
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('http://127.0.0.1:5000/addUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      })
      if (response.ok) {
        toast.success('User added successfully')
        setNewUser({ firstname: '', lastname: '', email: '', address: '' })
        fetchUsers()
      } else {
        toast.error('Failed to add user')
      }
    } catch (error) {
      toast.error('Error adding user')
    }
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return
    try {
      const response = await fetch(`http://127.0.0.1:5000/updateUser/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser),
      })
      if (response.ok) {
        toast.success('User updated successfully')
        setEditingUser(null)
        fetchUsers()
      } else {
        toast.error('Failed to update user')
      }
    } catch (error) {
      toast.error('Error updating user')
    }
  }

  const handleDeleteUser = async (userId: number) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/deleteUser/${userId}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        toast.success('User deleted successfully')
        fetchUsers()
      } else {
        toast.error('Failed to delete user')
      }
    } catch (error) {
      toast.error('Error deleting user')
    }
  }

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-center">User Management</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingUser ? 'Edit User' : 'Add New User'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={editingUser ? handleUpdateUser : handleAddUser} className="space-y-4">
            <Input
              name="firstname"
              placeholder="First Name"
              value={editingUser ? editingUser.firstname : newUser.firstname}
              onChange={handleInputChange}
              required
            />
            <Input
              name="lastname"
              placeholder="Last Name"
              value={editingUser ? editingUser.lastname : newUser.lastname}
              onChange={handleInputChange}
              required
            />
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={editingUser ? editingUser.email : newUser.email}
              onChange={handleInputChange}
              required
            />
            <Input
              name="address"
              placeholder="Address"
              value={editingUser ? editingUser.address : newUser.address}
              onChange={handleInputChange}
              required
            />
            <Button type="submit">
              {editingUser ? 'Update User' : 'Add User'}
            </Button>
            {editingUser && (
              <Button variant="outline" onClick={() => setEditingUser(null)} className="ml-2">
                Cancel
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>First Name</TableHead>
                <TableHead>Last Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.firstname}</TableCell>
                  <TableCell>{user.lastname}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.address}</TableCell>
                  <TableCell>
                    <Button variant="outline" onClick={() => setEditingUser(user)} className="mr-2">
                      Edit
                    </Button>
                    <Button variant="destructive" onClick={() => handleDeleteUser(user.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
