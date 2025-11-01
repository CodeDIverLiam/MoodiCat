import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const diarySchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  mood: z.enum(['happy', 'neutral', 'sad']),
  entryDate: z.string().optional()
});

export default function DiaryForm({ entry, onSubmit, onCancel, isLoading }) {
  // Get today's date using local timezone (not UTC)
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(diarySchema),
    defaultValues: entry || {
      title: '',
      content: '',
      mood: 'neutral',
      entryDate: today
    }
  });

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">
        {entry ? 'Edit Diary Entry' : 'Create Diary Entry'}
      </h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            {...register('title')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Enter diary title (optional)"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            {...register('entryDate')}
            type="date"
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
          />
          <p className="text-xs text-gray-500 mt-1">Today's date (read-only)</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mood
          </label>
          <select
            {...register('mood')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="happy">😊 Happy</option>
            <option value="neutral">😐 Neutral</option>
            <option value="sad">😢 Sad</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content *
          </label>
          <textarea
            {...register('content')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            rows={6}
            placeholder="Write your thoughts..."
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : (entry ? 'Update' : 'Create')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
