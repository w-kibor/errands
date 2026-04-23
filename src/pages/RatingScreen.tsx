import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, CheckCircle2 } from 'lucide-react';
import { mockRider } from '../data/mockData';
export const RatingScreen = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const tags = [
  'Fast delivery',
  'Friendly',
  'Careful handling',
  'Professional',
  'Good communication'];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };
  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      navigate('/home');
    }, 2000);
  };
  if (submitted) {
    return (
      <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        className="flex flex-col items-center justify-center h-full bg-white px-6 text-center">
        
        <motion.div
          initial={{
            scale: 0
          }}
          animate={{
            scale: 1
          }}
          transition={{
            type: 'spring',
            bounce: 0.5
          }}>
          
          <CheckCircle2 size={80} className="text-green-500 mb-6" />
        </motion.div>
        <h2 className="text-2xl font-bold text-dark mb-2">Thank You!</h2>
        <p className="text-gray-500">
          Your feedback helps us improve our service.
        </p>
      </motion.div>);

  }
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 50
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      className="flex flex-col h-full bg-white px-6 pt-12 pb-8">
      
      <div className="flex-1 flex flex-col items-center">
        <h1 className="text-2xl font-bold text-dark mb-8">
          How was your delivery?
        </h1>

        <img
          src={mockRider.avatar}
          alt={mockRider.name}
          className="w-24 h-24 rounded-full object-cover border-4 border-brand/20 mb-4" />
        
        <h2 className="text-lg font-bold text-dark">{mockRider.name}</h2>
        <p className="text-sm text-gray-500 mb-8">SwiftDrop Rider</p>

        {/* Stars */}
        <div className="flex space-x-2 mb-8">
          {[1, 2, 3, 4, 5].map((star) =>
          <button
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="p-1 transition-transform hover:scale-110">
            
              <Star
              size={40}
              className={`${star <= (hover || rating) ? 'fill-brand text-brand' : 'text-gray-200'} transition-colors`} />
            
            </button>
          )}
        </div>

        {rating > 0 &&
        <motion.div
          initial={{
            opacity: 0,
            y: 10
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          className="w-full space-y-6">
          
            <div className="flex flex-wrap justify-center gap-2">
              {tags.map((tag) =>
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedTags.includes(tag) ? 'bg-brand text-dark' : 'bg-gray-50 text-gray-600 border border-gray-200'}`}>
              
                  {tag}
                </button>
            )}
            </div>

            <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Add a comment (optional)"
            className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-sm outline-none focus:border-brand resize-none h-24" />
          
          </motion.div>
        }
      </div>

      <button
        onClick={handleSubmit}
        disabled={rating === 0}
        className={`w-full py-4 rounded-full font-bold text-lg transition-all ${rating > 0 ? 'bg-brand text-dark shadow-md active:scale-[0.98]' : 'bg-gray-100 text-gray-400'}`}>
        
        Submit Review
      </button>
    </motion.div>);

};