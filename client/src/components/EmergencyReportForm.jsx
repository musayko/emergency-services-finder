// /client/src/components/EmergencyReportForm.jsx

import React, { useState, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext'; // Using the alias
import jobService from '@/services/jobService';     // Using the alias

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const EmergencyReportForm = () => {
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  
  // State for loading and feedback messages
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { user } = useContext(AuthContext); // Get user info from our global state

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !image) {
      setMessage('Please provide a description and an image.');
      return;
    }

    setLoading(true); // Start loading
    setMessage('');   // Clear previous messages

    try {
      // Get the token from our user context
      const token = user?.token;
      if (!token) {
        throw new Error('Authentication token not found. Please log in again.');
      }

      // Call the API service
      const response = await jobService.submitJob(description, image, token);
      
      setMessage(response.data.message); // Show success message from the API
      // Optionally reset the form on success
      setDescription('');
      setImage(null);
      setPreview(null);

    } catch (error) {
      // Handle errors from the API
      const resMessage =
        (error.response && error.response.data && error.response.data.error) ||
        error.message ||
        error.toString();
      setMessage(resMessage);
    } finally {
      setLoading(false); // Stop loading, whether success or error
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto p-4 border rounded-lg bg-card text-card-foreground">
      <div className="grid w-full items-center gap-2">
        <Label htmlFor="description" className="text-left">Describe the issue:</Label>
        <Textarea
          id="description"
          placeholder="e.g., Water is leaking from the pipe under the kitchen sink."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          disabled={loading} // Disable form while loading
          className="min-h-[100px]"
        />
      </div>
      
      <div className="grid w-full items-center gap-2">
        <Label htmlFor="image" className="text-left">Upload a photo:</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
          disabled={loading} // Disable form while loading
        />
      </div>
      
      {preview && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-left">Image Preview:</h4>
          <img src={preview} alt="Emergency preview" className="rounded-md max-w-full h-auto border" />
        </div>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Emergency Report'}
      </Button>

      {/* Display feedback messages */}
      {message && <p className="mt-4 text-center">{message}</p>}
    </form>
  );
};

export default EmergencyReportForm;