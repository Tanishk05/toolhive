"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export function ToolRating({ slug }: { slug: string }) {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [average, setAverage] = useState(0);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/tools/${slug}/ratings`)
      .then((res) => res.json())
      .then((data) => {
        if (data.userRating) setRating(data.userRating);
        setAverage(data.average);
        setCount(data.count);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [slug]);

  const handleRate = async (value: number) => {
    if (!isSignedIn) {
      router.push(`/sign-in?redirect_url=${encodeURIComponent(window.location.href)}`);
      return;
    }
    
    const previousRating = rating;
    setRating(value);

    try {
      const res = await fetch(`/api/tools/${slug}/ratings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: value }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Thanks for your feedback!");
      
      // Refresh average
      const data = await fetch(`/api/tools/${slug}/ratings`).then((r) => r.json());
      setAverage(data.average);
      setCount(data.count);
    } catch {
      setRating(previousRating);
      toast.error("Failed to submit rating");
    }
  };

  if (isLoading) return <div className="h-6 w-32 animate-pulse rounded bg-muted"></div>;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1" onMouseLeave={() => setHoverRating(0)}>
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            className="text-muted-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
            onClick={() => handleRate(value)}
            onMouseEnter={() => setHoverRating(value)}
            aria-label={`Rate ${value} stars`}
            title={`Rate ${value} stars`}
          >
            <Star 
              className={`h-5 w-5 ${
                (hoverRating || rating) >= value 
                  ? "fill-amber-400 text-amber-400" 
                  : "fill-transparent hover:text-amber-400"
              }`} 
            />
          </button>
        ))}
      </div>
      <div className="flex items-center text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{average.toFixed(1)}</span>
        <span className="mx-1.5">•</span>
        <span>{count} {count === 1 ? 'rating' : 'ratings'}</span>
      </div>
    </div>
  );
}
