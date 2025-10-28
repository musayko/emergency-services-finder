import { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '@/context/AuthContext';
import jobService from '@/services/jobService';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const EmergencyReportForm = () => {
  const { t } = useTranslation();
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { user } = useContext(AuthContext);

  const handleDescriptionChange = (e) => {
    // Basic sanitization: remove HTML tags
    const sanitizedDescription = e.target.value.replace(/<[^>]*>?/gm, '');
    setDescription(sanitizedDescription);
  };

  const handleImageChange = (e) => {
    setError(''); // Clear previous image errors
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validImageTypes.includes(file.type)) {
        setError(t('error_invalid_image_type'));
        setImage(null);
        setPreview(null);
        return;
      }

      // Validate file size (e.g., max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError(t('error_image_size_exceeded'));
        setImage(null);
        setPreview(null);
        return;
      }

      setImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setImage(null);
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !image) {
      setError(t('error_description_image_required'));
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const token = user?.token;
      if (!token) {
        throw new Error(t('error_auth_token_not_found'));
      }

      const response = await jobService.submitJob(description, image, token);
      
      setMessage(response.data.message);
      setDescription('');
      setImage(null);
      setPreview(null);

    } catch (err) {
      const resMessage =
        (err.response && err.response.data && err.response.data.error) ||
        err.message ||
        err.toString();
      setError(resMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('form_title')}</CardTitle>
        <CardDescription>{t('form_description')}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="description">{t('issue_description_label')}</Label>
            <Textarea
              id="description"
              placeholder={t('issue_description_placeholder')}
              value={description}
              onChange={handleDescriptionChange}
              required
              disabled={loading}
              className="min-h-[120px] bg-card"
            />
          </div>
          
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="image">{t('upload_photo_label')}</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              disabled={loading}
              className="bg-card"
            />
          </div>
          
          {preview && (
            <div className="space-y-2">
              <Label>{t('image_preview_label')}</Label>
              <div className="flex justify-center p-2 border rounded-md bg-muted">
                <img src={preview} alt={t('image_preview_alt')} className="rounded-md max-h-64 h-auto border" />
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-stretch">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? t('submitting_button') : t('submit_report_button')}
          </Button>
          {error && <p className="mt-3 text-sm text-center text-destructive">{error}</p>}
          {message && <p className="mt-3 text-sm text-center text-primary">{message}</p>}
        </CardFooter>
      </form>
    </Card>
  );
};

export default EmergencyReportForm;