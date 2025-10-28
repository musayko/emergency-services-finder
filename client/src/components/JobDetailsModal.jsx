import { useTranslation } from 'react-i18next';
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

const JobDetailsModal = ({ job, children, onClaimJob, isClaiming }) => {
  const { t } = useTranslation();

  if (!job) return null;

  const imageUrl = `http://localhost:5001/${job.image_url}`;

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-2">
          <DialogTitle>{job.ai_identified_problem}</DialogTitle>
          <DialogDescription>
            {t('job_details_submitted')}: {new Date(job.created_at).toLocaleString()}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="w-full p-2 border rounded-md bg-muted aspect-video flex items-center justify-center overflow-hidden">
            <img 
              src={imageUrl} 
              alt={t('job_image_alt')}
              className="rounded-md w-full h-auto object-cover"
            />
          </div>
          <div className="space-y-2">
            <p className="text-base"><span className="font-semibold text-muted-foreground">{t('job_category_label')}:</span> {job.ai_identified_category}</p>
            <div>
              <p className="font-semibold text-muted-foreground mb-2">{t('job_user_description_label')}:</p>
              <p className="text-sm border p-3 rounded-md bg-card text-foreground">{job.user_description}</p>
            </div>
          </div>
        </div>
        <DialogFooter className="pt-4">
          <Button onClick={() => onClaimJob(job.id)} disabled={isClaiming} className="w-full">
            {isClaiming ? t('claiming_job_button') : t('claim_job_button')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default JobDetailsModal;
