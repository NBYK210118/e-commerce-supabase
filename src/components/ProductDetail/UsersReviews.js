import { supabase } from '../../supabase';
import { Review } from './Reviews';

export const UsersReviews = ({ reviews = [], reviewList, profile }) => {
  if (reviewList && reviews.length > 0) {
    const path = profile.imgFile.path;
    const { data } = supabase.storage.from('Products').getPublicUrl(path);
    return (
      <>
        {reviews.map((review, idx) => (
          <Review
            key={idx}
            stars={review.stars}
            nickname={profile.nickname}
            txt={review.content}
            profileImg={data.publicUrl}
          />
        ))}
      </>
    );
  } else return null;
};
