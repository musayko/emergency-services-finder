// /client/src/components/JobDetailsModal.jsx
// SIMPLE TEST VERSION - Replace your file with this

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const JobDetailsModal = ({ job, children }) => {
  if (!job) return null;

  const imageUrl = `http://localhost:5001/${job.image_url}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>TEST - Can you see this?</DialogTitle>
          <DialogDescription>
            If you can see this, the modal is working!
          </DialogDescription>
        </DialogHeader>
        <div className="p-4 bg-red-500 text-white">
          <h2 className="text-2xl font-bold">MODAL IS OPEN</h2>
          <p>Job: {job.ai_identified_problem}</p>
        </div>
        <div className="grid gap-4 py-4">
          <div className="w-full">
            <img 
              src={imageUrl} 
              alt="Emergency" 
              className="rounded-md border max-w-full h-auto"
            />
          </div>
          <div>
            <h4 className="font-semibold">User's Description:</h4>
            <p className="text-sm text-muted-foreground">{job.user_description}</p>
          </div>
        </div>
        <DialogFooter>
          <Button>Claim Job</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsModal;