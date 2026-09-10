import RecommendationsSection from "@/components/media/RecommendationsSection";

export function MovieSimilarSection({ similar = [] }) {
  return (
    <RecommendationsSection
      key={similar.map((item) => item.id).join("-")}
      items={similar}
      mediaType="movie"
    />
  );
}
