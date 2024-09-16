import StarRating from "./StarRating"
import { useState } from "react";

const StarRatingContainer = () => {
  const [filledCount, setFilledCount] = useState<number>(0);
  const handleFilledStarChange = (newFilledStars: number): void => setFilledCount(newFilledStars)
  return <StarRating max={5} filledCount={filledCount} onChange={handleFilledStarChange}/>
}
export default StarRatingContainer;